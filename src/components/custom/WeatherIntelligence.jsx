import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Cloud, Wind, Droplets, ThermometerSnowflake, AlertTriangle, CloudLightning } from 'lucide-react';
import { fetchWeatherData } from '../../api/getWeather';

function WeatherIntelligence({ location }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [unit, setUnit] = useState('C'); // 'C' or 'F'

  useEffect(() => {
    if (location) {
      fetchWeather();
    }
  }, [location]);

  const fetchWeather = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchWeatherData(location);
      setWeatherData(data);
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-5 bg-gray-900 rounded-2xl mt-10 border border-gray-800 animate-pulse h-40"></div>;
  if (error) return <div className="p-5 bg-gray-900/50 rounded-2xl mt-10 border border-gray-800 text-gray-400 text-center">Weather data unavailable for this location.</div>;
  if (!weatherData) return null;

  const current = weatherData.current;
  const tempC = current.temperature_2m;
  const tempF = (tempC * 9/5) + 32;
  const displayTemp = unit === 'C' ? tempC : tempF.toFixed(1);
  const tempUnit = unit === 'C' ? '°C' : '°F';

  // Get recommendations based on Open-Meteo weather codes and temps
  let recommendation = "Perfect weather for sightseeing!";
  let WeatherIcon = Sun;
  let iconColor = "text-yellow-500";
  let bgIconColor = "bg-yellow-500/20";
  
  if (tempC > 28) { 
    recommendation = "Hot weather: Bring sunscreen, hat, and stay hydrated."; 
    WeatherIcon = Sun; 
    iconColor = "text-orange-500"; 
  } else if (tempC < 10) { 
    recommendation = "Cold weather: Wear a heavy jacket and layer up."; 
    WeatherIcon = ThermometerSnowflake; 
    iconColor = "text-blue-400";
    bgIconColor = "bg-blue-400/20";
  }

  // Weather codes (WMO)
  // 51-67: Rain/Drizzle, 71-77: Snow, 95-99: Thunderstorm
  if (current.weather_code >= 51 && current.weather_code <= 67) {
    recommendation = "Rain expected: Carry an umbrella or raincoat.";
    WeatherIcon = CloudRain;
    iconColor = "text-blue-400";
    bgIconColor = "bg-blue-400/20";
  } else if (current.weather_code >= 95) {
    recommendation = "Thunderstorms likely. Seek indoor activities.";
    WeatherIcon = CloudLightning;
    iconColor = "text-purple-500";
    bgIconColor = "bg-purple-500/20";
  } else if (current.weather_code >= 1 && current.weather_code <= 3) {
    WeatherIcon = Cloud;
    iconColor = "text-gray-400";
    bgIconColor = "bg-gray-400/20";
    if (tempC > 15 && tempC <= 28) recommendation = "Mild overcast weather, comfortable for walking.";
  }

  return (
    <div className="mt-10">
      <h2 className="font-bold text-2xl mb-5 text-white">Weather Intelligence</h2>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl overflow-hidden relative">
        {/* Decorative background circle */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/5 rounded-full blur-2xl"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-full ${bgIconColor}`}>
              <WeatherIcon className={`${iconColor} w-10 h-10`} />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white">{displayTemp}{tempUnit}</h3>
              <p className="text-gray-400 capitalize">Current condition</p>
            </div>
          </div>
          <button 
            onClick={() => setUnit(unit === 'C' ? 'F' : 'C')} 
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm border border-gray-600 transition-colors text-white shadow-sm"
          >
            Switch to °{unit === 'C' ? 'F' : 'C'}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 relative z-10">
          <div className="bg-gray-800/80 p-3 rounded-xl flex items-center gap-3 border border-gray-700/50 hover:bg-gray-700 transition">
            <Droplets className="text-blue-400 w-5 h-5" />
            <div>
              <p className="text-xs text-gray-400">Humidity</p>
              <p className="font-medium text-white">{current.relative_humidity_2m}%</p>
            </div>
          </div>
          <div className="bg-gray-800/80 p-3 rounded-xl flex items-center gap-3 border border-gray-700/50 hover:bg-gray-700 transition">
            <Wind className="text-teal-400 w-5 h-5" />
            <div>
              <p className="text-xs text-gray-400">Wind</p>
              <p className="font-medium text-white">{current.wind_speed_10m} km/h</p>
            </div>
          </div>
          <div className="col-span-2 bg-orange-500/10 p-3 rounded-xl flex items-center gap-3 border border-orange-500/20">
            <AlertTriangle className="text-orange-500 w-5 h-5 shrink-0" />
            <div>
              <p className="text-xs text-orange-400/80">Travel Tip</p>
              <p className="font-medium text-orange-100 text-sm">{recommendation}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-700/50 pt-5 relative z-10">
          <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            7-Day Forecast Highlights
          </h4>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {weatherData.daily.time.map((time, idx) => {
              if (idx === 0) return null; // Skip current day to save space or show next 6 days
              
              const maxC = weatherData.daily.temperature_2m_max[idx];
              const minC = weatherData.daily.temperature_2m_min[idx];
              const dMax = unit === 'C' ? maxC : ((maxC * 9/5) + 32).toFixed(1);
              const dMin = unit === 'C' ? minC : ((minC * 9/5) + 32).toFixed(1);
              
              const date = new Date(time);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

              return (
                <div key={idx} className="bg-gray-800/50 p-3 rounded-xl min-w-[80px] text-center border border-gray-700/50 shrink-0 snap-start hover:bg-gray-700 transition">
                  <p className="text-xs text-gray-400 font-medium">{dayName}</p>
                  <p className="text-sm font-bold text-white mt-2">{dMax}°</p>
                  <p className="text-xs text-gray-500">{dMin}°</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherIntelligence;
