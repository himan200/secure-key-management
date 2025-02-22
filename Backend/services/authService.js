const User = require('../models/User'); // Make sure you import the correct model

// Service to create a new user
module.exports.createUser = async ({ firstname, lastname,date_of_birth, email, password }) => {
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
    password
  });

  // Save the user to the database
  await newUser.save();

  // Return the created user
  return newUser;
};
