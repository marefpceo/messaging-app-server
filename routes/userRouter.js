const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');

/********* User Profile Routing *********/
/****************************************/
// GET user profile
userRouter.get('/:userId/edit-profile', userController.edit_profile_get);

// PUT edit profile
userRouter.put('/:userId/edit-profile', userController.edit_profile_put);

// DELETE user profile
userRouter.delete('/:userId/edit-profile', userController.edit_profile_delete);

module.exports = userRouter;
