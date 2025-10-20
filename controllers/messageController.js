const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Returns list of received messages for the selected user
exports.message_received_list_get = asyncHandler(async (req, res, next) => {
  const messageReceivedList = await prisma.message.findMany({
    where: {
      recipient: {
        username: req.params.username,
      },
    },
    include: {
      sender: {
        select: {
          username: true,
        },
      },
      conversation: {
        select: {
          subject: true,
        },
      },
    },
  });

  res.json(messageReceivedList);
});

// Returns list of sent messages for the selected user
exports.message_sent_list_get = asyncHandler(async (req, res, next) => {
  const messageSentList = await prisma.message.findMany({
    where: {
      sender: {
        username: req.params.username,
      },
    },
    include: {
      recipient: {
        select: {
          username: true,
        },
      },
      conversation: {
        select: {
          subject: true,
        },
      },
    },
  });

  res.json(messageSentList);
});

// Returns list of conversations for the selected user
exports.conversation_list_get = asyncHandler(async (req, res, next) => {
  const conversationList = await prisma.conversation.findMany({
    where: {
      OR: [
        {
          messages: {
            some: {
              sender: {
                username: req.params.username,
              },
            },
          },
        },
        {
          messages: {
            some: {
              recipient: {
                username: req.params.username,
              },
            },
          },
        },
      ],
    },
    include: {
      messages: {
        include: {
          recipient: {
            select: {
              username: true,
            },
          },
          sender: {
            select: {
              username: true,
            },
          },
        },
      },
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
      const newConversation = await prisma.conversation.create({
        data: {
          subject: req.body.subject,
          messages: {
            create: [
              {
                senderId: parseInt(req.body.senderId),
                recipientId: parseInt(req.body.recipientId),
                context: req.body.context,
              },
            ],
          },
        },
        include: {
          messages: true,
        },
      });
      res.json({
        message: 'New conversation created!',
        id: newConversation.id,
      });
    }
  }),
];

// Handles creating new message by updating selected conversation
exports.create_message_put = [
  body('context')
    .trim()
    .isLength({ min: 8, max: 1000 })
    .withMessage('Message must be between 8 and 1000 characters')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty) {
      res.status(200).json({
        errors: errors.array(),
      });
      return;
    } else {
      const newMessage = await prisma.conversation.update({
        where: {
          id: parseInt(req.body.conversationId),
        },
        data: {
          messages: {
            create: {
              senderId: parseInt(req.body.senderId),
              recipientId: parseInt(req.body.recipientId),
              context: req.body.context,
            },
          },
        },
      });
      res.json({
        message: 'New message created',
      });
    }
  }),
];

// Gets selected conversation and messages
exports.conversation_get = asyncHandler(async (req, res, next) => {
  const selectedConversation = await prisma.conversation.findUnique({
    where: {
      id: parseInt(req.params.conversationId),
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          sender: {
            select: {
              username: true,
            },
          },
          recipient: {
            select: {
              username: true,
            },
          },
        },
      },
    },
  });
  res.json(selectedConversation);
});

// Gets selected message
exports.message_get = asyncHandler(async (req, res, next) => {
  const selectedMessage = await prisma.message.findUnique({
    where: {
      id: parseInt(req.params.messageId),
    },
    include: {
      conversation: {
        select: {
          subject: true,
        },
      },
      recipient: {
        select: {
          username: true,
        },
      },
    },
  });
  console.log(selectedMessage);
  res.json(selectedMessage);
});

// Handles deleted a message. Message is not deleted immediatly but instead marked for deletion
exports.message_delete = asyncHandler(async (req, res, next) => {
  const userId = parseInt(req.body.userId);
  const messageIdList = req.body.messageIdList.map(Number);
  const messageToDelete = await prisma.message.updateMany({
    where: {
      id: {
        in: messageIdList,
      },
      // AND: [
      //   {
      //     OR: [
      //       {
      //         recipientId: parseInt(req.body.userId),
      //       },
      //       {
      //         senderId: parseInt(req.body.userId),
      //       }
      //     ]
      //   }
      // ]
    },
    data: {
      // delete_ready: true,
      recipientId: null,
      // ...(userId === prisma.message.fields.recipientId ? { recipientId: null } : {}),
      // ...(userId === prisma.message.fields.senderId ? { senderId: null } : {}),
      // delete_timestamp: new Date().toISOString(),
    },
  });
  console.log(messageIdList);
  res.json({
    message: `Message ${messageToDelete} moved to trash`,
  });
});

exports.conversation_delete = asyncHandler(async (req, res, next) => {
  const conversationToDelete = await prisma.conversation.delete({
    where: {
      id: parseInt(req.params.conversationId),
    },
  });
  res.json({
    message: `Conversation ${conversationToDelete.subject} deleted`,
  });
});
