const weatherService = require('../services/weatherService');

/**
 * Handles weather requests by coordinating city/coord parameters and calling weatherService
 */
async function getWeather(req, res) {
  try {
    const { city, lat, lon } = req.query;

    let params = {};

    // 1. Validation of parameters
    if (lat !== undefined && lon !== undefined) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_COORDINATES',
          message: 'Latitude and longitude coordinates must be valid decimal numbers.'
        });
      }

      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_COORDINATES',
          message: 'Latitude must be between -90 and 90, and longitude between -180 and 180.'
        });
      }

      params = { lat: latitude, lon: longitude };
    } else if (city) {
      const cleanedCity = city.trim();
      if (cleanedCity === '') {
        return res.status(400).json({
          success: false,
          error: 'INVALID_CITY',
          message: 'City name cannot be empty.'
        });
      }
      params = { city: cleanedCity };
    } else {
      // If no query params are provided, default to 'Jalandhar'
      params = { city: 'Jalandhar' };
    }

    // 2. Fetch and return data
    const data = await weatherService.getWeatherData(params);
    return res.json({
      success: true,
      data
    });

  } catch (error) {
    if (error.message === 'API_KEY_MISSING') {
      return res.status(500).json({
        success: false,
        error: 'API_KEY_MISSING',
        message: 'OpenWeather API Key is not configured on the backend server. Please set OPENWEATHER_API_KEY in the .env file.'
      });
    }

    if (error.message === 'INVALID_API_KEY') {
      return res.status(401).json({
        success: false,
        error: 'INVALID_API_KEY',
        message: 'Invalid OpenWeather API Key. If you just created this key, OpenWeather takes 10 to 30 minutes to activate new keys.'
      });
    }

    if (error.message === 'CITY_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: 'CITY_NOT_FOUND',
        message: 'City not found. Please enter a valid city name.'
      });
    }

    if (error.message === 'API_CONNECTION_ERROR') {
      return res.status(503).json({
        success: false,
        error: 'SERVICE_UNAVAILABLE',
        message: 'Unable to connect to the weather service. Check backend connection or try again later.'
      });
    }

    // Fallback error
    console.error('Error in weatherController:', error);
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'An unexpected error occurred while retrieving weather data.'
    });
  }
}

module.exports = {
  getWeather
};
