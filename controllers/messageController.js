const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const { PrismaClient } = require('../generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const {
  cleanMessageArray,
  cleanSelectedConversation,
} = require('../helpers/messageFilters');

// Returns all user messages (sent & received)
exports.messages_get = asyncHandler(async (req, res, next) => {
  const currentUser = await prisma.user.findUnique({
    where: {
      username: req.params.username,
    },
  });
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        {
          senderId: currentUser.id,
        },
        {
          recipientId: currentUser.id,
        },
      ],
    },
  });
  res.json(messages);
});

// Returns a the current user's list of contacts. Users can only message contacts they have added
exports.create_message_get = asyncHandler(async (req, res, next) => {
  const currentUser = await prisma.user.findUnique({
    where: {
      username: req.params.username,
    },
    select: {
      contacts: {
        select: {
          contactUser: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  });
  res.json(currentUser.contacts);
});

// Handles creating a new message
exports.create_message_post = [
  body('context')
    .trim()
    .isLength({ min: 8, max: 1000 })
    .withMessage('Message must be between 8 and 1000 characters')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(200).json({
        errors: errors.mapped(),
      });
      return;
    } else {
      const createMessage = await prisma.message.create({
        data: {
          senderId: parseInt(req.body.senderId),
          recipientId: parseInt(req.body.recipientId),
          context: req.body.context,
        },
      });
      res.json({
        message: 'New message created!',
        id: createMessage.id,
      });
    }
  }),
];

// Handles deleted a message. Message is not deleted immediately but instead marked for deletion
exports.message_delete = asyncHandler(async (req, res, next) => {
  const userId = parseInt(req.body.userId);
  const messageIdList = req.body.messageIdList.map(Number);
  const messagesToDelete = await prisma.message.findMany({
    where: {
      id: {
        in: messageIdList,
      },
    },
  });

  for (const message of messagesToDelete) {
    if (message.recipientId === userId) {
      await prisma.message.update({
        where: {
          id: message.id,
        },
        data: {
          recipientId: null,
        },
      });
    }
  }

  for (const message of messagesToDelete) {
    if (message.senderId === userId) {
      await prisma.message.update({
        where: {
          id: message.id,
        },
        data: {
          senderId: null,
        },
      });
    }
  }

  res.json({
    message: `Messages moved to trash`,
  });
});
