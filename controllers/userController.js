const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

exports.edit_profile_get = asyncHandler(async (req, res, next) => {
  const userProfile = await prisma.user.findUnique({
    where: {
      id: parseInt(req.params.userId),
    },
    include: {
      profile: {
        include: {
          settings: true,
        },
      },
    },
  });
  res.json({
    id: userProfile.id,
    firstname: userProfile.firstname,
    lastname: userProfile.lastname,
    date_of_birth: userProfile.date_of_birth,
    email: userProfile.email,
    bio: userProfile.profile.bio,
    background: userProfile.profile.settings.background,
    font: userProfile.profile.settings.font,
    color: userProfile.profile.settings.color,
  });
});

exports.edit_profile_put = [
  body('bio').trim().isLength({ max: 520 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(200).json({
        errors: errors.mapped(),
      });
      return;
    } else {
      const updatedProfile = await prisma.user.update({
        where: {
          id: parseInt(req.params.userId),
        },
        data: {
          profile: {
            update: {
              bio: req.body.bio,
              settings: {
                update: {
                  background: req.body,
                  font: req.body,
                  color: req.body,
                },
              },
            },
          },
        },
        include: {
          profile: {
            select: {
              bio: true,
              settings: {
                select: {
                  background: true,
                  font: true,
                  color: true,
                },
              },
            },
          },
        },
      });
      res.json({
        id: updatedProfile.id,
        firstname: updatedProfile.firstname,
        lastname: updatedProfile.lastname,
        date_of_birth: updatedProfile.date_of_birth,
        email: updatedProfile.email,
        bio: updatedProfile.profile.bio,
        background: updatedProfile.profile.settings.background,
        font: updatedProfile.profile.settings.font,
        color: updatedProfile.profile.settings.color,
      });
    }
  }),
];
