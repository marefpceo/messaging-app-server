const asyncHandler = require('express-async-handler');

const { PrismaClient } = require('../generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

// GET global list of all contacts
exports.contacts_get = asyncHandler(async (req, res, next) => {
  const verifyList = await prisma.user.findMany({
    select: {
      id: true,
      firstname: true,
      lastname: true,
      username: true,
    },
  });

  if (!verifyList) {
    res.status(200).json({
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
          contactUser: true,
          user: true,
        },
      },
    },
  });

  if (checkUser === null) {
    res.status(200).json({
      message: 'User not found',
    });
    return;
  } else {
    const contactList = checkUser.contacts.map((record) => ({
      id: record.contactUserId,
      firstname: record.contactUser.firstname,
      lastname: record.contactUser.lastname,
      username: record.contactUser.username,
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
      include: {
        contactUser: true,
      },
    });
    res.json({
      message: `${addContact.contactUser.username} added!`,
    });
  }
});

// DELETE contact from user contact list
exports.contact_delete = asyncHandler(async (req, res, next) => {
  const currentUser = await prisma.user.findUnique({
    where: {
      username: req.params.username,
    },
    include: {
      contacts: {
        include: {
          contactUser: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  if (currentUser === null) {
    res.status(404).json({
      message: 'User not found',
    });
    return;
  } else {
    const contactRecord = currentUser.contacts.find(
      (record) => record.contactUser.username === req.body.contactToRemove,
    );

    const removeContact = await prisma.contact.delete({
      where: {
        id: parseInt(contactRecord.id),
      },
      include: {
        contactUser: true,
      },
    });
    res.status(200).json({
      message: `${removeContact.contactUser.username} DELETED`,
    });
  }
});
