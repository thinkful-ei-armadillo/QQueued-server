/* global supertest */
const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helper = require('./test-helpers');

describe('Auth endpoints', () => {
  let db;
  let bearerToken;

  const { testUsers } = helper.createFixtures();
  const testUser = testUsers[0];


  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: 'postgresql://jon@localhost/capstone-III-test'
    });
    app.set('db', db);
  });
  
  before('create tables', () => helper.createTables(db));
  before('seed users', () => helper.seedUser(db, testUsers));
  after('cleanup', () => helper.cleanTables(db));
  after('disconnect from db', () => db.destroy());
  
  describe('POST /api/auth', () => {
    context('Given the user enters incorrect information', () => {
      it('responds with 400 and Incorrect username or password', () => {
        let body = {
          user_name: 'wrongusername',
          password: testUser.user_name
        };
        return supertest(app)
          .post('/api/auth')
          .send(body)
          .expect(400, { error: 'Incorrect username or password' });
      });

    });
    context('Given that the user enters correct information', () => {
      
      it('responds with authToken', () => {
        bearerToken = helper.makeAuthHeader(testUsers[0], process.env.JWT_SECRET);
        const authToken = bearerToken.slice(7, bearerToken.length);
        const body = {
          user_name: testUsers[0].user_name,
          password: testUsers[0].password
        };
        return supertest(app)
          .post('/api/auth')
          .send(body)
          .expect({ authToken });
      });
    });
  });
});