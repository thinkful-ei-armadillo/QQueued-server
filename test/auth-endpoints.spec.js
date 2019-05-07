/* global supertest */

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
      connection: 'postgres://jon@localhost/capstone-III-test'
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helper.cleanTables(db));
  before('create tables', () => helper.createTables(db));
  
  describe('POST /api/auth', () => {
    afterEach('cleanup', () => helper.cleanTables(db));
    beforeEach('insert user', () => {
      helper.seedUser(
        db,
        testUsers
      );
    });

    const requiredFields = ['password', 'name'];

    requiredFields.forEach(f => {
      const loginAttempt = {
        name: testUser.user_name,
        password: testUser.password
      };

      it(`responds with 400 required error when ${f} is missing`, () => {
        delete loginAttempt[f];
        
        return supertest(app)
          .post('/api/auth')
          .send(loginAttempt)
          .expect(400);
      });
    });

  });
});