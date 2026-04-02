import React from 'react';
import { View, Text } from 'react-native';
import { ShoppingBag, Utensils, Star, Zap, Sparkles } from 'lucide-react-native';

export default function SmartRecommendations({ recommendations }) {
  if (!recommendations) return null;

  const { shopping, localDelicacies, experienceScores } = recommendations;

  const ScoreBar = ({ label, score, colorClass }) => (
    <View className="mb-4">
      <View className="flex-row justify-between items-end mb-2">
        <Text className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</Text>
        <Text className="text-lg font-black text-white">{score}/10</Text>
      </View>
      <View className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
        <View 
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${(score / 10) * 100}%` }}
        />
      </View>
    </View>
  );

  return (
    <View className="space-y-6 mb-10">
      
      {/* Experience Metrics */}
      <View className="bg-gray-900/60 border border-gray-800 rounded-3xl p-6 shadow-xl mb-6">
        <View className="flex-row items-center gap-3 mb-8">
          <Zap size={24} color="#facc15" />
          <Text className="text-xl font-black text-white tracking-tight">Vibe Check</Text>
        </View>
        <View>
          <ScoreBar label="Nightlife" score={experienceScores?.nightlife || 5} colorClass="bg-purple-500" />
          <ScoreBar label="Culture" score={experienceScores?.culture || 5} colorClass="bg-blue-500" />
          <ScoreBar label="Relaxation" score={experienceScores?.relaxation || 5} colorClass="bg-teal-500" />
          <ScoreBar label="Adventure" score={experienceScores?.adventure || 5} colorClass="bg-orange-500" />
        </View>
      </View>

      {/* Shopping & Souvenirs */}
      {shopping && shopping.length > 0 && (
        <View className="bg-gray-900/60 border border-gray-800 rounded-3xl p-6 shadow-xl mb-6">
          <View className="flex-row items-center gap-3 mb-8">
            <ShoppingBag size={24} color="#f97316" />
            <Text className="text-xl font-black text-white tracking-tight">Smart Shopping Guide</Text>
          </View>
          <View className="space-y-4">
            {shopping.map((item, idx) => (
              <View key={idx} className="bg-black/40 p-4 rounded-2xl border border-gray-800/50 mb-4">
                <View className="flex-row items-center gap-2 mb-2">
                  <Star size={16} fill="#fb923c" color="#fb923c" />
                  <Text className="font-black text-orange-400 text-lg flex-1">{item.item}</Text>
                </View>
                <Text className="text-sm text-gray-400 font-medium leading-5">
                  {item.reason}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Local Delicacies */}
      {localDelicacies && localDelicacies.length > 0 && (
        <View className="bg-gray-900/60 border border-gray-800 rounded-3xl p-6 shadow-xl mb-6">
          <View className="flex-row items-center gap-3 mb-8">
            <Utensils size={24} color="#22c55e" />
            <Text className="text-xl font-black text-white tracking-tight">Must-Try Delicacies</Text>
          </View>
          <View className="space-y-4">
            {localDelicacies.map((food, idx) => (
              <View key={idx} className="bg-black/40 p-4 rounded-2xl border border-gray-800/50 mb-4">
                <View className="flex-row items-center gap-2 mb-2">
                  <Sparkles size={16} color="#4ade80" />
                  <Text className="font-black text-green-400 text-lg flex-1">{food.food}</Text>
                </View>
                <Text className="text-sm text-gray-400 font-medium leading-5">
                  {food.description}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

    </View>
  );
}
