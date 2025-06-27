const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const argon2 = require('argon2');

// Handles creating new user signup
exports.signup_post = [
  body('firstname')
    .trim()
    .isLength({ min: 3 })
    .withMessage('First Name must be at least 3 characters')
    .isAlphanumeric()
    .withMessage('Only alphanumeric characters allowed')
    .escape(),
  body('lastname')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Last Name must be at least 3 characters')
    .isAlphanumeric()
    .withMessage('Only alphanumeric characters allowed')
    .escape(),
  body('username')
    .trim()
    .isLength({ min: 8, max: 64 })
    .withMessage('Username must be at least 8 characters')
    .escape()
    .custom(async (value) => {
      const usernameCheck = await prisma.user.findUnique({
        where: {
          username: value,
        },
      });
      if (usernameCheck) {
        throw new Error('Username already in use');
      }
    })
    .withMessage('Username already in use'),
  body('date_of_birth')
    .trim()
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('Use date format YYYY-MM-DD'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email format invalid. (ex. user@email.com')
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
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value != req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const formData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      date_of_birth: req.body.date_of_birth,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    };
    if (!errors.isEmpty()) {
      res.status(400).json({
        formData,
        errors: errors.array(),
      });
      return;
    } else {
      const hash = await argon2.hash(req.body.password, {
        type: argon2.argon2id,
        memoryCost: 47104,
        timeCost: 1,
        parallelism: 1,
      });
      const newUser = await prisma.user.create({
        data: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          username: req.body.username,
          date_of_birth: new Date(req.body.date_of_birth),
          email: req.body.email,
          password: hash,
          profile: {
            create: {
              settings: {
                create: {},
              },
            },
          },
        },
      });
      res.status(200).json(newUser);
    }
  }),
];

exports.login_get = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'login GET route',
  });
});
