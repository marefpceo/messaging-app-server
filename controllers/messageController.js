const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Returns list of conversations for the selecte user
exports.conversation_list_get = asyncHandler(async (req, res, next) => {
  const conversationList = await prisma.conversation.findMany({
    where: {
      message: {
        sender: {
          username: req.params.username,
        },
      },
    },
    include: {
      message: true,
    },
  });
  res.json(conversationList);
});

// Returns current user info needed to create a new message
exports.create_message_get = asyncHandler(async (req, res, next) => {
  const currentUser = await prisma.user.findUnique({
    where: {
      username: req.params.username,
    },
    include: {
      contacts: true,
    },
  });
  res.json(currentUser);
});

// Handles creating a new conversation and message
exports.create_message_post = [
  body('subject')
    .trim()
    .isLength({ min: 3, max: 35 })
    .withMessage('Subject line must be betweem 3 and 35 characters!')
    .escape(),
  body('context')
    .trim()
    .isLength({ min: 8, max: 1000 })
    .withMessage('Message must be between 8 and 1000 characters')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(200).json({
        errors: errors.array(),
      });
      return;
    } else {
      if (req.body.newConversation) {
        const createConversation = await prisma.conversation.create({
          data: {
            subject: req.body.subject,
          },
        });
      }

      res.json({
        message: 'Create Message POST',
      });
    }
  }),
];

exports.conversation_get = asyncHandler(async (req, res, next) => {
  res.json({
    id: req.params.contactId,
    message: 'Conversation GET',
  });
});

exports.conversation_delete = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'Conversation DELETE',
  });
});

exports.message_get = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'Message GET',
  });
});

exports.message_delete = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'Message DELETE',
  });
});
