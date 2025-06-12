const messageRouter = require('../routes/messageRouter');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use('/message', messageRouter);

// Test message controller to create and delete conversations and messages
describe('Test all messageRouter routes', () => {
  let newConversationId = '';

  test('GET request to verify userOne1 has no conversations', async () => {
    const response = await request(app).get('/message/userOne1/conversations');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  test(`Get userOne1 info to create new conversation and message`, async () => {
    const response = await request(app).get('/message/userOne1/create_message');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        contacts: expect.any(Array),
      }),
    );
  });

  test(`Create new conversation and message from 'userOne1' to 'userFive'`, async () => {
    const userOneId = await prisma.user.findUnique({
      where: {
        username: 'userOne1',
      },
      select: {
        id: true,
      },
    });
    const userFiveId = await prisma.user.findUnique({
      where: {
        username: 'userFive',
      },
      select: {
        id: true,
      },
    });
    const response = await request(app)
      .post('/message/userOne1/create_message')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        subject: 'New Message',
        senderId: userOneId.id,
        recipientId: userFiveId.id,
        context: 'Message to userFive for test purposes!',
        newConversation: true,
      });
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Message sent to userFive' });
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
