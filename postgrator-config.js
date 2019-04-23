require('dotenv').config();

module.exports = {
<<<<<<< HEAD
  'migrationDirectory': 'migrations',
  'driver': 'pg',
  'host': process.env.MIGRATION_DB_HOST,
  'port': process.env.MIGRATION_DB_PORT,
  'database': process.env.MIGRATION_DB_NAME,
  'username': process.env.MIGRATION_DB_USER,
  'password': process.env.MIGRATION_DB_PASS,
=======
  migrationDirectory: 'migrations',
  driver: 'pg',
  host: process.env.MIGRATION_DB_HOST,
  port: process.env.MIGRATION_DB_PORT,
  database: process.env.MIGRATION_DB_NAME,
  username: process.env.MIGRATION_DB_USER,
  password: process.env.MIGRATION_DB_PASS
>>>>>>> 91a24c5807af09cebecf257715274f03502366d8
};
