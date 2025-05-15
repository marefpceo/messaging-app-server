const express = require('express');
const authRouter = express.Router();
const messageController = require('../controllers/messageController');
const contactController = require('../controllers/contactController');
const userController = require('../controllers/userController');

const { router } = require('../app');

/********** Message Routing **********/
/*************************************/
// GET conversation list
router.get('message/conversations', messageController.conversation_list_get);

// GET create message
router.get('message/create_message', messageController.create_message_get);

// POST create message
router.post('message/create_message', messageController.create_message_post);

// GET selected conversation
router.get(
  'message/conversation/:contactId',
  messageController.conversation_get,
);

// DELETE conversation
router.delete(
  'message/conversation/:contactId',
  messageController.conversation_delete,
);

// GET selected conversation message
router.get(
  'message/conversation/:contactId/:messageId',
  messageController.message_get,
);

// DELETE message
router.delete(
  'message/conversation/:contactId/:messageId',
  messageController.message_delete,
);

/*********** Contact Routing ***********/
/***************************************/
// GET contacts
router.get('/contact', contactController.contacts_get);

// POST add contact
router.post('/contact/add', contactController.add_contact_post);

// DELETE contact
router.delete('/contact/delete', contactController.contact_delete);

/********* User Profile Routing *********/
/****************************************/
// GET user profile
router.get('/:user/edit_profile', userController.edit_profile_get);

// PUT edit profile
router.put('/:user/edit_profile', userController.edit_profile_put);

module.exports = authRouter;
