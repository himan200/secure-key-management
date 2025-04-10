const express = require('express');
const router = express.Router();
const { body,validationResult } = require('express-validator');
const authController = require('../controllers/authController'); // Fixed path for import

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route for user registration
router.post('/register', [
  body('email').isEmail().withMessage('Invalid email'),
  body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], 
  // Pass req, res, and next to the registerUser function
  handleValidationErrors,
  authController.registerUser
);

// Route for User Login
router.post(
    '/login',
    [
      body('email').isEmail().withMessage('Invalid email'),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    // Validation middleware
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
    // The actual login handler
    handleValidationErrors,
    authController.loginUser
  );
  router.get('/verify-email', authController.verify);
  router.post('/verify-login-otp', authController.verifyLoginOtp);
  
  // Forgot password route
  router.post('/forgot-password', 
    body('email').isEmail().withMessage('Invalid email'),
    handleValidationErrors,
    authController.forgotPassword
  );

  // Reset password route
  router.post('/reset-password',
    [
      body('token').notEmpty().withMessage('Token is required'),
      body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character'),
    ],
    handleValidationErrors,
    authController.resetPassword
  );

  let resetAttempts = new Map();

const resetLimiter = (req, res, next) => {
  const ip = req.headers.get('x-forwarded-for') || req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  
  if (!resetAttempts.has(ip)) {
    resetAttempts.set(ip, { count: 1, startTime: now });
    return next();
  }

  const entry = resetAttempts.get(ip);
  if (now - entry.startTime > windowMs) {
    resetAttempts.set(ip, { count: 1, startTime: now });
    return next();
  }

  if (entry.count >= 5) {
    return new Response(JSON.stringify({ 
      error: 'Too many reset attempts, please try again later' 
    }), { 
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  entry.count++;
  next();
};

module.exports = router;
