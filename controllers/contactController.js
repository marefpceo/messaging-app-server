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

exports.add_contact_post = asyncHandler(async (req, res, next) => {
  const testResponse = {
    name: req.body.name,
    email: req.body.email,
  };
  res.json(testResponse);
});

exports.contact_delete = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'Contact DELETE',
  });
});
