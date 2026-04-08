const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, phone, email, password, age, gender, address } = req.body;

    if (!phone && !email) {
      return res.status(400).json({
        success: false,
        message: 'தொலைபேசி அல்லது மின்னஞ்சல் கொடுக்கவும்', // Provide phone or email
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        ...(phone ? [{ phone }] : []),
        ...(email ? [{ email }] : []),
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'இந்த தொலைபேசி / மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது', // Already registered
      });
    }

    const user = await User.create({ name, phone, email, password, age, gender, address });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'பதிவு வெற்றிகரமாக முடிந்தது! நம்ம யாத்ரிக்கு வரவேற்கிறோம்!', // Registration successful! Welcome to Namma Yatri!
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        age: user.age,
        gender: user.gender,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    // identifier = phone number or email

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'தொலைபேசி / மின்னஞ்சல் மற்றும் கடவுச்சொல் தேவை', // Phone/email and password required
      });
    }

    // Find user by phone or email
    const user = await User.findOne({
      $or: [{ phone: identifier }, { email: identifier.toLowerCase() }],
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'தொலைபேசி / மின்னஞ்சல் அல்லது கடவுச்சொல் தவறானது', // Wrong phone/email or password
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'தொலைபேசி / மின்னஞ்சல் அல்லது கடவுச்சொல் தவறானது',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: `வணக்கம் ${user.name}! வெற்றிகரமாக உள்நுழைந்தீர்கள்`, // Welcome! Successfully logged in
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        age: user.age,
        gender: user.gender,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        age: user.age,
        gender: user.gender,
        address: user.address,
        preferredLanguage: user.preferredLanguage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'age', 'gender', 'address', 'preferredLanguage'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'சுயவிவரம் புதுப்பிக்கப்பட்டது', // Profile updated
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        age: user.age,
        gender: user.gender,
        address: user.address,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'தற்போதைய கடவுச்சொல் தவறானது', // Current password is wrong
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'கடவுச்சொல் மாற்றப்பட்டது', // Password changed
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword };
