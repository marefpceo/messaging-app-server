require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressSession = require('express-session');
const passport = require('passport');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('./generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const validation = require('./helpers/validation');
const cors = require('cors');
const allowedOrigins = require('./helpers/corsOptions');
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  maxAge: 300,
  optionsSuccessStatus: 204,
};

const { rateLimit } = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

const indexRouter = require('./routes/indexRouter');
const messageRouter = require('./routes/messageRouter');
const userRouter = require('./routes/userRouter');
const contactRouter = require('./routes/contactRouter');

const app = express();
const helmet = require('helmet');

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(limiter);
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: [
          /http:\/\/localhost:3000/,
          /http:\/\/localhost:5173/,
          /http:\/\/localhost:4173/,
          /.*\.railway.app.*/,
          /.*\.messaging-app-frontend-7ib.pages\.dev.*/,
        ],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: { policy: 'same-origin' },
  }),
);
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new PrismaSessionStore(new PrismaClient({ adapter }), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

app.use(passport.authenticate('session'));

app.use('/', indexRouter);
app.use('/message', validation.verifyUser, messageRouter);
app.use('/user', validation.verifyUser, userRouter);
app.use('/contact', validation.verifyUser, contactRouter);

// Catch 404 errors and forward to error handler
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  // Catch prisma 'record not found' returns as 404
  if (err.code === 'P2025') {
    res.status(404).json({
      message: 'User not found',
    });
  } else {
    res.status(err.status || 500);
    res.json({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    });
  }
});

module.exports = app;
