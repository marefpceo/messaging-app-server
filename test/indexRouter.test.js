const indexRouter = require('../routes/indexRouter');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const argon2 = require('argon2');

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
      username: 'flname12',
      date_of_birth: '2025-05-13',
      email: 'flname@test.com',
      password: 'kkkkkkkkk',
    };

    const response = await request(app)
      .post('/signup')
      .send(testUser)
      .set('Accept', 'x-www-form-urlencoded');

    const verifiedHash = await argon2.verify(
      response.body.password,
      testUser.password,
    );

    expect(verifiedHash).toBeTruthy;
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      id: expect.anything(Number),
      firstname: 'Fnametest',
      lastname: 'Lnametest',
      username: 'flname12',
      date_of_birth: expect.anything(Date),
      email: 'flname@test.com',
      password: expect.any(String),
      createdAt: expect.anything(Date),
      updatedAt: expect.anything(Date),
    });
  });

  // Test create new user duplicate email
  test('POST signup email in use', async () => {
    const testUser = {
      firstname: 'Fnametest',
      lastname: 'Lnametest',
      username: 'flname12',
      date_of_birth: '2025-05-13',
      email: 'flname@test.com',
      password: 'kkkkkkkkk',
    };
    const response = await request(app)
      .post('/signup')
      .send(testUser)
      .set('Accept', 'x-www-form-urlencoded');
    expect(response.status).toBe(200);
    expect(response.body.errors.email.msg).toEqual('Email already in use');
  });

  const testUserLogin = {
    email: 'flname@test.com',
    password: 'kkkkkkkkk',
  };
  // Test POST login routes
  test('POST login succesful', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: testUserLogin.email, password: testUserLogin.password })
      .set('Accept', 'x-www-form-urlencoded');
    expect(response.body.message).toEqual('Login successful');
  });

  test('POST login incorrect password', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: testUserLogin.email, password: 'incorrctPassword' })
      .set('Accept', 'x-www-form-urlencoded');
    expect(response.status).toBe(401);
  });

  test('POST login incorrct email', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'incorrect@email.com', password: testUserLogin.password })
      .set('Accept', 'x-www-form-urlencoded');
    expect(response.status).toBe(401);
  });
});
