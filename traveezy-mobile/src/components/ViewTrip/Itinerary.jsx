import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { Map, MapPin, Clock, Banknote, Navigation } from 'lucide-react-native';
import { detectCurrency, extractPriceValue, convertCurrency } from '../../utils/currency';

export default function Itinerary({ trip, baseCurrency, targetCurrency }) {
  const itinerary = trip?.tripData?.itinerary;
  if (!itinerary || itinerary.length === 0) return null;

  const renderPrice = (originalPriceStr) => {
    if (!originalPriceStr || originalPriceStr === "Free") return <Text className="text-green-400 font-bold">Free Admission</Text>;
    
    // If no target currency or it's the same, show as is
    if (!targetCurrency || targetCurrency === baseCurrency) {
      return <Text className="text-orange-500 font-bold">{originalPriceStr}</Text>;
    }

    const val = extractPriceValue(originalPriceStr);
    if (!val) return <Text className="text-orange-500 font-bold">{originalPriceStr}</Text>;

    const converted = convertCurrency(val, baseCurrency, targetCurrency);
    
    return (
      <View>
        <Text className="text-orange-500 font-bold">{originalPriceStr}</Text>
        <View className="bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20 mt-1 self-start">
          <Text className="text-[10px] text-orange-200 font-bold">≈ {converted} {targetCurrency}</Text>
        </View>
      </View>
    );
  };

  const openGoogleMaps = (name) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${name}`;
    Linking.openURL(url);
  };

  return (
    <View className="mt-6 mb-16 px-5">
      <View className="flex-row items-center gap-3 mb-8 pb-2 border-b-2 border-orange-500/20 self-start">
        <Map size={28} color="#f97316" />
        <Text className="font-bold text-3xl text-white">Daily Journey</Text>
      </View>

      <View className="space-y-12">
        {itinerary.map((item, index) => (
          <View key={index} className="relative pl-8">
            {/* Glowing vertical timeline line */}
            <View className="absolute left-0 top-4 bottom-[-40px] w-1 bg-orange-500/50 rounded-full" />
            
            {/* Timeline Dot */}
            <View className="absolute -left-2 top-5 w-5 h-5 rounded-full bg-orange-500 border-4 border-black z-10 shadow-[0_0_10px_rgba(249,115,22,0.8)]" />

            {/* Day Header */}
            <View className="bg-gray-900/80 self-start px-6 py-2.5 rounded-2xl border border-gray-700 mb-8 shadow-lg">
              <Text className="text-orange-500 font-bold text-xl tracking-widest">{item.day}</Text>
            </View>

            {/* Places Grid */}
            <View className="gap-8">
              {item.plan?.map((place, idx) => (
                <TouchableOpacity 
                  key={idx}
                  activeOpacity={0.8}
                  onPress={() => openGoogleMaps(place.placeName)}
                  className="bg-gray-900/60 border border-gray-800 rounded-3xl overflow-hidden shadow-xl"
                >
                  {/* Image */}
                  <Image 
                    source={{ uri: place.placeImageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070" }}
                    className="w-full h-56"
                    resizeMode="cover"
                  />
                  
                  {/* Details */}
                  <View className="p-6">
                    <Text className="font-bold text-2xl text-white mb-2">{place.placeName}</Text>
                    <Text className="text-sm text-gray-400 mb-6 leading-relaxed">{place.placeDetails}</Text>
                    
                    {/* Metadata Badges */}
                    <View className="flex-row gap-x-3 gap-y-3 flex-wrap mt-auto">
                      <View className="flex-row items-center bg-black/40 px-3 py-2.5 rounded-xl border border-gray-800">
                        <Clock size={16} color="#f97316" />
                        <Text className="text-gray-300 text-xs font-bold ml-2">{place.time}</Text>
                      </View>
                      
                      <View className="flex-row items-center bg-black/40 px-3 py-2.5 rounded-xl border border-gray-800">
                        <Banknote size={16} color="#4ade80" />
                        <View className="ml-2">{renderPrice(place.ticketPricing)}</View>
                      </View>
                      
                      <View className="flex-row items-center bg-black/40 px-3 py-2.5 rounded-xl border border-gray-800 w-full mb-1">
                        <Navigation size={16} color="#60a5fa" />
                        <Text className="text-gray-400 text-xs font-bold ml-2">{place.travelTimeToNextLocation}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
