const asyncHandler = require('express-async-handler');

exports.edit_profile_get = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'Edit Profile GET',
  });
});

exports.edit_profile_put = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'Edit Profile PUT',
    return: req.body.message,
  });
});
