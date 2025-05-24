const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Handles creating new user signup
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
  body('email')
    .trim()
    .isEmail()
    .escape()
    .custom(async (value) => {
      const emailCheck = await prisma.user.findUnique({
        where: {
          email: value,
        },
      });
      if (emailCheck) {
        throw new Error('Email already in use');
      }
    })
    .withMessage('Email already in use'),
  body('password')
    .trim()
    .isLength({ min: 9 })
    .withMessage('Password must contain a minimum of 9 characters')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(200).json({
        errors: errors.mapped(),
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
