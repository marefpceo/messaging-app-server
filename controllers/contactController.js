const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('../generated/prisma');
const { connect } = require('../routes/contactRouter');
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

// GET current user contact list
exports.user_contacts_get = asyncHandler(async (req, res, next) => {
  const checkUser = await prisma.user.findUnique({
    where: {
      username: req.params.username,
    },
    include: {
      contacts: {
        include: {
          user: true,
        },
      },
    },
  });

  if (checkUser === null) {
    res.status(404).json({
      message: 'User not found',
    });
    return;
  } else {
    const contactList = checkUser.contacts.map((record) => ({
      userId: record.userId,
      username: record.user.username,
    }));
    res.json(contactList);
  }
});

// Add contact to current user
exports.add_contact_post = asyncHandler(async (req, res, next) => {
  const currentUser = await prisma.user.findUnique({
    where: {
      username: req.body.currentUser,
    },
    include: {
      contacts: true,
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
    const addContact = await prisma.contact.upsert({
      where: {
        userId: parseInt(currentUser.id),
        userId_contactUserId: {
          userId: parseInt(currentUser.id),
          contactUserId: parseInt(userToAdd.id),
        },
      },
      update: {
        userId: parseInt(currentUser.id),
        contactUserId: parseInt(userToAdd.id),
      },
      create: {
        contactUserId: parseInt(userToAdd.id),
        userId: parseInt(currentUser.id),
      },
    });
    res.json({
      message: `${userToAdd.username} added!`,
    });
  }
});

exports.contact_delete = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'Contact DELETE',
  });
});
