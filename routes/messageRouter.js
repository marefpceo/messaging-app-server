const express = require('express');
const messageRouter = express.Router();
const messageController = require('../controllers/messageController');

/********** Message Routing **********/
/*************************************/
// GET received message list for current user
messageRouter.get(
  '/:username/messages_received',
  messageController.message_received_list_get,
);

// GET sent message list for current user
messageRouter.get(
  '/:username/messages_sent',
  messageController.message_sent_list_get,
);

// GET conversation list for current user
messageRouter.get(
  '/:username/conversations',
  messageController.conversation_list_get,
);

// GET create new message
messageRouter.get(
  '/:username/create_message',
  messageController.create_message_get,
);

// POST create new message and conversation
messageRouter.post(
  '/:username/create_message',
  messageController.create_message_post,
);

// PUT create new message to existing conversation
messageRouter.put(
  '/:username/create_message',
  messageController.create_message_put,
);

// GET selected conversation
messageRouter.get(
  '/:username/conversation/:conversationId',
  messageController.conversation_get,
);

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
