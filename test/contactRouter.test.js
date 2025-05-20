const contactRouter = require('../routes/contactRouter');

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/contact', contactRouter);

// Test GET Contact list
describe('GET /contact', () => {
  test('contact list GET route works', (done) => {
    request(app)
      .get('/contact')
      .expect('Content-Type', /json/)
      .expect({ message: 'Contacts GET' })
      .expect(200, done);
  });
});

// Test POST add contact
describe('POST /contact/add', () => {
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
});

// Test DELETE contact
describe('DELETE /contact/delete', () => {
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
