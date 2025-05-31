const userRouter = require('../routes/userRouter');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/user', userRouter);

// Test all user routes\
describe("Test user routes to access and edit user's profile", () => {
  let userId;
  const testUser = {
    firstname: 'User',
    lastname: 'Router',
    date_of_birth: '2025-05-26',
    email: 'UserRouter@test.com',
    password: 'kkkkkkkkk',
  };

  // Create test user with profile
  beforeAll(async () => {
    const user = await prisma.user.create({
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

  // Test GET user profile
  it('GET user profile route works', async () => {
    const response = await request(app)
      .get(`/user/${userId}/edit_profile`)
      .set('Accept', 'application/json');
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
      .put(`/user/${userId}/edit_profile`)
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
      date_of_birth: expect.any(String),
      email: testUser.email,
      bio: 'User bio updated',
      background: 'gray',
      font: 'normal',
      color: 'black',
    });
  });

  // Test DELETE route to delete user profile
  test('DELETE user profile route works', async () => {
    const response = await request(app)
      .delete(`/user/${userId}/edit_profile`)
      .set('Content-Type', 'application/json');
    expect(response.body.message).toBe(
      `User ${testUser.firstname} ${testUser.lastname} marked for deletion`,
    );
  });

  // Test DELETE route with non-existent user
  test('DELETE user profile with non-existent user returns error', async () => {
    const response = await request(app)
      .delete(`/user/${userId}/edit_profile`)
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });

  // Verify user has been deleted
  test('Verify testUser is deleted', async () => {
    const response = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });
    expect(response).toBeNull();
  });
});
