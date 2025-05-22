const indexRouter = require('../routes/indexRouter');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const request = require('supertest');
const express = require('express');
const app = require('../app');

app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

// Test POST signup routes
describe('Test signup route to create a new user', () => {
  afterAll(async () => {
    await prisma.user.delete({
      where: {
        email: 'flname@test.com',
      },
    });
  });
  // Test create new user
  test('POST signup route and create new user', async () => {
    const testUser = {
      firstname: 'Fnametest',
      lastname: 'Lnametest',
      date_of_birth: '2025-05-13',
      email: 'flname@test.com',
      password: 'kkkkkkkkk',
    };
    const response = await request(app)
      .post('/signup')
      .send(testUser)
      .set('Accept', 'x-www-form-urlencoded');

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      id: expect.anything(Number),
      firstname: 'Fnametest',
      lastname: 'Lnametest',
      date_of_birth: expect.anything(Date),
      email: 'flname@test.com',
      password: 'kkkkkkkkk',
      createdAt: expect.anything(Date),
      updatedAt: expect.anything(Date),
    });
  });

  // Test create new user duplicate email
  test('POST signup email in use', async () => {
    const testUser = {
      firstname: 'Fnametest',
      lastname: 'Lnametest',
      date_of_birth: '2025-05-13',
      email: 'flname@test.com',
      password: 'kkkkkkkkk',
    };
    const response = await request(app)
      .post('/signup')
      .send(testUser)
      .set('Accept', 'x-www-form-urlencoded');

    expect(response.body).toEqual('Email already in use');
  });
});

// Test POST login routes
describe('POST /login', () => {
  test('POST login router works', (done) => {
    request(app)
      .post('/login')
      .set('Application', 'application/json')
      .expect({ message: 'login POST route' })
      .expect(200, done);
  });
});
