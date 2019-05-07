const app = require('../src/app');

describe('App', () => {
  it('GET / responds with 500 when entering no user', () => {
    return supertest(app)
      .get('/api/users')
      .expect(500);
  });

  it('POST / responds with 400 no username', () => {
    let body = {
      "password": 1234
    }
    return supertest(app)
      .post('/api/users')
      .send(body)
      .expect(400);
  });

  it('POST / responds with 400 no password', () => {
    let body = {
      "user_name": 'matt'
    }
    return supertest(app)
      .post('/api/users')
      .send(body)
      .expect(400);
  });
});