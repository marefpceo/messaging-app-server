const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');

/********* User Profile Routing *********/
/****************************************/
// GET user profile
userRouter.get('/:user/edit_profile', userController.edit_profile_get);

// PUT edit profile
userRouter.put('/:user/edit_profile', userController.edit_profile_put);

module.exports = userRouter;
