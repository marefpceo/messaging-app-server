const express = require('express');
const authRouter = express.Router();
const messageController = require('../controllers/messageController');
const contactController = require('../controllers/contactController');
const userController = require('../controllers/userController');

/********** Message Routing **********/
/*************************************/
// GET conversation list
authRouter.get(
  '/message/conversations',
  messageController.conversation_list_get,
);

// GET create message
authRouter.get('/message/create_message', messageController.create_message_get);

// POST create message
authRouter.post(
  '/message/create_message',
  messageController.create_message_post,
);

// GET selected conversation
authRouter.get(
  '/message/conversation/:contactId',
  messageController.conversation_get,
);

// DELETE conversation
authRouter.delete(
  '/message/conversation/:contactId',
  messageController.conversation_delete,
);

// GET selected conversation message
authRouter.get(
  '/message/conversation/:contactId/:messageId',
  messageController.message_get,
);

// DELETE message
authRouter.delete(
  '/message/conversation/:contactId/:messageId',
  messageController.message_delete,
);

/*********** Contact Routing ***********/
/***************************************/
// GET contacts
authRouter.get('/contact', contactController.contacts_get);

// POST add contact
authRouter.post('/contact/add', contactController.add_contact_post);

// DELETE contact
authRouter.delete('/contact/delete', contactController.contact_delete);

/********* User Profile Routing *********/
/****************************************/
// GET user profile
authRouter.get('/user/:user/edit_profile', userController.edit_profile_get);

// PUT edit profile
authRouter.put('/user/:user/edit_profile', userController.edit_profile_put);

module.exports = authRouter;
