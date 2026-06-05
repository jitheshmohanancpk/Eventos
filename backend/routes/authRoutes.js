const express = require('express');
const router = express.Router();
const multer = require('multer');
const { registerUser, loginUser, verifyOTP, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Configure multer
const upload = multer({ dest: 'uploads/' });

/**
 * FIXED: Route with explicit middleware handling.
 * By defining the multer middleware separately, we ensure the 
 * 'next' function is properly injected by Express into the controller.
 */
router.post('/register', upload.single('logo'), (req, res, next) => {
    // If multer passes, this executes. 
    // We call next() to pass control to registerUser.
    next();
}, registerUser);

router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.get('/me', protect, getMe);

module.exports = router;