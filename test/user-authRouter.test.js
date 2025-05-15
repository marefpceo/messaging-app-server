const authRouter = require('../routes/authRouter');

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/user', authRouter);

// Test GET User Profile
describe('GET /user/:user/edit_profile', () => {
  test('get user profile route works', (done) => {
    request(app)
      .get('/user/:user/edit_profile')
      .expect('Content-Type', /json/)
      .expect({ message: 'Edit Profile GET' })
      .expect(200, done);
  });
});

// Test PUT edit profile
describe('PUT /user/:user/edit_profile', () => {
  test('put user edit profile rout works', (done) => {
    request(app)
      .put('/user/:user/edit_profile')
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
