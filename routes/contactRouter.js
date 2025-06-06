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

// GET Current User contact list
contactRouter.get(
  '/:username/contact_list',
  contactController.user_contacts_get,
);

module.exports = contactRouter;
