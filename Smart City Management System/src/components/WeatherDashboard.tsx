import React, { useState, useEffect } from 'react';

interface WeatherData {
  cityName: string;
  coordinates: { lat: number; lon: number };
  current: {
    temp: number;
    feelsLike: number;
    condition: string;
    conditionDesc: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    pressure: number;
    visibility: string;
    sunrise: number;
    sunset: number;
    uvIndex: number;
    rainProb: number;
  };
  hourly: Array<{
    time: string;
    temp: number;
    condition: string;
    icon: string;
    rainProb: number;
    windSpeed: number;
  }>;
  daily: Array<{
    day: string;
    date: string;
    tempMin: number;
    tempMax: number;
    condition: string;
    icon: string;
    rainProb: number;
  }>;
  alerts: Array<{
    event: string;
    description: string;
    sender: string;
    severity: string;
  }>;
  smartCityImpacts: Array<{
    type: string;
    message: string;
    icon: string;
    color: 'red' | 'amber' | 'blue' | 'emerald';
  }>;
}

export default function WeatherDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load weather for default city (Jalandhar) on mount
  useEffect(() => {
    fetchWeather({ city: 'Jalandhar' });
  }, []);

  const fetchWeather = async (params: { city?: string; lat?: number; lon?: number }) => {
    setLoading(true);
    setError(null);
    try {
      let url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`/api/weather';
      if (params.lat !== undefined && params.lon !== undefined) {
        url += `?lat=${params.lat}&lon=${params.lon}`;
      } else if (params.city) {
        url += `?city=${encodeURIComponent(params.city)}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to fetch weather data.');
      }

      setWeatherData(result.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to connect to the weather service.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeather({ city: searchQuery.trim() });
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (err) => {
        console.error(err);
        if (err.code === 1) {
          setError('Location permission was denied. Search for a city instead.');
        } else {
          setError('Location service is currently unavailable.');
        }
        setLoading(false);
      }
    );
  };

  const handleRefresh = () => {
    if (weatherData) {
      setIsRefreshing(true);
      fetchWeather({ city: weatherData.cityName });
    }
  };

  // Helper formatting for Sunrise/Sunset
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // UI Colors helper mapping for impact severity
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red':
        return {
          bg: 'bg-rose-500/10 border-rose-500/20',
          text: 'text-rose-400',
          bullet: 'bg-rose-500'
        };
      case 'amber':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20',
          text: 'text-amber-400',
          bullet: 'bg-amber-500'
        };
      case 'blue':
        return {
          bg: 'bg-sky-500/10 border-sky-500/20',
          text: 'text-sky-400',
          bullet: 'bg-sky-500'
        };
      case 'emerald':
      default:
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20',
          text: 'text-emerald-400',
          bullet: 'bg-emerald-500'
        };
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12">
      
      {/* Header section with controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight md:text-3xl" style={{ fontFamily: "'Sora', sans-serif" }}>
            Weather & Meteorological Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time local tracking and smart municipal services guidance</p>
        </div>
        
        {/* Refresh + My Location controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white rounded-xl cursor-pointer transition-all duration-200 disabled:opacity-40"
            title="Refresh current weather data"
          >
            <svg className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
            </svg>
          </button>
          
          <button
            onClick={handleUseMyLocation}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#00b894]/10 hover:bg-[#00b894]/20 border border-[#00b894]/30 text-[#00b894] text-sm font-semibold rounded-xl cursor-pointer transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Use My Location
          </button>
        </div>
      </div>

      {/* City Search Bar Component */}
      <form onSubmit={handleSearchSubmit} className="max-w-xl flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter city name... (e.g. Jalandhar, Delhi, Mumbai)"
            className="w-full px-5 py-3 pl-11 rounded-xl outline-none text-white text-sm bg-slate-800/40 border border-slate-800 focus:border-[#00b894] transition-all duration-200"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
          <svg className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 bg-[#00b894] hover:bg-[#00a381] text-white text-sm font-semibold rounded-xl border-none cursor-pointer transition-colors duration-200 disabled:opacity-50"
        >
          Search
        </button>
      </form>

      {/* Error Alert Display */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex items-start gap-3 text-rose-300">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h4 className="text-sm font-bold text-white">Weather Retrieval Alert</h4>
            <p className="text-xs text-rose-300/90 mt-0.5 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        /* ==================== SKELETON LOADER STATE ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 animate-pulse">
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <div className="h-64 bg-slate-800/30 rounded-3xl border border-slate-800" />
            <div className="h-44 bg-slate-800/30 rounded-3xl border border-slate-800" />
            <div className="h-60 bg-slate-800/30 rounded-3xl border border-slate-800" />
          </div>
          <div className="space-y-6 md:space-y-8">
            <div className="h-56 bg-slate-800/30 rounded-3xl border border-slate-800" />
            <div className="h-96 bg-slate-800/30 rounded-3xl border border-slate-800" />
          </div>
        </div>
      ) : weatherData ? (
        /* ==================== ACTIVE WEATHER PAGE DATA ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Main left column: Weather Details & Forecasts */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            
            {/* Primary Current Weather Card */}
            <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#00b894] to-[#42a5f5]" />
              
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#00b894] bg-[#00b894]/10 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                  Current Conditions
                </span>
                <h2 className="text-3xl font-extrabold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {weatherData.cityName}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-black text-white">{weatherData.current.temp}°C</div>
                  <div className="text-slate-400 border-l border-slate-800 pl-4 py-1">
                    <p className="text-sm font-semibold text-white capitalize">{weatherData.current.conditionDesc}</p>
                    <p className="text-xs">Feels like {weatherData.current.feelsLike}°C</p>
                  </div>
                </div>
              </div>

              {/* Icon & quick metrics */}
              <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-slate-800/60 pt-4 md:pt-0">
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData.current.icon}@4x.png`}
                  alt={weatherData.current.condition}
                  className="w-24 h-24 -my-4 object-contain"
                />
                <div className="text-right text-xs text-slate-400 space-y-1">
                  <div>Humidity: <span className="text-white font-semibold">{weatherData.current.humidity}%</span></div>
                  <div>Wind: <span className="text-white font-semibold">{weatherData.current.windSpeed} km/h {weatherData.current.windDirection}</span></div>
                  <div>Precipitation: <span className="text-white font-semibold">{weatherData.current.rainProb}%</span></div>
                </div>
              </div>
            </div>

            {/* Weather Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Atmospheric Pressure', value: `${weatherData.current.pressure} hPa`, desc: 'Standard sea-level', icon: '⏲️' },
                { label: 'Visibility Range', value: `${weatherData.current.visibility} km`, desc: 'Optical air clearance', icon: '👁️' },
                { label: 'UV Radiance Index', value: weatherData.current.uvIndex, desc: 'Solar radiation level', icon: '☀️' },
                { label: 'Sunset Projection', value: formatTime(weatherData.current.sunset), desc: `Sunrise: ${formatTime(weatherData.current.sunrise)}`, icon: '🌇' }
              ].map((stat, i) => (
                <div key={i} className="bg-[#0a1626]/80 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{stat.label}</span>
                    <span className="text-lg">{stat.icon}</span>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{stat.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hourly Forecast (Horizontal scroll) */}
            <div className="glass-card rounded-3xl p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">Hourly Forecast</h3>
                <p className="text-xs text-slate-500">24-hour meteorological window projection</p>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {weatherData.hourly.map((hour, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 w-24 bg-[#050f1d]/50 hover:bg-[#071526]/50 border border-slate-800/80 hover:border-[#00b894]/20 rounded-2xl p-3 flex flex-col items-center justify-between text-center transition-all duration-200"
                  >
                    <span className="text-[11px] text-slate-400 font-semibold">{hour.time}</span>
                    <img
                      src={`https://openweathermap.org/img/wn/${hour.icon}@2x.png`}
                      alt={hour.condition}
                      className="w-12 h-12 my-1.5"
                    />
                    <span className="text-sm font-bold text-white">{hour.temp}°C</span>
                    <div className="w-full mt-2 pt-2 border-t border-slate-800/40 text-[9px] text-slate-500 space-y-0.5">
                      <div className="flex justify-between">
                        <span>🌧️</span>
                        <span className="text-blue-400 font-semibold">{hour.rainProb}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>💨</span>
                        <span className="text-slate-400">{hour.windSpeed}k</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5-Day Extended Daily Forecast */}
            <div className="glass-card rounded-3xl p-6">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-white">5-Day Extended Forecast</h3>
                <p className="text-xs text-slate-500">Long-range atmospheric modeling and temperature range</p>
              </div>

              <div className="space-y-3">
                {weatherData.daily.map((day, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-[#050f1d]/30 border border-slate-800/60 rounded-2xl hover:border-slate-800 transition-colors"
                  >
                    {/* Day name & date */}
                    <div className="w-24">
                      <div className="text-sm font-bold text-white">{day.day}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{day.date}</div>
                    </div>

                    {/* Weather condition */}
                    <div className="flex items-center gap-2.5 flex-1 pl-4 md:pl-8">
                      <img
                        src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                        alt={day.condition}
                        className="w-8 h-8"
                      />
                      <span className="text-xs font-medium text-slate-300 capitalize hidden sm:inline">{day.condition}</span>
                    </div>

                    {/* Rain probability */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 w-20 justify-center">
                      <span>🌧️</span>
                      <span>{day.rainProb}%</span>
                    </div>

                    {/* Temperature range */}
                    <div className="flex items-center gap-3 text-right w-24 justify-end">
                      <span className="text-xs font-medium text-slate-500">{day.tempMin}°C</span>
                      <span className="text-sm font-bold text-white">{day.tempMax}°C</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right column: Smart City Integration & Alerts */}
          <div className="space-y-6 md:space-y-8">
            
            {/* Smart City Impact Warning Section */}
            <div className="bg-[#0a1626]/80 rounded-3xl p-6 border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#42a5f5] to-transparent" />
              <div className="mb-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🤖</span> Smart City Weather Impact
                </h3>
                <p className="text-xs text-slate-500">Autonomous civic guidance recommendations (Official warnings not implied)</p>
              </div>

              <div className="space-y-4">
                {weatherData.smartCityImpacts.map((impact, i) => {
                  const style = getColorClasses(impact.color);
                  return (
                    <div key={i} className={`p-4 border rounded-2xl flex gap-3.5 transition-all duration-200 ${style.bg}`}>
                      <span className="text-2xl mt-0.5">{impact.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className={`text-xs font-bold block ${style.text}`}>{impact.type}</span>
                        <p className="text-xs text-slate-300/90 leading-relaxed mt-1">{impact.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Severe Weather Alerts */}
            <div className="bg-[#0a1626]/80 rounded-3xl p-6 border border-slate-800">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2">
                  <span>📢</span> Meteorological Alerts
                </h3>
                <p className="text-xs text-slate-500">Severe weather warnings in local district</p>
              </div>

              {weatherData.alerts.length > 0 ? (
                <div className="space-y-4">
                  {weatherData.alerts.map((alert, i) => (
                    <div key={i} className="p-4 bg-rose-500/5 hover:bg-rose-500/8 border border-rose-500/10 rounded-2xl">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-xs font-bold text-white">{alert.event}</h4>
                        <span className="text-[9px] bg-rose-500/20 text-rose-400 font-mono font-bold px-2 py-0.5 rounded-full border border-rose-500/25">
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">{alert.description}</p>
                      <div className="text-[9px] text-slate-500 mt-2 flex justify-between border-t border-slate-800/40 pt-1.5">
                        <span>Issued by: {alert.sender}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-800/10 rounded-2xl border border-slate-800/50">
                  <span className="text-3xl">🛡️</span>
                  <h4 className="text-sm font-bold text-white mt-3">No Active Weather Alerts</h4>
                  <p className="text-[11px] text-slate-500 mt-1 px-4 leading-normal">
                    Local air columns are stable. No active alerts or severe advisories.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
      ) : (
        /* ==================== EMPTY STATE ==================== */
        <div className="text-center py-20 bg-[#0a1626]/80 rounded-3xl border border-slate-800">
          <span className="text-4xl">🌦️</span>
          <h2 className="text-xl font-bold text-white mt-4">No Weather Data Loaded</h2>
          <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">
            Please search for a city above or use your location to fetch realtime weather data.
          </p>
        </div>
      )}

    </div>
  );
}
