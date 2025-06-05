const contactRouter = require('../routes/contactRouter');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/contact', contactRouter);

// Test contactRouter routes
describe('Test all contactRouter routes', () => {
  test('GET contact list works', async () => {
    const response = await request(app)
      .get('/contact')
      .set('Content-Type', 'application/json');
    response.body.forEach((item) => {
      expect(item).toMatchObject({
        firstname: expect.any(String),
        lastname: expect.any(String),
        date_of_birth: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        profile: {
          bio: expect.any(String),
          settings: expect.any(Object),
        },
      });
    });
  });

  test(`POST route to add contact 'userThree' to 'userOne1' works`, async () => {
    const responseData = await request(app)
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
    const responseData = await request(app)
      .post('/contact/add')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        currentUser: 'userOne1',
        addUser: 'userFive',
      });
    expect(responseData.status).toBe(200);
    expect(responseData.body.message).toBe('userFive added!');
  });

  test(`GET route to list all 'userOne1' contacts by username`, async () => {
    const responseData = await request(app).get(
      '/contact/userOne1/contact_list',
    );
    expect(responseData.body).toContain(
      expect.objectContaining({
        username: any(String),
      }),
    );
    contactsAdded = responseData.ok ? true : false;
  });

  test(`DELETE 'userFive' from 'userOne' works`, async () => {
    const responseData = await request(app)
      .delete('/contact/delete')
      .set('Content-Type', 'application/json')
      .send({ userToDelete: 'userFive' });

    expect(responseData.statusCode).toBe(200);
    expect(responseData.body.message).toBe('userFive DELETED');
  });

  test(`DELETE 'userThree' from 'userOne' works`, async () => {
    const responseData = await request(app)
      .delete('/contact/delete')
      .set('Content-Type', 'application/json')
      .send({ userToDelete: 'userThree' });

    expect(responseData.statusCode).toBe(200);
    expect(responseData.body.message).toBe('userThree DELETED');
  });

  test(`Verify 'userOne1' has no contacts`, async () => {
    const userInfo = await prisma.user.findUnique({
      where: {
        username: 'userOne1',
      },
    });
    expect(userInfo.contactUserId.length).toBe(0);
  });
});
