const mongoose = require('mongoose');

async function connectToDb() {
  try {
    if (!process.env.DB_CONNECT) {
      throw new Error('DB_CONNECT environment variable is not set');
    }

    await mongoose.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = connectToDb;
