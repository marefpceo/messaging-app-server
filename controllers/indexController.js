const asyncHandler = require('express-async-handler');

exports.getIndex = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'mCHAT',
  });
});

exports.signup_get = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'signup GET route',
  });
});

exports.signup_post = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'signup POST route',
  });
});

exports.login_get = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'login GET route',
  });
});
