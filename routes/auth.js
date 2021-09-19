const express = require('express');
const router = express.Router();

//getting auth controller
const authController = require('../controllers/auth');

//All Routes

// post user login
router.post("/login", authController.postLogin);

// post user signUp
router.post("/signUp", authController.postSignUp);

module.exports = router;