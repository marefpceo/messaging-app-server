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

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, {
      id: user.id,
      username: user.username,
      email: user.email,
    });
  });
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    done(null, user.id);
  } catch (err) {
    done(err);
  }
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
      user: req.user,
    });
  },
);

// POST logout
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

module.exports = router;
