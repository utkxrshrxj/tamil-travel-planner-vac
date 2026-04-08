const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'அனுமதி இல்லை. முதலில் உள்நுழையவும்', // Not authorized. Please login first
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'பயனர் கணக்கு கிடைக்கவில்லை', // User account not found
      });
    }

    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'கணக்கு செயலிழந்துள்ளது', // Account is deactivated
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'செல்லாத அல்லது காலாவதியான டோக்கன்', // Invalid or expired token
    });
  }
};

module.exports = { protect };
