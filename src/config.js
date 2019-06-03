module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_ENDPOINT: process.env.API_ENDPOINT,
  DATABASE_URL: process.env.DATABASE_URL,
  TEST_DB_URL: process.env.TEST_DB_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'blogful-client-auth-token',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
  SLACK_ENDPOINT:'https://slack.com/api',
  BOT_TOKEN: 'xoxb-649980807239-652020601830-NvTxiEqSK14UcQwTzS2KjwVT'
};
