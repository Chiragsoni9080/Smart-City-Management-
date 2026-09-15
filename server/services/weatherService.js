const dns = require('dns');

// In-memory cache to avoid excessive API calls
// cacheKey -> { data, timestamp }
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache duration

/**
 * Gets a clean weather data payload (current + forecast) from cache or OpenWeather API
 */
async function getWeatherData({ city, lat, lon }) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('API_KEY_MISSING');
  }

  // Construct unique cache key
  const cacheKey = city
    ? `city:${city.toLowerCase().trim()}`
    : `coords:${lat.toFixed(4)},${lon.toFixed(4)}`;

  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    console.log(`Serving cached weather data for key: ${cacheKey}`);
    return cached.data;
  }

  // Define API urls
  const baseUrl = 'https://api.openweathermap.org/data/2.5';
  const queryParam = city ? `q=${encodeURIComponent(city)}` : `lat=${lat}&lon=${lon}`;

  const weatherUrl = `${baseUrl}/weather?${queryParam}&units=metric&appid=${apiKey}`;
  const forecastUrl = `${baseUrl}/forecast?${queryParam}&units=metric&appid=${apiKey}`;

  try {
    // Parallel fetch current and forecast
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl)
    ]);

    if (weatherRes.status === 401 || forecastRes.status === 401) {
      throw new Error('INVALID_API_KEY');
    }

    if (weatherRes.status === 404 || forecastRes.status === 404) {
      throw new Error('CITY_NOT_FOUND');
    }

    if (!weatherRes.ok || !forecastRes.ok) {
      throw new Error(`API_ERROR_STATUS_${weatherRes.status}_OR_${forecastRes.status}`);
    }

    const currentRaw = await weatherRes.json();
    const forecastRaw = await forecastRes.json();

    const transformedData = transformWeatherData(currentRaw, forecastRaw);

    // Store in cache
    cache.set(cacheKey, {
      data: transformedData,
      timestamp: Date.now()
    });

    return transformedData;
  } catch (error) {
    if (error.message === 'API_KEY_MISSING' || error.message === 'INVALID_API_KEY' || error.message === 'CITY_NOT_FOUND') {
      throw error;
    }
    console.error('Weather Service API Call failed:', error);
    throw new Error('API_CONNECTION_ERROR');
  }
}

/**
 * Transforms raw OpenWeather responses into a clean, parsed UI-ready dashboard response
 */
