const PasswordService = require('../services/passwordService');
const User = require('../models/User');
const Password = require('../models/Password');

// Create new password entry
exports.createPassword = async (req, res) => {
    try {
        console.log('Creating password with data:', {
            userId: req.user._id,
            passwordData: req.body
        });
        const newPassword = await PasswordService.createPassword(
            req.user._id, 
            req.body
        );
        console.log('Password created successfully:', newPassword);

        // Add password reference to user
        await User.findByIdAndUpdate(
            req.user._id,
            { $push: { passwords: newPassword._id } }
        );

        res.status(201).json({
            success: true,
            data: newPassword
        });
    } catch (err) {
        console.error('Password creation error:', err);
        const errorMessage = err.message.includes('ENCRYPTION_KEY') 
            ? 'Encryption configuration error' 
            : 'Failed to create password';
        res.status(500).json({
            success: false,
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// Get all passwords for user
exports.getPasswords = async (req, res) => {
    try {
        const passwords = await PasswordService.getPasswords(req.user._id);
        
        // Decrypt and transform passwords before sending to client
        const decryptedPasswords = passwords.map(pw => {
            const passwordDoc = new Password(pw);
            return {
                _id: pw._id,
                title: pw.title,
                username: passwordDoc.decryptUsername() || '',
                password: passwordDoc.decryptPassword() || '',
                website: pw.website,
                notes: pw.notes,
                category: pw.category,
                lastUpdated: pw.lastUpdated
            };
        });

        res.status(200).json({
            success: true,
            count: decryptedPasswords.length,
            data: decryptedPasswords
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Update password entry
exports.updatePassword = async (req, res) => {
    try {
        const updatedPassword = await PasswordService.updatePassword(
            req.user._id,
            req.params.id,
            req.body
        );

        if (!updatedPassword) {
            return res.status(404).json({
                success: false,
                error: 'Password not found'
            });
        }

        res.status(200).json({
            success: true,
            data: updatedPassword
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Delete password entry
exports.deletePassword = async (req, res) => {
    try {
        const deletedPassword = await PasswordService.deletePassword(
            req.user._id,
            req.params.id
        );

        if (!deletedPassword) {
            return res.status(404).json({
                success: false,
                error: 'Password not found'
            });
        }

        // Remove reference from user
        await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { passwords: req.params.id } }
        );

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
