const express = require('express');
const messageRouter = express.Router();
const messageController = require('../controllers/messageController');

/********** Message Routing **********/
/*************************************/

// GET all messages for current user (sent & received)
messageRouter.get('/:username/messages', messageController.messages_get);

// GET create new message
messageRouter.get(
  '/:username/create_message',
  messageController.create_message_get,
);

// TODO removing conversation schema
// POST create new message and conversation
messageRouter.post(
  '/:username/create_message',
  messageController.create_message_post,
);

// TODO removing conversation schema
// PUT create new message to existing conversation
messageRouter.put(
  '/:username/create_message',
  messageController.create_message_put,
);

// TODO removing conversation schema
// GET selected conversation
messageRouter.get(
  '/:username/conversation/:conversationId',
  messageController.conversation_get,
);

// TODO removing conversation schema
// DELETE conversation
messageRouter.delete(
  '/:username/conversation/:conversationId',
  messageController.conversation_delete,
);

// GET selected message
messageRouter.get(
  '/:username/message/:messageId',
  messageController.message_get,
);

// DELETE message
messageRouter.put(
  '/:username/message/delete',
  messageController.message_delete,
);

module.exports = messageRouter;
