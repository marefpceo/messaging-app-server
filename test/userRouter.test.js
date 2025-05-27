const userRouter = require('../routes/userRouter');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/user', userRouter);

// Test all user routes\
describe("Test user routes to access and edit user's profile", () => {
  let userId = '';
  const testUser = {
    firstname: 'User',
    lastname: 'Router',
    date_of_birth: '2025-05-26',
    email: 'UserRouter@test.com',
    password: 'kkkkkkkkk',
  };

  // Create test user with profile
  beforeAll(async () => {
    user = await prisma.user.create({
      data: {
        firstname: 'User',
        lastname: 'Router',
        date_of_birth: '2025-05-26',
        email: 'UserRouter@test.com',
        password: 'kkkkkkkkk',
        profile: {
          create: {
            bio: 'User bio with info about them for public display',
            settings: {
              create: {
                background: 'black',
                font: 'large',
                color: 'white',
              },
            },
          },
        },
      },
    });
    userId = user.id;
  });

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        email: 'UserRouter@test.com',
      },
    });
  });

  // Test GET user profile
  it('GET user profile route works', async () => {
    const response = request(app)
      .get(`/user/${userId}/edit_profile`)
      .set('Accept', 'application/json');
    expect('Content-Type').toBe(/json/);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(Number),
      firstname: testUser.firstname,
      lastname: testUser.lastname,
      date_of_birth: testUser.date_of_birth,
      email: testUser.email,
      bio: 'User bio with info about them for public display',
      background: 'black',
      font: 'large',
      color: 'white',
    });
  });

  // Test PUT route to edit user profile
  test('PUT edit user profile route works', async () => {
    const response = await request(app)
      .put(`/user/${user.id}/edit_profile`)
      .set('Content-Type', 'application/json')
      .send({
        bio: 'User bio updated',
        background: 'gray',
        font: 'normal',
        color: 'black',
      });
    expect(response.body).toEqual({
      id: expect.any(Number),
      firstname: testUser.firstname,
      lastname: testUser.lastname,
      date_of_birth: testUser.date_of_birth,
      email: testUser.email,
      bio: 'User bio updated',
      background: 'gray',
      font: 'normal',
      color: 'black',
    });
  });
});
