const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    passwords: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Password'
    }],
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters']
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters']
        }
    },
    date_of_birth: {
        type: Date,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    verificationToken: {
        type: String
    },
    verificationExpires: {
        type: Date
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

// Generate JWT token
userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign(
        { 
            _id: this._id,
            email: this.email,
            isVerified: this.isVerified 
        }, 
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    this.tokens = this.tokens.concat({ token });
    await this.save();
    console.log('Generated token for user:', this.email);
    return token;
};

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Hash password before saving
userSchema.statics.hashPassword = async function (Password) {
    return await bcrypt.hash(Password, 12);
};

const user = mongoose.model('User', userSchema);
module.exports = user;
