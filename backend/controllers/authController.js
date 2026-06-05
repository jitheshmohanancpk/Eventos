const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

const signToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, companyName, phone, currentEventName, eventLocation } = req.body;
    
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password here before saving
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({
      name, 
      email, 
      password: hashedPassword, 
      role, 
      phone,
      organizerProfile: role === 'organizer' ? { 
        companyName, currentEventName, eventLocation, logo: req.file?.path 
      } : undefined
    });

    await user.save();

    res.status(201).json({ 
      success: true,
      _id: user._id, 
      name, email, role, 
      token: signToken(user._id, role) 
    });
  } catch (error) {
    next(error); 
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    await User.findByIdAndUpdate(user._id, { otp, otpExpires: Date.now() + 600000 });
    await sendEmail({ email: user.email, subject: 'Your OTP', message: `Code: ${otp}` });
    
    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
    
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    
    await User.updateOne({ _id: user._id }, { $unset: { otp: "", otpExpires: "" } });
    res.json({ success: true, token: signToken(user._id, user.role) });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, verifyOTP, getMe };