// Reusable logic extracted for both Web and Mobile
export const getWeather = async (location) => {
  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`);
    const geoData = await geoRes.json();
    
    if (!geoData.results || geoData.results.length === 0) return null;
    
    const { latitude, longitude } = geoData.results[0];
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
    
    return await weatherRes.json();
  } catch (error) {
    console.error('Weather fetching error:', error);
    return null;
  }
};
