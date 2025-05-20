const express = require('express');
const contactRouter = express.Router();
const contactController = require('../controllers/contactController');

/*********** Contact Routing ***********/
/***************************************/
// GET contacts
contactRouter.get('/', contactController.contacts_get);

// POST add contact
contactRouter.post('/add', contactController.add_contact_post);

// DELETE contact
contactRouter.delete('/delete', contactController.contact_delete);

module.exports = contactRouter;
