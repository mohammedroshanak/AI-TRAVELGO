import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../src/api/firebase';

// Components
import HeroHeader from '../../src/components/ViewTrip/HeroHeader';
import BudgetSummary from '../../src/components/ViewTrip/BudgetSummary';
import HotelsList from '../../src/components/ViewTrip/HotelsList';
import Itinerary from '../../src/components/ViewTrip/Itinerary';
import WeatherIntelligence from '../../src/components/ViewTrip/WeatherIntelligence';
import CurrencyConverter from '../../src/components/ViewTrip/CurrencyConverter';
import { BrainCircuit, Sparkles, MessageSquare } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import TravelChatbot from '../../src/components/TravelChatbot';

export default function ViewTrip() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dynamic Base Currency based on trip location
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (id) {
      GetTripData();
    }
  }, [id]);

  const GetTripData = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'AITrips', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTrip(data);
        
        // Setup base currency based on destination if possible
        const location = data?.userSelection?.location;
        if (location) {
           const { detectCurrency } = require('../../src/utils/currency');
           const info = detectCurrency(location);
           setBaseCurrency(info?.currency || 'USD');
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching trip:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !trip) {
    return (
      <View className="flex-1 bg-black items-center justify-center pt-20">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="text-gray-400 font-medium mt-4">Loading amazing journey...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <ScrollView 
        className="flex-1 bg-black" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <HeroHeader trip={trip} />
        
        <View className="w-full max-w-7xl mx-auto px-4 -mt-2">
          <WeatherIntelligence location={trip?.userSelection?.location?.split(',')[0]} />
          <CurrencyConverter 
            baseCurrency={baseCurrency} 
            onCurrencyChange={(curr) => setTargetCurrency(curr)} 
          />

          {/* AI Insights Link */}
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => router.push(`/trip-ai-insights/${id}`)}
            className="mt-6 mb-10 mx-1 bg-gray-900 border border-purple-500/40 rounded-3xl p-6 shadow-[0_0_30px_rgba(147,51,234,0.3)] shadow-purple-500/20"
          >
            <View className="flex-row items-center gap-5">
              <View className="w-16 h-16 bg-purple-600 rounded-2xl items-center justify-center">
                <BrainCircuit color="white" size={32} />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-black text-white mb-1 uppercase tracking-tight">Advanced AI Insights</Text>
                <Text className="text-purple-200/60 font-medium text-xs leading-4">View smart budget breakdown, logistics checklist, and travel difficulty matrix.</Text>
              </View>
              <Sparkles color="#fbbf24" size={24} />
            </View>
          </TouchableOpacity>

          <BudgetSummary trip={trip} baseCurrency={baseCurrency} targetCurrency={targetCurrency} />
        </View>

        <View className="w-full max-w-7xl mx-auto">
          <HotelsList trip={trip} baseCurrency={baseCurrency} targetCurrency={targetCurrency} />
          <Itinerary trip={trip} baseCurrency={baseCurrency} targetCurrency={targetCurrency} />
        </View>
      </ScrollView>

      <TravelChatbot 
        isVisible={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        tripContext={{
          destination: trip.userSelection.location,
          duration: trip.userSelection.totalDays,
          budget: trip.userSelection.budget,
          travelers: trip.userSelection.traveler
        }}
      />

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setIsChatOpen(true)}
          className="bg-cyan-600 rounded-full items-center justify-center shadow-2xl shadow-cyan-500/60 z-50 border-4 border-white/10"
          style={{ 
            position: 'absolute', 
            bottom: 40, 
            right: 25, 
            width: 70, 
            height: 70,
            elevation: 10
          }}
        >
          <MessageSquare color="white" size={32} />
        </TouchableOpacity>
      )}
    </View>
  );
}
