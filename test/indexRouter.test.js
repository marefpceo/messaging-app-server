const indexRouter = require('../routes/indexRouter');

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

// Test POST signup routes
describe('POST /signup', () => {
  test('POST signup router works', (done) => {
    request(app)
      .post('/signup')
      .send({
        first_name: 'Fname',
        last_name: 'Lname',
        dob: '2025-5-13',
        email: 'flname@test.com',
        username: 'flname',
        password: 'kkkkkkkkk',
      })
      .set('Accept', 'application/json')
      .expect({ message: 'signup POST route' })
      .expect(200, done);
  });
});

// Test POST login routes
describe('POST /login', () => {
  test('POST login router works', (done) => {
    request(app)
      .post('/login')
      .set('Application', 'application/json')
      .expect({ message: 'login POST route' })
      .expect(200, done);
  });
});
