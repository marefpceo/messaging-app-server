const express = require('express');
const messageRouter = express.Router();
const messageController = require('../controllers/messageController');

/********** Message Routing **********/
/*************************************/
// GET conversation list
messageRouter.get('/conversations', messageController.conversation_list_get);

// GET create message
messageRouter.get('/create_message', messageController.create_message_get);

// POST create message
messageRouter.post('/create_message', messageController.create_message_post);

// GET selected conversation
messageRouter.get(
  '/conversation/:contactId',
  messageController.conversation_get,
);

// DELETE conversation
messageRouter.delete(
  '/conversation/:contactId',
  messageController.conversation_delete,
);

// GET selected conversation message
messageRouter.get(
  '/conversation/:contactId/:messageId',
  messageController.message_get,
);

// DELETE message
messageRouter.delete(
  '/conversation/:contactId/:messageId',
  messageController.message_delete,
);

module.exports = messageRouter;
