const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController.js');

// POST sign up page
router.post('/signup', indexController.signup_post);

// POST login
router.post('/login', (req, res, next) => {
  res.json({
    message: 'login POST route',
  });
});

module.exports = router;
