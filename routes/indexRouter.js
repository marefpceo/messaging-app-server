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

// POST sign up page
router.post('/signup', indexController.signup_post);

// POST login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(200).json({ message: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({ message: 'Login successful' });
    });
  });
});

module.exports = router;
