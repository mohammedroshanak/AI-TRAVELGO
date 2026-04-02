import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { MapPin, Navigation } from 'lucide-react-native';
import { detectCurrency, extractPriceValue, convertCurrency } from '../../utils/currency';

export default function HotelsList({ trip, baseCurrency, targetCurrency }) {
  const hotels = trip?.tripData?.hotelOptions;
  if (!hotels || hotels.length === 0) return null;

  const renderPrice = (originalPriceStr) => {
    if (!originalPriceStr) return <Text className="text-gray-400">N/A</Text>;
    
    if (!targetCurrency || targetCurrency === baseCurrency) {
      return <Text className="text-2xl font-bold text-orange-500">{originalPriceStr}</Text>;
    }

    const val = extractPriceValue(originalPriceStr);
    if (!val) return <Text className="text-2xl font-bold text-orange-500">{originalPriceStr}</Text>;

    const converted = convertCurrency(val, baseCurrency, targetCurrency);
    
    return (
      <View>
        <Text className="text-xl font-bold text-orange-400">{originalPriceStr}</Text>
        <View className="bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20 mt-1 self-start">
          <Text className="text-[10px] text-orange-200 font-bold">≈ {converted} {targetCurrency}</Text>
        </View>
      </View>
    );
  };

  const openGoogleMaps = (name, address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${name},${address}`;
    Linking.openURL(url);
  };

  return (
    <View className="mb-10 px-5">
      <View className="flex-row items-center gap-3 mb-6 pb-2 border-b-2 border-orange-500/20 self-start">
        <MapPin size={28} color="#f97316" />
        <Text className="font-bold text-3xl text-white">Premium Stays</Text>
      </View>

      {/* Horizontal Scroll for Hotels instead of a vertical list saves screen space on Mobile */}
      {/* Vertical List mimicking Web Layout */}
      <View className="gap-6 pb-4">
        {hotels.map((hotel, index) => (
          <TouchableOpacity 
            key={index} 
            activeOpacity={0.8}
            onPress={() => openGoogleMaps(hotel?.hotelName, hotel?.hotelAddress)}
            className="w-full bg-gray-900/50 border border-gray-800 rounded-3xl overflow-hidden shadow-xl"
          >
            {/* Image Section */}
            <View className="relative h-56 w-full">
              <Image 
                source={{ uri: hotel?.hotelImageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2070" }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <View className="absolute top-4 right-4 bg-black/60 px-3 py-1.5 rounded-lg flex-row items-center border border-white/10 shadow-lg">
                <Text className="text-yellow-500 font-bold text-xs mr-1">⭐</Text>
                <Text className="text-white font-bold text-sm">{hotel?.rating}</Text>
              </View>
            </View>

            {/* Details Section */}
            <View className="p-6 bg-gray-900/40">
              <Text className="font-bold text-xl mb-3 text-white">
                {hotel?.hotelName}
              </Text>
              <View className="flex-row items-start mb-6">
                <MapPin size={16} color="#6b7280" className="mt-0.5 mr-2" />
                <Text className="text-sm text-gray-400 leading-relaxed flex-1">
                  {hotel?.hotelAddress}
                </Text>
              </View>

              <View className="border-t border-gray-800/80 pt-5 flex-row justify-between items-end">
                <View>
                  <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Price per night</Text>
                  {renderPrice(hotel?.price)}
                </View>
                <View className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center">
                  <Navigation size={16} color="#9ca3af" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
