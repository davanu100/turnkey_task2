const express = require('express');
const router = express.Router();

//getting controller
const userDetailsController = require('../controllers/userDetails');

//All Routes

// get user details
router.get("/user/details", userDetailsController.getUserDetails);

module.exports = router;