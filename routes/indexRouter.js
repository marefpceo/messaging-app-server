const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const passport = require('passport');
const LocalStrategy = require('passport-local');
const argon2 = require('argon2');

const indexController = require('../controllers/indexController.js');

// Passport LocalStrategy configuration to verify email and password for authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        if (user === null) {
          return done(null, false, {
            message: 'Login failed; Invalid email or password',
          });
        }

        const passwordsMatch = await argon2.verify(user.password, password);

        if (passwordsMatch) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: 'Login failed; Invalid email or password',
          });
        }
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, {
      id: user.id,
      username: user.username,
    });
  });
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => {
    return cb(null, user);
  });
});

// POST sign up page
router.post('/signup', indexController.signup_post);

// POST login - Returns a status of 401 upon failure
router.post(
  '/login',
  passport.authenticate('local', {
    failWithError: true,
    successMessage: true,
    failureMessage: true,
  }),
  (req, res) => {
    res.json({
      message: 'Login successful',
    });
  },
);

module.exports = router;
