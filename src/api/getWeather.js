export const fetchWeatherData = async (location) => {
  try {
    // 1. Geocode location
    let geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`);
    let geoData = await geoRes.json();
    
    // Fallback: If no results, try splitting by comma and using the last 2 parts (usually City, Country)
    if (!geoData.results || geoData.results.length === 0) {
      const parts = location.split(',');
      if (parts.length > 1) {
        const fallbackQuery = parts.slice(-2).join(',').trim();
        console.log(`Weather geocode fallback for "${location}" -> "${fallbackQuery}"`);
        geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(fallbackQuery)}&count=1&language=en&format=json`);
        geoData = await geoRes.json();
      }
    }
    
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("Location not found for weather data.");
    }
    
    const { latitude, longitude } = geoData.results[0];
    
    // 2. Fetch weather using Open-Meteo
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
    const data = await weatherRes.json();
    
    return data;
  } catch (err) {
    console.error("Weather fetch error isolated in API layer:", err);
    throw err;
  }
};

