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

// exports.edit_profile_put = [
//   body('bio')
//     .trim()
//     .isLength({ max: 520 })
//     .escape(),

//   asyncHandler(async (req, res, next) => {
//     const errors =  validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(200).json({
//         errors: errors.mapped(),
//       });
//     } else {
//       const updatedProfile = await prisma.user.update({
//         where: {
//           id: parseInt(req.params.userId)
//         }, data: {
//           profile: {
//             data: {
//               bio: req.body.bio,
//             },
//             data: {
//               s
//             }
//           }
//           ////////////////////////////////////
//           ///////////////////////////////////
//           ////////////////////////////////////
//           // background: req.body.background,
//           font: req.body.font,
//           color: req.body.color
//         }
//       });
//       res.json({
//         updatedProfile
//       })
//     }
//   })
// ];
