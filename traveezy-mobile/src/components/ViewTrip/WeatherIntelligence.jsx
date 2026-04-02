import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { CloudRain, Sun, Cloud, Wind, Droplets, ThermometerSnowflake, AlertTriangle, CloudLightning } from 'lucide-react-native';
import { fetchWeatherData } from '../../../../src/api/getWeather';

export default function WeatherIntelligence({ location }) {
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

  if (loading) return (
    <View className="p-5 bg-gray-900 rounded-3xl mt-6 border border-gray-800 h-40 justify-center items-center">
      <ActivityIndicator size="small" color="#f97316" />
    </View>
  );

  if (error) return (
    <View className="p-5 bg-gray-900/50 rounded-3xl mt-6 border border-gray-800 justify-center items-center">
      <Text className="text-gray-400 text-center">Weather data unavailable.</Text>
    </View>
  );

  if (!weatherData) return null;

  const current = weatherData.current;
  const tempC = current.temperature_2m;
  const tempF = (tempC * 9/5) + 32;
  const displayTemp = unit === 'C' ? tempC : tempF.toFixed(1);
  const tempUnit = unit === 'C' ? '°C' : '°F';

  let recommendation = "Perfect weather for sightseeing!";
  let WeatherIcon = Sun;
  let iconColor = "#eab308"; // text-yellow-500
  let bgIconClass = "bg-yellow-500/20";
  
  if (tempC > 28) { 
    recommendation = "Hot weather: Bring sunscreen, hat, and stay hydrated."; 
    WeatherIcon = Sun; 
    iconColor = "#f97316"; 
    bgIconClass = "bg-orange-500/20";
  } else if (tempC < 10) { 
    recommendation = "Cold weather: Wear a heavy jacket and layer up."; 
    WeatherIcon = ThermometerSnowflake; 
    iconColor = "#60a5fa";
    bgIconClass = "bg-blue-400/20";
  }

  if (current.weather_code >= 51 && current.weather_code <= 67) {
    recommendation = "Rain expected: Carry an umbrella or raincoat.";
    WeatherIcon = CloudRain;
    iconColor = "#60a5fa";
    bgIconClass = "bg-blue-400/20";
  } else if (current.weather_code >= 95) {
    recommendation = "Thunderstorms likely. Seek indoor activities.";
    WeatherIcon = CloudLightning;
    iconColor = "#a855f7";
    bgIconClass = "bg-purple-500/20";
  } else if (current.weather_code >= 1 && current.weather_code <= 3) {
    WeatherIcon = Cloud;
    iconColor = "#9ca3af";
    bgIconClass = "bg-gray-400/20";
    if (tempC > 15 && tempC <= 28) recommendation = "Mild overcast weather, comfortable for walking.";
  }

  return (
    <View className="mt-8 mb-2">
      <Text className="font-bold text-2xl mb-4 text-white">Weather Intelligence</Text>
      
      <View className="bg-gray-900 border border-gray-700 p-6 rounded-3xl overflow-hidden shadow-xl">
        <View className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl opacity-50" />
        
        <View className="flex-row justify-between items-start">
          <View className="flex-row items-center flex-1 pr-4">
            <View className={`w-14 h-14 rounded-2xl items-center justify-center mr-4 ${bgIconClass}`}>
              <WeatherIcon size={32} color={iconColor} />
            </View>
            <View>
              <Text className="text-gray-400 font-medium text-sm mb-1 uppercase tracking-wider">Currently</Text>
              <View className="flex-row items-end">
                <Text className="text-4xl font-black text-white">{displayTemp}</Text>
                <Text className="text-xl font-bold text-gray-500 mb-1 ml-1">{tempUnit}</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={() => setUnit(unit === 'C' ? 'F' : 'C')}
            className="bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700 active:opacity-75"
          >
            <Text className="text-gray-300 font-bold text-xs">{unit === 'C' ? '°F' : '°C'}</Text>
          </TouchableOpacity>
        </View>
        
        <View className="flex-row justify-between mt-8 p-4 bg-black/40 rounded-2xl border border-gray-800">
          <View className="items-center">
            <Wind size={16} color="#9ca3af" className="mb-2" />
            <Text className="text-white font-bold">{current.wind_speed_10m} <Text className="text-xs text-gray-500 font-normal">km/h</Text></Text>
          </View>
          <View className="w-[1px] h-full bg-gray-800" />
          <View className="items-center">
            <Droplets size={16} color="#60a5fa" className="mb-2" />
            <Text className="text-white font-bold">{current.relative_humidity_2m}<Text className="text-xs text-gray-500 font-normal">%</Text></Text>
          </View>
          <View className="w-[1px] h-full bg-gray-800" />
          <View className="items-center">
            <CloudRain size={16} color="#38bdf8" className="mb-2" />
            <Text className="text-white font-bold">{current.precipitation} <Text className="text-xs text-gray-500 font-normal">mm</Text></Text>
          </View>
        </View>

        <View className="mt-5 flex-row items-center gap-3 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
          <AlertTriangle size={20} color="#60a5fa" />
          <Text className="flex-1 text-blue-200 text-sm font-medium leading-5">{recommendation}</Text>
        </View>
      </View>
    </View>
  );
}
