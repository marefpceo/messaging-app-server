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
  });

  it('should log in userOne', async () => {
    await agent
      .post('/login')
      .send({ email: 'userOne@test.com', password: 'kkkkkkkkk' })
      .expect(200);
  });

  test('GET request to verify userOne1 has no messages', async () => {
    const response = await agent.get('/message/userOne1/messages');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  test(`Get userOne1 info to create new conversation and message`, async () => {
    const response = await agent.get('/message/userOne1/create_message');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        contacts: expect.any(Array),
      }),
    );
  });

  // test(`Create new conversation and message from 'userOne1' to 'userFive'`, async () => {
  //   const userOneId = await prisma.user.findUnique({
  //     where: {
  //       username: 'userOne1',
  //     },
  //     select: {
  //       id: true,
  //     },
  //   });
  //   const userFiveId = await prisma.user.findUnique({
  //     where: {
  //       username: 'userFive',
  //     },
  //     select: {
  //       id: true,
  //     },
  //   });
  //   const response = await request(app)
  //     .post('/message/userOne1/create_message')
  //     .set('Content-Type', 'application/x-www-form-urlencoded')
  //     .send({
  //       subject: 'New Message',
  //       senderId: userOneId.id,
  //       recipientId: userFiveId.id,
  //       context: 'Message to userFive for test purposes!',
  //     });
  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual({
  //     message: 'New message created!',
  //     id: expect.any(Number),
  //   });
  // });

  // test(`Create new message with existing conversation from 'userFive' to 'userOne1'`, async () => {
  //   const userFiveId = await prisma.user.findUnique({
  //     where: {
  //       username: 'userFive',
  //     },
  //     select: {
  //       id: true,
  //     },
  //   });
  //   const userOneId = await prisma.user.findUnique({
  //     where: {
  //       username: 'userOne1',
  //     },
  //     select: {
  //       id: true,
  //     },
  //   });

  //   const response = await request(app)
  //     .put('/message/userFive/create_message')
  //     .set('Content-Type', 'application/x-www-form-urlencoded')
  //     .send({
  //       senderId: userFiveId.id,
  //       recipientId: userOneId.id,
  //       context: 'User Five reply to User One message.',
  //     });
  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual({
  //     message: 'New message created',
  //   });
  // });

  // test('GET selected message route works', async () => {
  //   const message = await prisma.message.findFirst({
  //     where: {
  //       sender: {
  //         username: 'userOne1',
  //       },
  //     },
  //   });
  // });

  // test('DELETE selected message route works', async () => {
  //   const message = await prisma.message.findFirst({
  //     where: {
  //       sender: {
  //         username: 'userOne1',
  //       },
  //     },
  //   });
  // });
});
