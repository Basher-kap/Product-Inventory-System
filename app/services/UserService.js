// app/services/UserService.js
// PostgreSQL-based User data access layer

const pool = require('../../db/pgPool');

class UserService {
  /**
   * Find a user by username
   * @param {string} username
   * @returns {Promise<Object|null>}
   */
  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    console.log('UserService.findByUsername', { username, host: process.env.PGHOST, port: process.env.PGPORT || process.env.PG_PORT, database: process.env.PGDATABASE || process.env.PG_DATABASE });
    try {
      const result = await pool.query(query, [username]);
      console.log('UserService.findByUsername result rows', result.rows.length);
      return result.rows[0] || null;
    } catch (err) {
      console.error('UserService.findByUsername error:', err);
      throw err;
    }
  }

  /**
   * Create a new user
   * @param {Object} userData - { username, password, firstName, middleName, lastName, address, email }
   * @returns {Promise<Object>} - created user
   */
  static async create(userData) {
    const { username, password, firstName = '', middleName = '', lastName = '', address = '', email = '' } = userData;
    
    const query = `INSERT INTO users (username, password, first_name, middle_name, last_name, address, email)
                   VALUES ($1, $2, $3, $4, $5, $6, $7)
                   RETURNING *`;
    
    const result = await pool.query(query, [username, password, firstName, middleName, lastName, address, email]);
    return result.rows[0];
  }

  /**
   * Update user profile
   * @param {string} username
   * @param {Object} updates - { firstName, middleName, lastName, address, email }
   * @returns {Promise<Object>} - updated user
   */
  static async updateProfile(username, updates) {
    const { firstName, middleName, lastName, address, email } = updates;
    
    const query = `UPDATE users
                   SET first_name = COALESCE($1, first_name),
                       middle_name = COALESCE($2, middle_name),
                       last_name = COALESCE($3, last_name),
                       address = COALESCE($4, address),
                       email = COALESCE($5, email)
                   WHERE username = $6
                   RETURNING *`;
    
    const result = await pool.query(query, [firstName, middleName, lastName, address, email, username]);
    return result.rows[0] || null;
  }

  /**
   * Verify user password (simple check)
   * @param {string} username
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  static async verifyPassword(username, password) {
    const user = await this.findByUsername(username);
    if (!user) return false;
    return user.password === password; // TODO: use bcrypt for production
  }

  /**
   * Get all users
   * @returns {Promise<Array>}
   */
  static async findAll() {
    const query = 'SELECT username, first_name, last_name, email, address FROM users';
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Delete a user
   * @param {string} username
   * @returns {Promise<boolean>}
   */
  static async delete(username) {
    const query = 'DELETE FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rowCount > 0;
  }
}

module.exports = UserService;
