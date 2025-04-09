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
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    handleValidationErrors,
    authController.resetPassword
  );

module.exports = router;
