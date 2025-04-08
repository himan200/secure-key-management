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

  const { fullname, date_of_birth, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    console.log(" Verification Token:", verificationToken); // 👈 Token logged here

    const user = await authservice.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      date_of_birth,
      email,
      password: hashedPassword,
      verificationToken,
      verificationExpires,
      isVerified: false,
    });

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
      return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: 'Invalid email or password' });

    if (!user.isVerified)
      return res.status(400).json({ error: 'Please verify your email first.' });

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

    // ✅ OPTIONAL: Generate JWT now and send it to the user
    const user = await usermodel.findById(userId);
    const token = await user.generateAuthToken();

    res.status(200).json({ message: 'OTP verified successfully', token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller to verify the email
const verify = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const user = await usermodel.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'ErrorHere' });
    }

    console.log("Equal?", token === user.verificationToken);
console.log("Lengths:", token.length, user.verificationToken.length);


    if (user.verificationExpires && user.verificationExpires < Date.now()) {
      return res.status(400).json({ message: 'Token has expired. Please register again.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    next(error);
  }
};

// Export all controllers
module.exports = {
  registerUser,
  loginUser,
  verify,
  verifyLoginOtp // 👈 export OTP verification too
};
