const express = require('express');
const router = express.Router();
const { getUserDetails } = require('../../controllers/user');
const authMiddleware = require('../../middlewares/auth'); // The middleware you provided

// Route to get user details with authorization
router.get('/me', authMiddleware, getUserDetails);

module.exports = router;
