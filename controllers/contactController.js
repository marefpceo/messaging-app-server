const asyncHandler = require('express-async-handler');

exports.contacts_get = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'Contacts GET',
  });
});

exports.add_contact_post = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'Add Contact POST',
  });
});

exports.contact_delete = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'Contact DELETE',
  });
});
