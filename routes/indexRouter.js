const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController.js');

/* GET home page. */
router.get('/', indexController.getIndex);

// GET sign_up page
router.get('/signup', indexController.signup_get);

// POST sign up page
router.post('/signup', indexController.signup_post);

// GET login
router.get('/login', indexController.login_get);

// POST login
router.post('/login', (req, res, next) => {
  res.json({
    message: 'login POST route',
  });
});

module.exports = router;
