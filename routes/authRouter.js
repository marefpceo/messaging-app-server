const express = require('express');
const authRouther = express.Router();
const authController = require('../controllers/authController');
const { router } = require('../app');

// GET create message
router.get('/create_message', authController.create_message_get);

// POST create message
router.post('/create_message', authController.create_message_post);

// GET message list
router.get('/:user/messages', authController.message_get);

// GET conversation
router.get('/:user/messages/:contactId', authController.conversation_get);

// GET selected message
router.get('/:user/messages/:message', authController.selected_messaged_get);

// GET user profile
router.get('/:user/edit_profile', authController.edit_profile_get);

// UPDATE edit profile
router.update('/:user/edit_profile', authController.edit_profile_update);

module.exports = authRouther;
l;
