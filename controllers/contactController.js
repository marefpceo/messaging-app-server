const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// GET global list of all contacts
exports.contacts_get = asyncHandler(async (req, res, next) => {
  const verifyList = await prisma.user.findMany({
    include: {
      profile: {
        include: {
          settings: true,
        },
      },
    },
  });

  if (!verifyList) {
    res.status(404).json({
      message: 'Not found',
    });
  } else {
    res.status(200).json(verifyList);
  }
});

// Add contact to current user
exports.add_contact_post = asyncHandler(async (req, res, next) => {
  const currentUser = await prisma.user.findUnique({
    where: {
      username: req.body.currentUser,
    },
  });
  const userToAdd = await prisma.user.findUnique({
    where: {
      username: req.body.addUser,
    },
  });

  if (userToAdd === null || currentUser === null) {
    res.status(404).json({
      message: 'User not found',
    });
    return;
  } else {
    await prisma.contact.create({
      data: {
        userId: currentUser.id,
        contactUserId: userToAdd.id,
      },
    });
  }
  res.json({
    message: `${userToAdd.username} added!`,
  });
});

exports.contact_delete = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'Contact DELETE',
  });
});
