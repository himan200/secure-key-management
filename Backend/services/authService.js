const User = require('../models/User'); // Make sure you import the correct model
const crypto = require('crypto');




// Service to create a new user
module.exports.createUser = async ({ firstname, lastname,date_of_birth, email, password }) => {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  const isverified = false;
  
  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }



  // Create a new user instance
  const newUser = new User({
    fullname: {
      firstname,
      lastname
    },
    date_of_birth,
    email,
    password,
    verificationToken,
    verificationExpires,
    isverified
  });

  // Save the user to the database
  await newUser.save();

  // Return the created user
  return newUser;
};
