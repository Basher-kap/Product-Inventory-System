require('dotenv').config();
const db = require('./app/db');

const users = [
  { username: 'Basher', password: 'Bash_123' },
  { username: 'Nagi', password: '02172005' }
];

(async () => {
  try {
    for (const userData of users) {
      await db.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING',
        [userData.username, userData.password]
      );
      console.log(`Upserted user: ${userData.username}`);
    }
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
})();