const asyncHandler = require('express-async-handler');

exports.edit_profile_get = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'Edit Profile GET',
  });
});

exports.edit_profile_post = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'Edit Profile POST',
  });
});
