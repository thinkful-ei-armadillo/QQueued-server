const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helper = require('./test-helpers');

describe('Auth endpoints', () => {
  let db;

  const { testUsers } = helper.createFixtures();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helper.cleanTables(db));
  afterEach('cleanup', () => helper.cleanTables(db));

  describe('POST /api/auth', () => {
    
  })
});