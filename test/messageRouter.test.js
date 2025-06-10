const messageRouter = require('../routes/messageRouter');

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use('/message', messageRouter);

// Test GET Conversation list
describe('Test all messageRouter routes', () => {
  test('conversation list route works', async () => {
    const response = await request(app).get('/message/conversations');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Conversation List GET' });
  });

  test('Create message POST route works', async () => {
    const response = await request(app)
      .post('/message/create_message')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ message: 'test' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Create Message POST' });
  });

  test('GET selected conversation route works', async () => {
    const response = await request(app).get(
      '/message/conversation/contact-id-generated',
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 'contact-id-generated',
      message: 'Conversation GET',
    });
  });

  test('DELETE selected conversation route works', async () => {
    const response = await request(app).delete(
      '/message/conversation/:contactId',
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Conversation DELETE' });
  });

  test('GET selected conversation message route works', async () => {
    const response = await request(app).get(
      '/message/conversation/:contactId/:messageId',
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Message GET' });
  });

  test('DELTE message route works', async () => {
    const response = await request(app).delete(
      '/message/conversation/:contactId/:messageId',
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Message DELETE' });
  });
});
