const User = require('../models/User'); // Make sure you import the correct model
const crypto = require('crypto');




module.exports.createUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const newUser = new User({
    fullname: userData.fullname,
    date_of_birth: userData.date_of_birth,
    email: userData.email,
    password: userData.password,
    verificationToken: userData.verificationToken,
    verificationExpires: userData.verificationExpires,
    isVerified: userData.isVerified
  });

  await newUser.save();
  return newUser;
};