const userRouter = require('../routes/userRouter');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/user', userRouter);

// Test all user routes\
describe('Test user routes used to edit the user profile', () => {
  let userId = '';
  const testUser = {
    firstname: 'User',
    lastname: 'Router',
    date_of_birth: '2025-05-26',
    email: 'UserRouter@test.com',
    password: 'kkkkkkkkk',
  };

  beforeAll(async () => {
    user = await prisma.user.create({
      data: testUser,
    });
    userId = user.id;
  });

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        email: testUser.email,
      },
    });
  });

  // Test GET user profile
  it('get user profile route works', async () => {
    const response = request(app).get(`/user/${userId}/edit_profile`);
    expect(response.body).toEqual({
      firstname: testUser.firstname,
      lastname: testUser.lastname,
      date_of_birth: testUser.date_of_birth,
      email: testUser.email,
      bio: 'profile bio',
      bg_setting: 'black',
      font_setting: 'large',
      color: 'white',
    });
  });
});

// Test PUT edit profile
describe('PUT /user/:user/edit_profile', () => {
  test('put user edit profile route works', (done) => {
    request(app)
      .put('/user/:user/edit_profile')
      .set('Content-Type', 'application/json')
      .send({ message: 'Update profile' })
      .expect('Content-Type', /json/)
      .expect({ message: 'Edit Profile PUT' })
      .expect(200, done);
  });
});
