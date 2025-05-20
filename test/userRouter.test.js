const userRouter = require('../routes/userRouter');

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/user', userRouter);

// Test GET User Profile
describe('GET /user/:user/edit_profile', () => {
  it('get user profile route works', (done) => {
    request(app)
      .get('/user/:user/edit_profile')
      .expect('Content-Type', /json/)
      .expect({ message: 'Edit Profile GET' })
      .expect(200, done);
  });
});

// Test PUT edit profile
describe('PUT /user/:user/edit_profile', () => {
  test('put user edit profile route works', (done) => {
    request(app)
      .put('/user/:user/edit_profile')
      .set('Content-Type', 'application/json')
      .send({ message: 'Update profile' })
      .expect('Content-Type', /json/)
      .expect({ message: 'Edit Profile PUT' })
      .expect(200, done);
  });
});
