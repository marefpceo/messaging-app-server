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

  afterAll(async () => {
    await prisma.conversation.deleteMany({});
  });

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
    newConversationId = response.body.id;
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'New conversation created!',
      id: expect.any(Number),
    });
  });

  test(`Create new message with existing conversation from 'userFive' to 'userOne1'`, async () => {
    const userFiveId = await prisma.user.findUnique({
      where: {
        username: 'userFive',
      },
      select: {
        id: true,
      },
    });
    const userOneId = await prisma.user.findUnique({
      where: {
        username: 'userOne1',
      },
      select: {
        id: true,
      },
    });

    const response = await request(app)
      .put('/message/userFive/create_message')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        senderId: userFiveId.id,
        recipientId: userOneId.id,
        context: 'User Five reply to User One message.',
        newConversation: false,
        newConversationId: newConversationId,
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'New message created',
    });
  });

  test(`GET selected conversation with 'userOne1' works`, async () => {
    const response = await request(app).get(
      `/message/userOne1/conversation/${newConversationId}`,
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: newConversationId,
      subject: 'New Message',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      messages: expect.any(Array),
    });
  });

  test(`GET selected conversation with 'userFive' works`, async () => {
    const response = await request(app).get(
      `/message/userFive/conversation/${newConversationId}`,
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: newConversationId,
      subject: 'New Message',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      messages: expect.any(Array),
    });
  });

  test('GET selected message route works', async () => {
    const message = await prisma.message.findFirst({
      where: {
        sender: {
          username: 'userOne1',
        },
      },
    });
    const response = await request(app).get(
      `/message/userOne1/conversation/${message.conversationId}/${message.id}`,
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        context: expect.any(String),
      }),
    );
  });

  test('DELETE selected message route works', async () => {
    const message = await prisma.message.findFirst({
      where: {
        sender: {
          username: 'userOne1',
        },
      },
    });
    const response = await request(app).delete(
      `/message/userOne1/conversation/${message.conversationId}/${message.id}`,
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: `Message ${message.id} moved to trash`,
    });
  });

  test('DELETE selected conversation route works', async () => {
    const conversation = await prisma.conversation.findFirst();

    const response = await request(app).delete(
      `/message/userOne1/conversation/${conversation.id}`,
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: `Conversation ${conversation.subject} deleted`,
    });
  });
});
