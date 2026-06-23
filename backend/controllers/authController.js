const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

const signToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });

// 1. Register User
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, companyName, phone, currentEventName, eventLocation } = req.body;
    
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({
      name, email, password: hashedPassword, role, phone,
      organizerProfile: role === 'organizer' ? { 
        companyName, currentEventName, eventLocation, logo: req.file?.path 
      } : undefined
    });

    await user.save();
    
    try {
      await sendEmail({
        email: user.email,
        subject: 'Welcome to Evento! 🎉',
        message: `Hi ${name}, your account has been successfully created. Welcome aboard!`
      });
    } catch (err) {
      console.error("Welcome email failed:", err);
    }

    res.status(201).json({ 
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token: signToken(user._id, role) 
    });
  } catch (error) {
    next(error); 
  }
};

// 2. Login (Triggers OTP)
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 600000; 
    
    await user.save();
    await sendEmail({ email: user.email, subject: 'Your OTP', message: `Your code is: ${otp}` });
    
    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    next(error);
  }
};

// 3. Verify OTP
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
    
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ 
        success: true, 
        token: signToken(user._id, user.role),
        user: { _id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    next(error);
  }
};

// 4. Get Current User
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// 5. Get All Users (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// 6. Delete User (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// 7. Update User (Admin)
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// EXPORT ALL FUNCTIONS
module.exports = { 
    registerUser, 
    loginUser, 
    verifyOTP, 
    getMe,
    getAllUsers,
    deleteUser,
    updateUser
};