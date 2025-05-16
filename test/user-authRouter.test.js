const authRouter = require('../routes/authRouter');

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/auth/user', authRouter);

// Test GET User Profile
describe('GET /auth/user/:user/edit_profile', () => {
  it('get user profile route works', async () => {
    const response = await request(app)
      .get('/auth/user/:user/edit_profile')
      .set('Accept', 'application/json');
    expect(response.headers['Content-Type']).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual('Edit Profile GET');
  });
});

// Test PUT edit profile
describe('PUT /auth/user/:user/edit_profile', () => {
  test('put user edit profile rout works', (done) => {
    request(app)
      .put('/auth/user/:user/edit_profile')
      .send({ message: 'Update profile' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({
        message: 'Edit Profile PUT',
        return: 'Update profile',
      })
      .expect(200, done);
  });
});
