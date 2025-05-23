const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

exports.signup_post = [
  body('firstname')
    .trim()
    .isLength({ min: 3 })
    .isAlphanumeric()
    .withMessage('Only alphanumeric characters allowed')
    .escape(),
  body('lastname')
    .trim()
    .isLength({ min: 3 })
    .isAlphanumeric()
    .withMessage('Only alphanumeric characters allowed')
    .escape(),
  body('date_of_birth').trim().isDate({ format: 'YYYY-MM-DD' }),
  body('email').trim().isEmail().escape(),
  body('password')
    .trim()
    .isLength({ min: 9 })
    .withMessage('Password must contain a minimum of 9 characters')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const emailCheck = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (emailCheck) {
      res.json({
        message: 'Email already in use',
      });
      return;
    }

    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array(),
      });
      return;
    } else {
      const newUser = await prisma.user.create({
        data: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          date_of_birth: Date(req.body.date_of_birth),
          email: req.body.email,
          password: req.body.password,
        },
      });
      res.json(newUser);
    }
  }),
];

exports.login_get = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'login GET route',
  });
});
