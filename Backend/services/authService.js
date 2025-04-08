const User = require('../models/User'); // Make sure you import the correct model
const crypto = require('crypto');




module.exports.createUser = async ({ firstname, lastname, date_of_birth, email, password, verificationToken, verificationExpires, isverified }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const newUser = new User({
    fullname: { firstname, lastname },
    date_of_birth,
    email,
    password,
    verificationToken,     // 👈 use what was passed
    verificationExpires,   // 👈 use what was passed
    isverified
  });

  await newUser.save();
  return newUser;
};