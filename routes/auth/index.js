const express = require('express');
const { registerUser, verifyUser, requestNewVerificationCode, loginUser } = require('../../controllers/auth');
const router = express.Router();

router.post('/register', registerUser);
router.post('/verify', verifyUser);
router.post('/request-new-verification', requestNewVerificationCode);
router.post('/login', loginUser);

module.exports = router;
