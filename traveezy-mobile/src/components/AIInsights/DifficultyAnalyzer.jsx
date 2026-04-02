import React from 'react';
import { View, Text } from 'react-native';
import { Star, Info, Activity } from 'lucide-react-native';

const DifficultyAnalyzer = ({ destination, duration }) => {
  const detectDifficulty = (dest) => {
    const destLower = (dest || '').toLowerCase();

    const easyKws = ['thailand', 'singapore', 'dubai', 'bali', 'malaysia', 'turkey', 'vietnam'];
    const mediumKws = ['kerala', 'goa', 'india', 'mexico', 'costa rica', 'colombia'];
    const hardKws = ['nepal', 'indonesia', 'africa', 'central asia', 'afghanistan', 'pakistan'];

    if (easyKws.some(kw => destLower.includes(kw))) {
      return {
        level: 'EASY',
        score: 1.5,
        recommendation: "Excellent destination for first-time or solo travelers. Well-established infrastructure and tourist-friendly environment.",
        factors: [
          { name: 'Language Barrier', level: 'Low', color: 'green', desc: 'English widely spoken' },
          { name: 'Infrastructure', level: 'Excellent', color: 'green', desc: 'Modern transport available' },
          { name: 'Visa Req', level: 'Easy', color: 'green', desc: 'Not needed or Visa on Arrival' },
          { name: 'Tourist Friendly', level: 'Very Yes', color: 'green', desc: 'Safe for tourists' }
        ],
        type: 'Perfect for beginners'
      };
    }

    if (hardKws.some(kw => destLower.includes(kw))) {
      return {
        level: 'HARD',
        score: 4.5,
        recommendation: "Requires significant travel experience. Limited tourist infrastructure and language barriers expected.",
        factors: [
          { name: 'Language Barrier', level: 'High', color: 'red', desc: 'Local dialect essential' },
          { name: 'Infrastructure', level: 'Basic', color: 'red', desc: 'Limited public utilities' },
          { name: 'Visa Req', level: 'Complex', color: 'red', desc: 'Advance embassy visits required' },
          { name: 'Tourist Friendly', level: 'Limited', color: 'red', desc: 'Less established trails' }
        ],
        type: 'Adventurous travelers only'
      };
    }

    // Default to MEDIUM
    return {
      level: 'MEDIUM',
      score: 3,
      recommendation: "Good for experienced travelers. Infrastructure is developed but requires some local knowledge to navigate.",
      factors: [
        { name: 'Language Barrier', level: 'Medium', color: 'yellow', desc: 'English in tourist hubs only' },
        { name: 'Infrastructure', level: 'Good', color: 'yellow', desc: 'Varying transport standards' },
        { name: 'Visa Req', level: 'Moderate', color: 'yellow', desc: 'Online application / E-Visa' },
        { name: 'Tourist Friendly', level: 'Moderately', color: 'yellow', desc: 'Requires some local knowledge' }
      ],
      type: 'Experienced travelers'
    };
  };

  const difficulty = detectDifficulty(destination);
  const stars = Math.round(difficulty.score);

  return (
    <View className="bg-gray-900/40 p-6 rounded-3xl border border-gray-800 shadow-xl mb-10 mt-2">
      <View className="flex-row items-center justify-between mb-8">
        <View className="flex-row items-center gap-2">
          <Activity size={24} color="#a855f7" />
          <Text className="text-xl font-black text-white px-2">Difficulty Analyzer</Text>
        </View>
        
        <View className="bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700 items-center justify-center">
          <View className="flex-row mb-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={12}
                fill={i < stars ? '#eab308' : 'transparent'} 
                color={i < stars ? '#eab308' : '#4b5563'} 
              />
            ))}
          </View>
          <Text className="text-[10px] font-bold text-gray-400 tracking-widest">{difficulty.level}</Text>
        </View>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {difficulty.factors.map((factor, idx) => {
          const isGreen = factor.color === 'green';
          const isYellow = factor.color === 'yellow';
          const bgColor = isGreen ? 'bg-emerald-500/10' : isYellow ? 'bg-yellow-500/10' : 'bg-red-500/10';
          const borderColor = isGreen ? 'border-emerald-500/30' : isYellow ? 'border-yellow-500/30' : 'border-red-500/30';
          const dotColor = isGreen ? '#10b981' : isYellow ? '#eab308' : '#ef4444';

          return (
            <View 
              key={idx} 
              className={`w-[48%] p-3 rounded-xl border-l-4 mb-3 ${bgColor} ${borderColor}`}
            >
              <View className="flex-row items-center gap-2 mb-1">
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: dotColor }} />
                <Text className="font-bold text-white text-[10px] uppercase tracking-wider" numberOfLines={1}>{factor.name}</Text>
              </View>
              <Text className="text-xs font-black text-gray-300 mb-1">{factor.level}</Text>
              <Text className="text-[10px] text-gray-500 leading-4">{factor.desc}</Text>
            </View>
          );
        })}
      </View>

      <View className="mt-6 bg-black/40 p-4 rounded-2xl border border-gray-800 relative overflow-hidden">
        <View className="absolute top-2 right-2 opacity-10">
           <Info size={40} color="#a855f7" />
        </View>
        <Text className="text-orange-500 font-bold text-xs mb-1 uppercase tracking-widest">Recommendation:</Text>
        <Text className="text-sm text-gray-300 font-medium leading-5 mb-4 z-10">
          {difficulty.recommendation}
        </Text>

        <View className="flex-row flex-wrap gap-2 z-10">
          <View className="bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-full">
            <Text className="text-[10px] font-black uppercase text-gray-400 tracking-wider">🎯 {difficulty.type}</Text>
          </View>
          <View className="bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-full">
            <Text className="text-[10px] font-black uppercase text-gray-400 tracking-wider">⏳ {duration || '?'} Trip</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DifficultyAnalyzer;
