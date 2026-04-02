import React from 'react';
import { View, Text, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { Utensils, Star, Soup, ChefHat, MapPin, Coffee, Pizza, Cake, Navigation } from 'lucide-react-native';

export default function FoodExplorer({ data }) {
  if (!data) return null;

  const { mustTry, recommendedRestaurants } = data;

  const getFoodIcon = (index) => {
    const icons = [
      <Soup size={18} color="#f97316" />, 
      <Pizza size={18} color="#f97316" />, 
      <Cake size={18} color="#f97316" />, 
      <Coffee size={18} color="#f97316" />
    ];
    return icons[index % icons.length];
  };

  const openGoogleMaps = (name) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${name}`;
    Linking.openURL(url);
  };

  return (
    <View className="mb-10">
      
      {/* Must Try Foods */}
      {mustTry && mustTry.length > 0 && (
        <View className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-6 mb-8">
          <View className="flex-row items-center gap-3 mb-6">
            <View className="w-12 h-12 bg-orange-500/20 rounded-xl items-center justify-center border border-orange-500/30">
              <Utensils size={24} color="#f97316" />
            </View>
            <Text className="text-xl font-black text-white flex-1 flex-wrap">Local Delicacies Recommender</Text>
          </View>

          <View className="flex-row flex-wrap gap-2">
            {mustTry.map((food, i) => (
              <View key={i} className="flex-row items-center gap-2 px-3 py-2.5 bg-gray-900/90 border border-gray-800 rounded-xl">
                 {getFoodIcon(i)}
                 <Text className="text-sm font-bold text-gray-200">{food}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Recommended Restaurants (Horizontal Scroll on Mobile) */}
      {recommendedRestaurants && recommendedRestaurants.length > 0 && (
        <View>
          <View className="flex-row items-center gap-3 mb-6">
             <View className="w-12 h-12 bg-yellow-500/10 rounded-xl items-center justify-center border border-yellow-500/20">
               <ChefHat size={24} color="#eab308" />
             </View>
             <Text className="text-xl font-black text-white flex-1 flex-wrap">Recommended Restaurants</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible pb-4">
            {recommendedRestaurants.map((res, i) => (
              <TouchableOpacity 
                key={i} 
                activeOpacity={0.8}
                onPress={() => openGoogleMaps(res.name)}
                className="bg-gray-900/60 border border-gray-800 rounded-3xl p-5 w-72 mr-4 shadow-xl"
              >
                 <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-1 pr-2">
                       <Text className="font-black text-xl text-white mb-1" numberOfLines={1}>{res.name}</Text>
                       <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-4">{res.cuisine}</Text>
                    </View>
                    <View className="flex-row items-center gap-1 bg-yellow-500/10 px-2 py-1.5 rounded-lg border border-yellow-500/20">
                       <Star size={12} fill="#eab308" color="#eab308" />
                       <Text className="text-xs font-black text-yellow-500">{res.rating}</Text>
                    </View>
                 </View>

                 <View className="pt-4 mt-auto border-t border-gray-800 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-1.5">
                      <MapPin size={12} color="#4b5563" /> 
                      <Text className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Top Rated</Text>
                    </View>
                    <View className="w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/20 items-center justify-center">
                       <Navigation size={14} color="#eab308" />
                    </View>
                 </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
