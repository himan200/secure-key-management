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

const authMiddleware = require('../middleware/auth');

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
  authMiddleware.validateResetToken,
  authController.resetPassword
);

// Rate limiting middleware for password reset
const rateLimit = require('express-rate-limit');
const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many password reset attempts, please try again later',
  skipSuccessfulRequests: true
});

// Apply rate limiting to forgot password route
router.post('/forgot-password', 
  body('email').isEmail().withMessage('Invalid email'),
  handleValidationErrors,
  resetLimiter,
  authController.forgotPassword
);

// Get current user route
router.get('/me', 
  authMiddleware.auth,
  authController.getCurrentUser
);

module.exports = router;
