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
          include: {
            profile: {
              include: {
                settings: true,
              },
            },
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
      settings: {
        background: user.profile.settings.background,
        color: user.profile.settings.color,
        font: user.profile.settings.font,
      },
    });
  });
});

passport.deserializeUser(async (currentUserId, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: currentUserId.id,
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
  [
    indexController.login_post,
    passport.authenticate('local', {
      failWithError: true,
    }),
  ],

  (req, res) => {
    res.status(200).json({
      message: 'Login successful',
      user: req.session.passport.user,
    });
  },
);

// GET user status for front end
router.get('/session-status', async (req, res) => {
  console.log(req.session.id);
  if (req.session.id) {
    try {
      const session = await prisma.session.findUnique({
        where: {
          sid: `${req.session.id}`,
        },
      });

      if (session === null) {
        res.json({
          status: 'inactive',
        });
      } else {
        res.json({
          status: 'active',
          user:
            req.session.passport === undefined ? '' : req.session.passport.user,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
});

// POST logout
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return next(err);
      }
      res.clearCookie('connect.sid').status(200).json({
        message: 'Logged out',
      });
    });
  });
});

module.exports = router;
