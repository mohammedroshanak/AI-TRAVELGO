import React from 'react';
import { View, Text } from 'react-native';
import { ShieldCheck, Star, Activity, Shield, Moon, UserCheck } from 'lucide-react-native';

export default function SafetyScore({ data }) {
  if (!data) return null;

  const { overall, factors } = data;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars.push(<Star key={i} size={20} fill="#eab308" color="#eab308" />);
        } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
            // Half star logic visually (simulated with lighter color for simplicity)
            stars.push(<Star key={i} size={20} fill="#fef08a" color="#eab308" />);
        } else {
            stars.push(<Star key={i} size={20} color="#374151" />);
        }
    }
    return stars;
  };

  const factorConfigs = [
    { label: 'Crime Level', value: factors?.crime, icon: <Shield size={16} color="#9ca3af" /> },
    { label: 'Travel Safety', value: factors?.travel, icon: <Activity size={16} color="#9ca3af" /> },
    { label: 'Women Safety', value: factors?.women, icon: <UserCheck size={16} color="#9ca3af" /> },
    { label: 'Night Safety', value: factors?.night, icon: <Moon size={16} color="#9ca3af" /> },
  ];

  const getFactorColor = (val) => {
    if (val >= 4) return 'bg-emerald-500';
    if (val >= 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <View className="p-6 rounded-3xl border border-blue-500/20 bg-blue-900/10 shadow-xl mb-6">
      
      <View className="flex-row items-center gap-3 mb-6">
        <View className="w-12 h-12 bg-emerald-500/10 rounded-xl items-center justify-center border border-emerald-500/20">
          <ShieldCheck size={28} color="#10b981" />
        </View>
        <View>
           <Text className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 mb-0.5">Intelligence Signal</Text>
           <Text className="text-xl font-black text-white">AI Safety Score</Text>
        </View>
      </View>

      <View className="flex-row items-center gap-4 mb-8 bg-black/40 p-4 rounded-xl border border-white/5">
        <Text className="text-4xl font-black text-white">{overall || '4.0'}</Text>
        <View className="flex-col gap-1">
          <View className="flex-row gap-1">
            {renderStars(overall || 4)}
          </View>
          <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Global Safety Rating</Text>
        </View>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {factorConfigs.map((factor, index) => (
          <View key={index} className="w-[48%] space-y-2 p-3 bg-white/5 rounded-xl border border-white/5 mb-3">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-1.5 flex-1 pr-1">
                {factor.icon}
                <Text className="text-[10px] font-bold text-gray-400" numberOfLines={1}>{factor.label}</Text>
              </View>
              <Text className="text-xs font-black text-white">{factor.value || '4.0'}</Text>
            </View>
            <View className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
               <View 
                 className={`h-full ${getFactorColor(factor.value)}`}
                 style={{ width: `${(factor.value / 5) * 100}%` }}
               />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
