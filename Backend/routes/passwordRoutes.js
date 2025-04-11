const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware.auth);

// Password routes
router.post('/', passwordController.createPassword);
router.get('/', passwordController.getPasswords);
router.put('/:id', passwordController.updatePassword);
router.delete('/:id', passwordController.deletePassword);

module.exports = router;
