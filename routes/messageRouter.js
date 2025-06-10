const express = require('express');
const messageRouter = express.Router();
const messageController = require('../controllers/messageController');

/********** Message Routing **********/
/*************************************/
// GET conversation list
messageRouter.get('/conversations', messageController.conversation_list_get);

// POST create new message and conversation
messageRouter.post('/create_message', messageController.create_message_post);

// PUT create new message to existing conversation

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
