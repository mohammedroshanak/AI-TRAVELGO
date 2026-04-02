import React from 'react';
import { View, Text } from 'react-native';
import { Users, Info, Flame, Trees } from 'lucide-react-native';

export default function CrowdPredictor({ data }) {
  if (!data) return null;

  const { level, description } = data;

  const getStatusConfig = (lvl) => {
    switch (lvl?.toLowerCase()) {
      case 'low':
        return {
          icon: <Trees size={24} color="#34d399" />, // emerald-400
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/20',
          textColor: 'text-emerald-400',
          label: 'Low Crowd',
          indicator: '🟢'
        };
      case 'high':
        return {
          icon: <Flame size={24} color="#f87171" />, // red-400
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
          textColor: 'text-red-400',
          label: 'High Crowd',
          indicator: '🔴'
        };
      case 'medium':
      default:
        return {
          icon: <Users size={24} color="#facc15" />, // yellow-400
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20',
          textColor: 'text-yellow-400',
          label: 'Medium Crowd',
          indicator: '🟡'
        };
    }
  };

  const config = getStatusConfig(level);

  return (
    <View className={`p-6 rounded-3xl border ${config.borderColor} ${config.bgColor} shadow-xl mb-6`}>
      <View className="flex-row items-start justify-between mb-4">
        <View className="flex-row items-center flex-1 pr-2">
          <View className="p-3 bg-gray-900/60 rounded-xl mr-3">
            {config.icon}
          </View>
          <View className="flex-1">
            <Text className="font-black uppercase tracking-widest text-[10px] text-gray-400 mb-1">AI Crowd Prediction</Text>
            <Text className={`text-xl font-black ${config.textColor}`}>{config.indicator} {config.label}</Text>
          </View>
        </View>
        <View className="p-2 bg-white/5 rounded-full">
          <Info size={16} color="#6b7280" />
        </View>
      </View>
      
      <Text className="text-sm font-medium text-gray-300 leading-5 border-t border-white/5 pt-4">
        {description || "Our AI analysis suggests optimal times to visit to avoid major tourist peaks."}
      </Text>

      <View className="mt-5 flex-row gap-2 flex-wrap">
        <View className="bg-white/5 px-2 py-1 rounded-md border border-white/10">
          <Text className="text-[10px] font-bold text-gray-400 tracking-wider">SEASONAL TRENDS</Text>
        </View>
        <View className="bg-white/5 px-2 py-1 rounded-md border border-white/10">
          <Text className="text-[10px] font-bold text-gray-400 tracking-wider">LIVE ANALYSIS</Text>
        </View>
      </View>
    </View>
  );
}
