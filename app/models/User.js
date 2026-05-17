const db = require('../db');

const userColumns = 'username, password, first_name AS "firstName", middle_name AS "middleName", last_name AS "lastName", address, email';

async function findByUsername(username) {
  const result = await db.query(`SELECT ${userColumns} FROM users WHERE username = $1`, [username]);
  return result.rows[0];
}

async function findAll() {
  const result = await db.query('SELECT username, password FROM users');
  return result.rows;
}

async function create(user) {
  await db.query(
    'INSERT INTO users (username, password) VALUES ($1, $2)',
    [user.username, user.password]
  );
}

async function findProfile(username) {
  const result = await db.query(
    `SELECT username, first_name AS "firstName", middle_name AS "middleName", last_name AS "lastName", address, email FROM users WHERE username = $1`,
    [username]
  );
  return result.rows[0];
}

async function updateProfile(username, profile) {
  await db.query(
    'UPDATE users SET first_name = $1, middle_name = $2, last_name = $3, address = $4, email = $5 WHERE username = $6',
    [profile.firstName, profile.middleName, profile.lastName, profile.address, profile.email, username]
  );
}

async function updatePassword(username, newPassword) {
  await db.query('UPDATE users SET password = $1 WHERE username = $2', [newPassword, username]);
}

module.exports = {
  findByUsername,
  findAll,
  create,
  findProfile,
  updateProfile,
  updatePassword
};