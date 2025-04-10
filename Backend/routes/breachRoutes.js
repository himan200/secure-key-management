const express = require('express');
const router = express.Router();
const darkWebService = require('../services/darkWebService');

router.get('/:email', async (req, res) => {
  try {
    console.log(`Checking breaches for: ${req.params.email}`);
    const result = await darkWebService.checkEmailForBreaches(req.params.email);
    res.json(result);
  } catch (error) {
    console.error('Breach check error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to check breaches',
      details: error.message
    });
  }
});

module.exports = router;