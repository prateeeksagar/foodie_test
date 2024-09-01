const express = require('express');
const users = require('../controllers/userController');

const router = express.Router();


// route to make user login
router.post('/login', users.userLogin);
// route to make user signup
router.post('/signup',users.userSignUp)

// route to get the customer details
router.get('/profile', users.getProfile);
module.exports = router;