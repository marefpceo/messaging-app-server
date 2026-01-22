require('dotenv').config();

const messageRouter = require('../routes/messageRouter');

const { PrismaClient } = require('../generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const request = require('supertest');
const express = require('express');
const app = require('../app');
const agent = request.agent(app);

app.use(express.urlencoded({ extended: true }));
app.use('/message', messageRouter);

// Test message controller to create and delete conversations and messages
describe('Test all messageRouter routes', () => {
  afterAll(async () => {
    await prisma.message.deleteMany({});
    await prisma.session.deleteMany({});
  });

  test('should log in userOne', async () => {
    await agent
      .post('/login')
      .send({ email: 'userOne@test.com', password: 'kkkkkkkkk' })
      .expect(200);
  });
  // add user to test creating new message
  test(`POST route to add contact 'userFive' to 'userOne1' works`, async () => {
    const responseData = await agent
      .post('/contact/add')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        currentUser: 'userOne1',
        addUser: 'userFive',
      });
    expect(responseData.status).toBe(200);
    expect(responseData.body.message).toBe('userFive added!');
  });

  test('GET request to verify userOne1 has no messages', async () => {
    const response = await agent.get('/message/userOne1/messages');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  test(`Get userOne1 info to create new message`, async () => {
    const response = await agent.get('/message/userOne1/create-message');
    expect(response.status).toBe(200);
    response.body.forEach((item) => {
      expect(item).toEqual(
        expect.objectContaining({
          contactUser: {
            id: expect.any(Number),
            username: expect.any(String),
          },
        }),
      );
    });
  });

  test(`Create new message from 'userOne1' to 'userFive'`, async () => {
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
    const response = await agent
      .post('/message/userOne1/create-message')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        senderId: userOneId.id,
        recipientId: userFiveId.id,
        context: 'Message to userFive for test purposes!',
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'New message created!',
      id: expect.any(Number),
    });
  });

  test('DELETE selected message route works', async () => {
    const message = await prisma.message.findFirst({
      where: {
        sender: {
          username: 'userOne1',
        },
      },
    });
  });
});
