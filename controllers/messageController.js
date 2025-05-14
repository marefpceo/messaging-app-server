const asyncHandler = require('express-async-handler');

exports.create_message_get = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'Create Message GET',
  });
});

exports.create_message_post = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'Create Message POST',
  });
});

exports.conversation_list_get = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'Conversation List GET',
  });
});

exports.conversation_get = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'Conversation GET',
  });
});

exports.conversation_delete = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'Conversation DELETE',
  });
});

exports.message_get = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'Message GET',
  });
});

exports.message_delete = asyncHandler(async (req, res, next) => {
  res.json({
    message: 'Message DELETE',
  });
});
