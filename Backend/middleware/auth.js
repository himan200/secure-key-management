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
    const { token } = await req.json(); // Bun's native JSON parsing
    const user = await User.findOne({ 
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return new Response(JSON.stringify({ 
        error: 'Invalid or expired reset token' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    req.user = user;
    next();
  } catch (e) {
    return new Response(JSON.stringify({ 
      error: 'Server error during token validation' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

module.exports = auth;
