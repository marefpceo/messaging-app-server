const contactRouter = require('../routes/contactRouter');

const request = require('supertest');
const express = require('express');
const { anyObject } = require('jest-mock-extended');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/contact', contactRouter);

// Test contactRouter routes
describe('Test all contactRouter routes', () => {
  test('GET contact list works', async () => {
    const response = await request(app)
      .get('/contact')
      .set('Content-Type', 'application/json');
    expect(response.body).toContain(
      expect.objectContaining({
        firstname: expect.any(String),
        lastname: expect.any(String),
        date_of_birth: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        profile: {
          bio: expect.any(String),
          settings: expect.any(Object),
        },
      }),
    );
  });

  test('Add contact POST route works', async () => {
    const testContact = {
      name: 'tester',
      email: 'test@mail.com',
    };
    const responseData = await request(app)
      .post('/contact/add')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(testContact);
    expect(responseData.status).toBe(200);
    expect(responseData.body).toStrictEqual(testContact);
  });

  test('Delete contact DELETE route works', async () => {
    const randomUserId = 'asdfjkl;12345678';
    const responseData = await request(app)
      .delete('/contact/delete')
      .set('Content-Type', 'application/json')
      .send(randomUserId);

    expect(responseData.statusCode).toBe(200);
    expect(responseData.body.message).toBe('Contact DELETE');
  });
});
