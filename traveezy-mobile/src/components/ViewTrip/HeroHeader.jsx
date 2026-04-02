import React from 'react';
import { View, Text, Image } from 'react-native';
import { MapPin, Calendar, Wallet, Users } from 'lucide-react-native';

export default function HeroHeader({ trip }) {
  const locationName = trip?.userSelection?.location;
  const shortLocation = locationName?.split(',')[0] || 'Destination';

  return (
    <View className="w-full h-80 relative bg-gray-900 justify-end">
      {/* Background Image */}
      <Image 
        source={{ uri: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2070" }} 
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
      />
      {/* Dark Overlay for Text Legibility */}
      <View className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <View className="px-5 pb-8 z-10 w-full">
        <View className="bg-orange-500/90 self-start px-3 py-1 rounded-md mb-3">
          <Text className="text-white font-bold text-[10px] uppercase tracking-widest">
            Exclusive Destination
          </Text>
        </View>

        <Text className="text-4xl font-black text-white mb-1 shadow-lg shadow-black/50">
          {shortLocation}
        </Text>
        
        <View className="flex-row items-center mb-5 mt-1">
          <MapPin size={16} color="#f97316" />
          <Text className="text-gray-300 font-medium ml-1.5 text-base" numberOfLines={1}>
            {locationName}
          </Text>
        </View>
        
        {/* Badges */}
        <View className="flex-row flex-wrap gap-2">
          <View className="bg-black/60 px-4 py-2 border border-white/10 rounded-full flex-row items-center gap-1.5">
            <Calendar size={14} color="#fb923c" />
            <Text className="text-white text-xs font-medium">{trip?.userSelection?.totalDays} Days</Text>
          </View>
          <View className="bg-black/60 px-4 py-2 border border-white/10 rounded-full flex-row items-center gap-1.5">
            <Wallet size={14} color="#fb923c" />
            <Text className="text-white text-xs font-medium">{trip?.userSelection?.budget}</Text>
          </View>
          <View className="bg-black/60 px-4 py-2 border border-white/10 rounded-full flex-row items-center gap-1.5">
            <Users size={14} color="#fb923c" />
            <Text className="text-white text-xs font-medium">{trip?.userSelection?.traveler}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
