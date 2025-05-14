const authRouter = require('../routes/authRouter');

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/message', authRouter);

// Test GET Conversation list
describe('GET /message/conversations', () => {
  test('conversation list route works', (done) => {
    request(app)
      .get('/message/conversations')
      .expect('Content-Type', /json/)
      .expect({ message: 'Conversation List GET' })
      .expect(200, done);
  });
});

// Test GET create message
describe('GET /message/create_message', () => {
  test('create message GET route works', (done) => {
    request(app)
      .get('/message/create_message')
      .expect('Content-Type', /json/)
      .expect({ message: 'Create Message GET' })
      .expect(200, done);
  });
});

// Test POST create message
describe('POST /message/create_message_post', () => {
  test('create message POST route works', (done) => {
    request(app).post('/message/create_message_post');
  });
});

// Test GET conversation
describe('GET /message/conversation/:contactId', () => {
  test('get selected conversation GET route works', (done) => {
    request(app)
      .get('/message/conversation/contact-id-generated')
      .expect('Content-Type', /json/)
      .expect({
        id: 'contact-id-generated',
        message: 'Conversation GET',
      });
  });
});
