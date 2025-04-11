const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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

// Encrypt password and username before saving
passwordSchema.pre("save", async function(next) {
  console.log('Pre-save hook triggered for password:', this.title);
  
  try {
    // Encrypt password if modified
    if (this.isModified("password")) {
      const iv = crypto.randomBytes(16).toString("hex");
      const cipher = crypto.createCipheriv(
        "aes-256-cbc", 
        Buffer.from(process.env.ENCRYPTION_KEY, "hex"), 
        Buffer.from(iv, "hex")
      );
      
      let encrypted = cipher.update(this.password, "utf8", "hex");
      encrypted += cipher.final("hex");
      
      this.password = encrypted;
      this.iv = iv;
    }

    // Encrypt username if modified
    if (this.isModified("username")) {
      const usernameIv = crypto.randomBytes(16).toString("hex");
      const cipher = crypto.createCipheriv(
        "aes-256-cbc", 
        Buffer.from(process.env.ENCRYPTION_KEY, "hex"), 
        Buffer.from(usernameIv, "hex")
      );
      
      let encrypted = cipher.update(this.username, "utf8", "hex");
      encrypted += cipher.final("hex");
      
      this.username = encrypted;
      this.usernameIv = usernameIv;
    }

    next();
  } catch (err) {
    next(err);
  }
});

// Decrypt password when retrieving
passwordSchema.methods.decryptPassword = function() {
  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc", 
      Buffer.from(process.env.ENCRYPTION_KEY, "hex"), 
      Buffer.from(this.iv, "hex")
    );
    
    let decrypted = decipher.update(this.password, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("Decryption error:", err);
    return null;
  }
};

// Decrypt username when retrieving
passwordSchema.methods.decryptUsername = function() {
  try {
    if (!this.usernameIv) {
      return this.username; // Return plaintext if not encrypted
    }
    
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc", 
      Buffer.from(process.env.ENCRYPTION_KEY, "hex"), 
      Buffer.from(this.usernameIv, "hex")
    );
    
    let decrypted = decipher.update(this.username, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("Username decryption error:", err);
    return null;
  }
};

module.exports = mongoose.model("Password", passwordSchema);
