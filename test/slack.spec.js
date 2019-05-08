require("dotenv").config();
const app = require('../src/app');

describe('Slack route', () => {
  it('POST / responds with 400 if when missing body"', () => {
    return supertest(app)
      .post('/api/slack')
      .expect(400, {"error": "Missing description in request"});
  });

  it('POST / responds with 400 if body is wrong"', () => {
    let body = {
      "user_id": 'UJ3CMD8UV',
      "text": 'git-rekt',
      "user_name": 'matth3wn'
    }
    
    return supertest(app)
      .post('/api/slack')
      .send(body)
      .expect(400);
  });

  it('POST /event 200 responses if challenge missing', () => {
    return supertest(app)
    .post('/api/slack/events')
    .expect(200)
  })
});