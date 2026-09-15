const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// @route   GET /api/weather
// @desc    Get current weather and forecasts by city or coordinates
// @access  Public
router.get('/', weatherController.getWeather);

module.exports = router;
