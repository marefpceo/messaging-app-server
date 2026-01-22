require('dotenv').config();

const { PrismaClient } = require('../generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const contactRouter = require('../routes/contactRouter');

const request = require('supertest');
const express = require('express');
const app = require('../app');
const agent = request.agent(app);

app.use(express.urlencoded({ extended: true }));
app.use('/contact', contactRouter);

// Test contactRouter routes
describe('Test all contactRouter routes', () => {
  // Clears session data from database when complete
  afterAll(async () => {
    await prisma.session.deleteMany({});
  });

  // Log userOne in to validate and persist session
  test('should log in userOne', async () => {
    await agent
      .post('/login')
      .send({ email: 'userOne@test.com', password: 'kkkkkkkkk' })
      .expect(200);
  });

  test('GET all contacts', async () => {
    const response = await agent
      .get('/contact')
      .set('Content-Type', 'application/json');
    response.body.forEach((item) => {
      expect(item).toMatchObject({
        id: expect.any(Number),
        firstname: expect.any(String),
        lastname: expect.any(String),
        username: expect.any(String),
      });
    });
  });

  test(`POST route to add contact 'userThree' to 'userOne1' works`, async () => {
    const responseData = await agent
      .post('/contact/add')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        currentUser: 'userOne1',
        addUser: 'userThree',
      });
    expect(responseData.status).toBe(200);
    expect(responseData.body.message).toBe('userThree added!');
  });

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

  test(`GET route to return all 'userOne1' contacts by username`, async () => {
    const responseData = await agent.get('/contact/userOne1/contact_list');
    expect(responseData.status).toBe(200);
    responseData.body.forEach((item) => {
      expect(item).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          username: expect.any(String),
        }),
      );
    });
  });

  test(`DELETE 'userFive' from 'userOne1' works`, async () => {
    const responseData = await agent
      .delete('/contact/userOne1/delete')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ contactToRemove: 'userFive' });
    expect(responseData.statusCode).toBe(200);
    expect(responseData.body.message).toEqual('userFive DELETED');
  });

  test(`DELETE 'userThree' from 'userOne' works`, async () => {
    const responseData = await agent
      .delete('/contact/userOne1/delete')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ contactToRemove: 'userThree' });

    expect(responseData.statusCode).toBe(200);
    expect(responseData.body.message).toBe('userThree DELETED');
  });

  test(`Verify 'userOne1' has no contacts`, async () => {
    const userInfo = await prisma.user.findUnique({
      where: {
        username: 'userOne1',
      },
      include: {
        contacts: true,
      },
    });
    expect(userInfo.contacts.length).toBe(0);
  });
});
