const usermodel = require('../models/User');
const LoginOTP = require('../models/LoginOTP');
const authservice = require('../services/authService');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const emailService = require('../services/emailServices'); // 👈 fixed case

// Controller for registering a user
const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, date_of_birth, email, phone, password } = req.body;

  try {
    // Check if email exists and is unverified
    let user = await usermodel.findOne({ email, isVerified: false });
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    if (user) {
      // Update existing unverified user
      user.firstname = fullname.firstname;
      user.lastname = fullname.lastname;
      user.date_of_birth = date_of_birth;
      user.password = hashedPassword;
      user.verificationToken = verificationToken;
      user.verificationExpires = verificationExpires;
      await user.save();
    } else {
      // Create new user
      user = await authservice.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        date_of_birth,
        email,
        phone,
        password: hashedPassword,
        verificationToken,
        verificationExpires,
        isVerified: false,
      });
    }

    const baseUrl = process.env.FRONTEND_URL.trim();
    const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`;
    console.log("Verification URL:", verificationUrl); // 👈 URL logged here

    await emailService.sendVerificationEmail(user.email, verificationUrl);

    const token = await user.generateAuthToken();

    res.status(201).json({
      user,
      token,
      message: 'Registration successful! Please check your email to verify your account.',
    });

  } catch (error) {
    next(error);
  }
};


// Controller for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usermodel.findOne({ email }).select('+password');


    if (!user)
      return res.status(400).json({ 
        error: 'InvalidCredentials',
        message: 'Invalid email or password' 
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ 
        error: 'InvalidCredentials', 
        message: 'Invalid email or password' 
      });

    if (!user.isVerified)
      return res.status(400).json({ 
        error: 'EmailNotVerified',
        message: 'Please verify your email first. Check your inbox or Spam folder.' 
      });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await LoginOTP.create({
      user: user._id,
      otp,
      expiresAt
    });

    await emailService.sendLoginOTP(user.email, otp);

    res.status(200).json({
      message: 'OTP sent to your email. Please verify to complete login.',
      userId: user._id  // Send this so frontend can use it during OTP verification
    });

  } catch (err) {
    console.error("Login error:", err); // Add this
    res.status(500).json({ error: 'Server error', details: err.message }); // Also return the message for debugging
  }
  
};

// Controller for verifying login OTP
const verifyLoginOtp = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const record = await LoginOTP.findOne({ user: userId, otp });

    if (!record) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (record.expiresAt < new Date()) {
      await LoginOTP.deleteOne({ _id: record._id });
      return res.status(400).json({ message: 'OTP expired' });
    }

    await LoginOTP.deleteMany({ user: userId });

    const user = await usermodel.findById(userId);
    user.isOtpVerified = true;
    await user.save();
    
    const token = await user.generateAuthToken();
    res.status(200).json({ 
      message: 'OTP verified successfully', 
      token,
      user: {
        _id: user._id,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller to verify the email
const verify = async (req, res, next) => {
  try {
    const { token: rawToken } = req.query;
  
    if (!rawToken) {
      return res.status(400).json({ message: 'Token is required' });
    }
  
    const cleanedToken = rawToken.trim();
    const user = await usermodel.findOne({ verificationToken: cleanedToken });
  
    if (!user) {
      return res.status(400).json({ message: 'User not found for this token' });
    }
  
    user.isVerified = true;
    user.verificationToken = undefined;
  
    await user.save(); // 👈 This might be failing!
  
    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error("❌ Error during verification:", error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
  
};


// Export all controllers
const forgotPassword = async (req, res) => {
  try {
    console.log('Forgot password request received:', req.body);
    const { email } = req.body;
    if (!email) {
      console.error('Email is required');
      return res.status(400).json({ error: 'Email is required' });
    }
    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await emailService.sendPasswordResetEmail(user.email, resetUrl);

    res.status(200).json({ 
      success: true,
      message: 'Password reset link sent to your email',
      email: user.email
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ 
        error: 'Token and new password are required' 
      });
    }

    const user = await usermodel.findOne({ 
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        error: 'Invalid or expired reset token' 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Send confirmation email
    await emailService.sendPasswordResetConfirmation(user.email);

    return res.status(200).json({ 
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ 
      error: 'An error occurred during password reset',
      details: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verify,
  verifyLoginOtp,
  forgotPassword,
  resetPassword
};
