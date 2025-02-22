const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController'); // Fixed path for import

// Route for user registration
router.post('/register', [
  body('email').isEmail().withMessage('Invalid email'),
  body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], (req, res, next) => {
  // Pass req, res, and next to the registerUser function
  authController.registerUser(req, res, next);
});

module.exports = router;
