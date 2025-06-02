const contactRouter = require('../routes/contactRouter');

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
    expect(response.body.message).toBe('Contacts GET');
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
