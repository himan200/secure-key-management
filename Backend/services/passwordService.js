const Password = require('../models/Password');
const crypto = require('crypto');

class PasswordService {
    static async createPassword(userId, passwordData) {
        try {
            console.log('Creating password document with:', {
                userId,
                passwordData
            });
            const newPassword = new Password({
                user: userId,
                ...passwordData
            });
            const savedPassword = await newPassword.save();
            console.log('Password document saved successfully:', savedPassword);
            return savedPassword;
        } catch (error) {
            console.error('Error in createPassword:', {
                error: error.message,
                stack: error.stack,
                document: newPassword
            });
            throw new Error('Failed to create password: ' + error.message);
        }
    }

    static async getPasswords(userId) {
        try {
            return await Password.find({ user: userId })
                .select('-__v')
                .lean();
        } catch (error) {
            throw new Error('Failed to fetch passwords');
        }
    }

    static async updatePassword(userId, passwordId, updateData) {
        try {
            return await Password.findOneAndUpdate(
                { _id: passwordId, user: userId },
                { ...updateData, lastUpdated: Date.now() },
                { new: true }
            );
        } catch (error) {
            throw new Error('Failed to update password');
        }
    }

    static async deletePassword(userId, passwordId) {
        try {
            return await Password.findOneAndDelete({
                _id: passwordId,
                user: userId
            });
        } catch (error) {
            throw new Error('Failed to delete password');
        }
    }

}

module.exports = PasswordService;
