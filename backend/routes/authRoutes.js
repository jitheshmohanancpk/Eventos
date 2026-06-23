const express = require('express');
const router = express.Router();
const multer = require('multer');

// Import middleware
const { protect, authorizeRoles } = require('../middleware/auth');

// Import all controller functions including the new ones
const { 
    registerUser, 
    loginUser, 
    verifyOTP, 
    getMe,
    getAllUsers,
    deleteUser, // Added this
    updateUser  // Added this
} = require('../controllers/authController');

const upload = multer({ dest: 'uploads/' });

// Routes
router.post('/register', upload.single('logo'), registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.get('/me', protect, getMe);

// Admin-only Routes
router.get('/users', protect, authorizeRoles('admin'), getAllUsers);
router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);
router.put('/:id', protect, authorizeRoles('admin'), updateUser);

module.exports = router;