require('dotenv').config();

module.exports = {
  migrationDirectory: 'migrations',
  driver: 'pg',
  host: process.env.PROD_MIGRATION_DB_HOST,
  port: process.env.PROD_MIGRATION_DB_PORT,
  database: process.env.PROD_MIGRATION_DB_NAME,
  username: process.env.PROD_MIGRATION_DB_USER,
  password: process.env.PROD_MIGRATION_DB_PASS,
  JWT_SECRET: process.env.JWT_SECRET,
  ssl: true
};
