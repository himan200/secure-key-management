require('dotenv').config();
const mongoose = require("mongoose");
const crypto = require("crypto");

const passwordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  website: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ["Email", "Social Media", "Financial", "Shopping", "Work", "Other"],
    default: "Other"
  },
  iv: {
    type: String,
    required: false
  },
  usernameIv: {
    type: String,
    required: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const validateEncryptionParams = (key, iv) => {
  try {
    if (!key || !iv) throw new Error('Missing encryption key or IV');
    const keyStr = String(key);
    const ivStr = String(iv);
    if (!/^[0-9a-fA-F]{64}$/.test(keyStr)) throw new Error('Invalid ENCRYPTION_KEY');
    if (!/^[0-9a-fA-F]{32}$/.test(ivStr)) throw new Error('Invalid IV');
    return true;
  } catch (err) {
    console.error('Encryption validation failed:', err.message);
    throw err;
  }
};

passwordSchema.pre("save", async function(next) {
  try {
    if (this.isModified("password")) {
      const iv = crypto.randomBytes(16).toString("hex");
      const cipher = crypto.createCipheriv(
        "aes-256-cbc", 
        Buffer.from(process.env.ENCRYPTION_KEY, "hex"), 
        Buffer.from(iv, "hex")
      );
      this.password = cipher.update(String(this.password), "utf8", "hex") + cipher.final("hex");
      this.iv = iv;
    }

    if (this.isModified("username")) {
      const usernameIv = crypto.randomBytes(16).toString("hex");
      const cipher = crypto.createCipheriv(
        "aes-256-cbc", 
        Buffer.from(process.env.ENCRYPTION_KEY, "hex"), 
        Buffer.from(usernameIv, "hex")
      );
      this.username = cipher.update(String(this.username), "utf8", "hex") + cipher.final("hex");
      this.usernameIv = usernameIv;
    }
    next();
  } catch (err) {
    next(err);
  }
});

passwordSchema.methods.decryptPassword = function() {
  try {
    console.log('Starting password decryption...');
    console.log('IV:', this.iv, 'Type:', typeof this.iv);
    console.log('Password:', this.password, 'Type:', typeof this.password);
    
    // If no IV, assume password is not encrypted
    if (!this.iv) {
      console.log('No IV found - returning original password');
      return this.password;
    }

    // Ensure values are strings
    const iv = String(this.iv).trim();
    const encrypted = String(this.password).trim();
    const key = String(process.env.ENCRYPTION_KEY).trim();

    // Check if password looks encrypted (hex string)
    if (!/^[0-9a-fA-F]+$/.test(encrypted)) {
      console.log('Password does not appear to be encrypted - returning original');
      return this.password;
    }

    console.log('Validating encryption params...');
    validateEncryptionParams(key, iv);

    console.log('Creating decipher...');
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(key, "hex"),
      Buffer.from(iv, "hex")
    );

    console.log('Decrypting...');
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    console.log('Decryption successful');
    return decrypted;
  } catch (err) {
    console.error("Password decryption failed:", {
      message: err.message,
      stack: err.stack,
      iv: this.iv,
      password: this.password
    });
    return this.password;
  }
};

passwordSchema.methods.decryptUsername = function() {
  try {
    console.log('Starting username decryption...');
    console.log('Username IV:', this.usernameIv, 'Type:', typeof this.usernameIv);
    console.log('Username:', this.username, 'Type:', typeof this.username);
    
    if (!this.usernameIv || !this.username) {
      console.log('Missing username IV or username - returning original');
      return this.username;
    }

    // Ensure values are strings
    const iv = String(this.usernameIv).trim();
    const encrypted = String(this.username).trim();
    const key = String(process.env.ENCRYPTION_KEY).trim();

    console.log('Validating encryption params...');
    validateEncryptionParams(key, iv);

    console.log('Creating decipher...');
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(key, "hex"),
      Buffer.from(iv, "hex")
    );

    console.log('Decrypting...');
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    console.log('Decryption successful');
    return decrypted;
  } catch (err) {
    console.error("Username decryption failed:", {
      message: err.message,
      stack: err.stack,
      usernameIv: this.usernameIv,
      username: this.username
    });
    return this.username;
  }
};

module.exports = mongoose.model("Password", passwordSchema);
