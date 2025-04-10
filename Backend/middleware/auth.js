const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      throw new Error();
    }

    // Check if OTP was verified (stored in user model)
    if (!user.isOtpVerified) {
      return res.status(401).send({ error: 'Please complete OTP verification' });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

// Add this to auth.js
const validateResetToken = async (req, res, next) => {
  try {
    const token = req.query.token || req.body.token;
    if (!token) {
      return res.status(400).json({ 
        error: 'Reset token is required' 
      });
    }

    const user = await User.findOne({ 
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        error: 'Invalid or expired reset token' 
      });
    }

    req.user = user;
    next();
  } catch (e) {
    console.error('Token validation error:', e);
    return res.status(500).json({ 
      error: 'Server error during token validation' 
    });
  }
};

module.exports = {
  auth,
  validateResetToken
};
