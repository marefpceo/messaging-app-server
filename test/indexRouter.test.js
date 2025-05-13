const indexRouter = require('../routes/indexRouter');

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

// Test index route
describe('GET /', () => {
  test('index route works', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect({ message: 'mCHAT' })
      .expect(200, done);
  });
});

// Test GET and POST signup routes
describe('GET and POST /signup', () => {
  test('GET signup route works', (done) => {
    request(app)
      .get('/signup')
      .expect('Content-Type', /json/)
      .expect({ message: 'signup GET route' })
      .expect(200, done);
  });

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

// Test GET and POST login routes
describe('GET /login', () => {
  test('GET login route works', (done) => {
    request(app)
      .get('/login')
      .set('Application', 'application/json')
      .expect({ message: 'login GET route' })
      .expect(200, done);
  });

  test('POST login router works', (done) => {
    request(app)
      .post('/login')
      .set('Application', 'application/json')
      .expect({ message: 'login POST route' })
      .expect(200, done);
  });
});
