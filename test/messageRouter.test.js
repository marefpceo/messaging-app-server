const messageRouter = require('../routes/messageRouter');

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/message', messageRouter);

// Test GET Conversation list
describe('GET /conversations', () => {
  test('conversation list route works', (done) => {
    request(app)
      .get('/conversations')
      .expect('Content-Type', /json/)
      .expect({ message: 'Conversation List GET' })
      .expect(200, done);
  });
});

// Test GET create message
describe('GET /create_message', () => {
  test('create message GET route works', (done) => {
    request(app)
      .get('/create_message')
      .expect('Content-Type', /json/)
      .expect({ message: 'Create Message GET' })
      .expect(200, done);
  });
});

// Test POST create message
describe('POST /create_message_post', () => {
  test('create message POST route works', (done) => {
    request(app)
      .post('/create_message_post')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({ message: 'Create Message POST' })
      .expect(200, done);
  });
});

// Test GET selected conversation
describe('GET /conversation/:contactId', () => {
  test('get selected conversation GET route works', (done) => {
    request(app)
      .get('/conversation/contact-id-generated')
      .expect('Content-Type', /json/)
      .expect({
        id: 'contact-id-generated',
        message: 'Conversation GET',
      })
      .expect(200, done);
  });
});

// Test DELETE conversation
describe('DELETE /conversation/:contactId', () => {
  test('delete selected conversation route works', (done) => {
    request(app)
      .delete('/conversation/:contactId')
      .expect('Content-Type', /json/)
      .expect({ message: 'Conversation DELETE' })
      .expect(200, done);
  });
});

// Test GET message
describe('GET /conversation/:contactId/:messageId', () => {
  test('get selected conversation message route works', (done) => {
    request(app)
      .get('/conversation/:contactId/:messageId')
      .expect('Content-Type', /json/)
      .expect({ message: 'Message GET' })
      .expect(200, done);
  });
});

// Test DELETE message
describe('DELETE /conversation/:contactId/:messageId', () => {
  test('delete message route works', (done) => {
    request(app)
      .delete('/conversation/:contactId/:messageId')
      .expect('Content-Type', /json/)
      .expect({ message: 'Message DELETE' })
      .expect(200, done);
  });
});