function transformWeatherData(current, forecast) {
  // Current weather extraction
  const cityName = current.name || 'Unknown Location';
  const temp = Math.round(current.main.temp);
  const feelsLike = Math.round(current.main.feels_like);
  const condition = current.weather[0]?.main || 'Clear';
  const conditionDesc = current.weather[0]?.description || 'Clear sky';
  const icon = current.weather[0]?.icon || '01d';
  const humidity = current.main.humidity;
  const windSpeed = Math.round(current.wind.speed * 3.6); // Convert m/s to km/h
  const windDeg = current.wind.deg || 0;
  const pressure = current.main.pressure;
  const visibility = (current.visibility / 1000).toFixed(1); // Convert meters to km
  const sunrise = current.sys.sunrise;
  const sunset = current.sys.sunset;

  // UV Index placeholder (since it requires a separate One Call API call)
  // Calculate a reasonable fake UV Index based on sunset/sunrise and weather condition
  const nowHour = new Date().getHours();
  let uvIndex = 0;
  if (nowHour >= 6 && nowHour <= 18) {
    const isMidday = nowHour >= 11 && nowHour <= 15;
    if (condition.toLowerCase().includes('clear')) {
      uvIndex = isMidday ? 8 : 4;
    } else if (condition.toLowerCase().includes('cloud')) {
      uvIndex = isMidday ? 4 : 2;
    } else {
      uvIndex = 1;
    }
  }

  // Get wind direction string from degrees
  const getWindDirection = (deg) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
  };
  const windDirection = getWindDirection(windDeg);

  // Parse Hourly Forecast (first 8 items ~ 24 hours)
  const hourly = forecast.list.slice(0, 8).map(item => {
    const dateObj = new Date(item.dt * 1000);
    const timeStr = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    return {
      time: timeStr,
      temp: Math.round(item.main.temp),
      condition: item.weather[0]?.main || 'Clear',
      icon: item.weather[0]?.icon || '01d',
      rainProb: Math.round((item.pop || 0) * 100), // Probability of precipitation (0 to 1)
      windSpeed: Math.round(item.wind.speed * 3.6)
    };
  });

  // Parse Daily Forecast (grouping remaining 3-hourly forecast items)
  // Key format: 'YYYY-MM-DD'
  const dailyGroups = {};
  forecast.list.forEach(item => {
    const dateStr = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!dailyGroups[dateStr]) {
      dailyGroups[dateStr] = [];
    }
    dailyGroups[dateStr].push(item);
  });

  // Format daily groups to select min/max, main condition, icon, and maximum rain prob
  const dailyList = Object.keys(dailyGroups).map(dateStr => {
    const items = dailyGroups[dateStr];
    let tempMin = Infinity;
    let tempMax = -Infinity;
    let maxPop = 0;
    const icons = {};
    const conditions = {};

    items.forEach(item => {
      if (item.main.temp_min < tempMin) tempMin = item.main.temp_min;
      if (item.main.temp_max > tempMax) tempMax = item.main.temp_max;
      if (item.pop > maxPop) maxPop = item.pop;

      const ic = item.weather[0]?.icon || '01d';
      icons[ic] = (icons[ic] || 0) + 1;

      const cond = item.weather[0]?.main || 'Clear';
      conditions[cond] = (conditions[cond] || 0) + 1;
    });

    // Find most frequent icon and condition
    const mostCommonIcon = Object.keys(icons).reduce((a, b) => icons[a] > icons[b] ? a : b);
    const mostCommonCondition = Object.keys(conditions).reduce((a, b) => conditions[a] > conditions[b] ? a : b);
    const dateObj = new Date(dateStr);

    // Formatting day name (e.g. Mon, Tue)
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return {
      day: dayName,
      date: formattedDate,
      tempMin: Math.round(tempMin),
      tempMax: Math.round(tempMax),
      condition: mostCommonCondition,
      icon: mostCommonIcon.replace('n', 'd'), // Force day icons for daily view list
      rainProb: Math.round(maxPop * 100)
    };
  });

  // Calculate Rain Probability for current card (using average of first 3 hourly slots)
  const currentRainProb = hourly.length > 0
    ? Math.round(hourly.slice(0, 3).reduce((sum, h) => sum + h.rainProb, 0) / Math.min(hourly.length, 3))
    : 0;

  // Severe alerts generation based on metrics
  const alerts = [];
  const lowercaseCond = condition.toLowerCase();

  if (temp >= 40) {
    alerts.push({
      event: 'Extreme Heat Warning',
      description: 'Extremely high temperatures detected. Avoid direct sunlight and stay hydrated.',
      sender: 'National Weather Center',
      severity: 'Major'
    });
  } else if (temp <= 5) {
    alerts.push({
      event: 'Extreme Cold Warning',
      description: 'Extremely cold conditions. Wear warm clothing and check on vulnerable neighbors.',
      sender: 'National Weather Center',
      severity: 'Moderate'
    });
  }

  if (windSpeed >= 45) {
    alerts.push({
      event: 'High Wind Alert',
      description: 'Strong gusts of wind are occurring. Secure loose outdoor objects.',
      sender: 'Municipal Infrastructure Unit',
      severity: 'Major'
    });
  }

  if (lowercaseCond.includes('storm') || lowercaseCond.includes('thunder')) {
    alerts.push({
      event: 'Severe Thunderstorm Warning',
      description: 'Active lightning strikes and sudden gusts. Stay indoors and unplug electronic devices.',
      sender: 'Safety Operations Center',
      severity: 'Extreme'
    });
  } else if (lowercaseCond.includes('heavy') && (lowercaseCond.includes('rain') || lowercaseCond.includes('drizzle'))) {
    alerts.push({
      event: 'Heavy Rain Warning',
      description: 'Sustained heavy rainfall leading to localized street flooding.',
      sender: 'Disaster Management Board',
      severity: 'Major'
    });
  }

  // Generate Smart City Impact Recommendations
  const smartCityImpacts = [];

  // Rain impacts
  if (currentRainProb >= 50 || lowercaseCond.includes('rain') || lowercaseCond.includes('drizzle') || lowercaseCond.includes('storm')) {
    smartCityImpacts.push({
      type: 'Traffic Caution',
      message: 'Wet road surfaces. Standard speed limits reduced; Expect 15-20 min transit delays on Central Main Road.',
      icon: '🚗',
      color: 'amber'
    });
    smartCityImpacts.push({
      type: 'Garbage Collection',
      message: 'Possible delays in low-lying sector routes due to localized street runoff and flooding risks.',
      icon: '🗑️',
      color: 'blue'
    });

    if (lowercaseCond.includes('storm') || lowercaseCond.includes('heavy')) {
      smartCityImpacts.push({
        type: 'Underpass Alert',
        message: 'High risk of waterlogging. Avoid Sector 15 underpass and use elevated diversion routes.',
        icon: '⚠️',
        color: 'red'
      });
    }
  }

  // Wind impacts
  if (windSpeed >= 30) {
    smartCityImpacts.push({
      type: 'Infrastructure Caution',
      message: 'Strong gusts. Smart streetlights dynamically auto-stabilizing. Avoid standing near signage or large trees.',
      icon: '💡',
      color: 'amber'
    });
  }

  // Heat impacts
  if (temp >= 36) {
    smartCityImpacts.push({
      type: 'Grid Advisory',
      message: 'Peak power utilization alert. Air conditioning utility loads high; Grid health monitoring active.',
      icon: '⚡',
      color: 'amber'
    });
    smartCityImpacts.push({
      type: 'Outdoor Safety',
      message: 'Heat safety protocol activated. Public water hydration kiosks deployed in Central Park.',
      icon: '⛲',
      color: 'emerald'
    });
  }

  // Default fallback if no special conditions
  if (smartCityImpacts.length === 0) {
    smartCityImpacts.push({
      type: 'Optimal City Conditions',
      message: 'All municipal services operating under standard schedule. Excellent weather for city parks.',
      icon: '✅',
      color: 'emerald'
    });
  }

  return {
    cityName,
    coordinates: {
      lat: current.coord.lat,
      lon: current.coord.lon
    },
    current: {
      temp,
      feelsLike,
      condition,
      conditionDesc,
      icon,
      humidity,
      windSpeed,
      windDirection,
      pressure,
      visibility,
      sunrise,
      sunset,
      uvIndex,
      rainProb: currentRainProb
    },
    hourly,
    daily: dailyList.slice(0, 5), // Keep next 5 days
    alerts,
    smartCityImpacts
  };
}

module.exports = {
  getWeatherData
};
