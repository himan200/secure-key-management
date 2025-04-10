const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors =require('cors');
const connectToDb = require('./db/db');
const authRoutes = require('./routes/authRoutes');
const breachRoutes = require('./routes/breachRoutes');

connectToDb();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
  
// Request logger middleware
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] Incoming ${req.method} request to ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  if (req.url.includes('/reset-password')) {
    console.log('Reset password request detected - logging body preview');
    req.on('data', (chunk) => {
      console.log('Body preview:', chunk.toString().slice(0, 100));
    });
  }
  let data = [];
  req.on('data', chunk => data.push(chunk));
  req.on('end', () => {
    const body = Buffer.concat(data).toString();
    console.log('Raw body:', body);
    try {
      req.body = body ? JSON.parse(body) : {};
      next();
    } catch (err) {
      console.error('JSON parse error:', err);
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
});


app.get('/',(req, res)=>{
    res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/breaches', breachRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

module.exports = app;
