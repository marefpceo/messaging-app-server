const express = require('express');
const authRouter = express.Router();
const messageController = require('../controllers/messageController');
const contactController = require('../controllers/contactController');
const userController = require('../controllers/userController');

/*********** Contact Routing ***********/
/***************************************/
// GET contacts
authRouter.get('/contact', contactController.contacts_get);

// POST add contact
authRouter.post('/contact/add', contactController.add_contact_post);

// DELETE contact
authRouter.delete('/contact/delete', contactController.contact_delete);

/********* User Profile Routing *********/
/****************************************/
// GET user profile
authRouter.get('/user/:user/edit_profile', userController.edit_profile_get);

// PUT edit profile
authRouter.put('/user/:user/edit_profile', userController.edit_profile_put);

module.exports = authRouter;
