const express = require('express');
const messageRouter = express.Router();
const messageController = require('../controllers/messageController');

/********** Message Routing **********/
/*************************************/

// GET all messages for current user (sent & received)
messageRouter.get('/:username/messages', messageController.messages_get);

// GET create new message
messageRouter.get(
  '/:username/create-message',
  messageController.create_message_get,
);

// POST create new message and conversation
messageRouter.post(
  '/:username/create-message',
  messageController.create_message_post,
);

// DELETE message
messageRouter.put(
  '/:username/message/delete',
  messageController.message_delete,
);

module.exports = messageRouter;
