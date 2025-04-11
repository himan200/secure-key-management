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
            const passwords = await Password.find({ user: userId })
                .select('-__v')
                .lean();
            
            // Decrypt each password's sensitive fields
            return passwords.map(pwd => ({
                ...pwd,
                username: new Password(pwd).decryptUsername(),
                password: new Password(pwd).decryptPassword()
            }));
        } catch (error) {
            console.error('Error in getPasswords:', error);
            throw new Error('Failed to fetch passwords');
        }
    }

    static async updatePassword(userId, passwordId, updateData) {
        try {
            // First find the existing password
            const existingPassword = await Password.findOne({ 
                _id: passwordId, 
                user: userId 
            });
            
            if (!existingPassword) {
                throw new Error('Password not found');
            }

            // Update fields and trigger encryption hooks
            existingPassword.set(updateData);
            existingPassword.lastUpdated = Date.now();
            await existingPassword.save();
            
            // Return the decrypted document
            return {
                ...existingPassword.toObject(),
                username: existingPassword.decryptUsername(),
                password: existingPassword.decryptPassword()
            };
        } catch (error) {
            console.error('Error in updatePassword:', error);
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
