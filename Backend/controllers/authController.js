const usermodel = require('../models/User');
const authservice = require('../services/authService');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Controller for registering a user
module.exports.registerUser = async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname,date_of_birth, email, password, } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Call the service to create the user
    const user = await authservice.createUser({
     firstname: fullname.firstname,
     lastname: fullname.lastname,
      date_of_birth,
      email,
      password: hashedPassword
    });

    // Generate the auth token for the user
    const token = await user.generateAuthToken();

    // Respond with the user data and token
    res.status(201).json({ user, token });

  } catch (error) {
    // If there's an error, pass it to the next middleware
    next(error);
  }
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find user by email and select the password field
    const user = await usermodel.findOne({ email }).select('password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the password matches
    const isMatch = await user.comparePassword(password); 
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate authentication token
    const token = await user.generateAuthToken();
    
    // Send response with the token and user data
    res.status(200).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


