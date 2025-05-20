const messageRouter = require('../routes/messageRouter');

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/message', messageRouter);

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

// Test POST create message
describe('POST /message/create_message_post', () => {
  test('create message POST route works', (done) => {
    request(app)
      .post('/message/create_message')
      .set('Accept', 'application/json')
      .send({ message: 'test' })
      .expect('Content-Type', /json/)
      .expect({ message: 'Create Message POST' })
      .expect(200, done);
  });
});

// Test GET selected conversation
describe('GET /message/conversation/:contactId', () => {
  test('get selected conversation GET route works', (done) => {
    request(app)
      .get('/message/conversation/contact-id-generated')
      .expect('Content-Type', /json/)
      .expect({
        id: 'contact-id-generated',
        message: 'Conversation GET',
      })
      .expect(200, done);
  });
});

// Test DELETE conversation
describe('DELETE /message/conversation/:contactId', () => {
  test('delete selected conversation route works', (done) => {
    request(app)
      .delete('/message/conversation/:contactId')
      .expect('Content-Type', /json/)
      .expect({ message: 'Conversation DELETE' })
      .expect(200, done);
  });
});

// Test GET message
describe('GET /message/conversation/:contactId/:messageId', () => {
  test('get selected conversation message route works', (done) => {
    request(app)
      .get('/message/conversation/:contactId/:messageId')
      .expect('Content-Type', /json/)
      .expect({ message: 'Message GET' })
      .expect(200, done);
  });
});

// Test DELETE message
describe('DELETE /message/conversation/:contactId/:messageId', () => {
  test('delete message route works', (done) => {
    request(app)
      .delete('/message/conversation/:contactId/:messageId')
      .expect('Content-Type', /json/)
      .expect({ message: 'Message DELETE' })
      .expect(200, done);
  });
});
