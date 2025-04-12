const User = require('../models/User');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

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

module.exports.updateUser = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (updateData.fullname) {
    user.fullname = {
      firstname: updateData.fullname.firstname || user.fullname.firstname,
      lastname: updateData.fullname.lastname || user.fullname.lastname
    };
  }

  if (updateData.date_of_birth) {
    user.date_of_birth = updateData.date_of_birth;
  }

  if (updateData.email) {
    user.email = updateData.email;
  }

  await user.save();
  return user;
};

module.exports.changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error('Current password is incorrect');
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
  return user;
};

module.exports.validateCurrentPassword = async (userId, password) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new Error('User not found');
  }
  return bcrypt.compare(password, user.password);
};
