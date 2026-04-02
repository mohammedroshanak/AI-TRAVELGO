import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../src/api/firebase';
import { ArrowLeft, BrainCircuit, Sparkles, Utensils } from 'lucide-react-native';

import CrowdPredictor from '../../src/components/AIInsights/CrowdPredictor';
import SafetyScore from '../../src/components/AIInsights/SafetyScore';
import SmartRecommendations from '../../src/components/AIInsights/SmartRecommendations';
import FoodExplorer from '../../src/components/AIInsights/FoodExplorer';
import DifficultyAnalyzer from '../../src/components/AIInsights/DifficultyAnalyzer';
import BudgetOptimizer from '../../src/components/AIInsights/BudgetOptimizer';
import PackingListGenerator from '../../src/components/AIInsights/PackingListGenerator';

export default function AIInsightsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setTrip(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (e) {
      console.error("AI Insights Data Error:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
     return (
       <View className="flex-1 bg-black items-center justify-center">
         <ActivityIndicator size="large" color="#a855f7" />
       </View>
     );
  }

  if (!trip) {
    return (
      <View className="flex-1 bg-[#020817] items-center justify-center px-6">
        <View className="bg-red-500/10 p-6 rounded-3xl border border-red-500/20 w-full mb-6">
          <Text className="text-2xl font-bold text-red-500 mb-2 text-center">Trip Not Found</Text>
          <Text className="text-gray-400 text-center">We couldn't retrieve the details for this journey.</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="bg-orange-500 py-3 px-6 rounded-xl w-full"
        >
          <Text className="text-white font-bold text-center text-lg">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const locationName = trip?.userSelection?.location;
  const shortLocation = locationName?.split(',')[0] || '';
  const smartRecs = trip?.tripData?.smartRecommendations;

  return (
    <ScrollView className="flex-1 bg-[#020817]" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="px-5 pt-12">
        
        {/* Navigation & Header */}
        <View className="mb-8">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="flex-row items-center gap-2 mb-6 self-start p-2 -ml-2 rounded-lg bg-white/5 active:bg-white/10"
          >
            <ArrowLeft color="#9ca3af" size={20} />
            <Text className="text-gray-400 font-medium text-sm">Back to Trip Details</Text>
          </TouchableOpacity>

          <Text className="text-4xl font-black text-purple-400 mb-2">Advanced</Text>
          <Text className="text-4xl font-black text-blue-400 mb-4">AI Insights</Text>
          
          <View className="flex-row items-start gap-2 pr-4">
            <Sparkles color="#c084fc" size={20} className="mt-1 shrink-0" />
            <Text className="text-gray-400 text-base flex-1">
              Deep analytical breakdown for your journey to <Text className="text-white font-bold">{locationName}</Text>
            </Text>
          </View>
        </View>

        <View className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-3xl flex-row items-center gap-4 mb-10 shadow-lg">
           <View className="w-14 h-14 bg-purple-600 rounded-2xl items-center justify-center shadow-lg">
             <BrainCircuit color="white" size={28} />
           </View>
           <View>
              <Text className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-0.5">AI Intelligence Core</Text>
              <Text className="text-lg font-bold text-gray-300">Analysis Active</Text>
           </View>
        </View>

        <View className="mb-6 flex-row items-center gap-3">
          <View className="w-1.5 h-6 bg-yellow-400 rounded-full" />
          <Text className="text-xl font-black text-white uppercase tracking-tight">Expert Intelligence</Text>
        </View>

        <View className="mb-8 gap-6">
          <CrowdPredictor data={smartRecs?.crowdPredictor} />
          <SafetyScore data={smartRecs?.safetyScore} />
        </View>

        <View className="mb-10">
          <SmartRecommendations recommendations={smartRecs} />
        </View>

        <View className="mb-10">
          <View className="flex-row items-center gap-3 mb-6">
            <Utensils color="#facc15" size={20} />
            <Text className="text-lg font-black uppercase tracking-widest text-gray-300">Culinary Intelligence</Text>
          </View>
          <FoodExplorer data={smartRecs?.foodExplorer} />
        </View>

        <View className="pt-10 border-t border-white/5 space-y-10">
          <View>
            <View className="flex-row items-center gap-3 mb-6">
              <View className="w-1.5 h-6 bg-purple-500 rounded-full" />
              <Text className="text-xl font-black uppercase tracking-tight text-white">Difficulty Matrix</Text>
            </View>
            <DifficultyAnalyzer destination={locationName} duration={trip?.userSelection?.totalDays} />
          </View>

          <View>
            <View className="flex-row items-center gap-3 mb-6 mt-6">
              <View className="w-1.5 h-6 bg-blue-500 rounded-full" />
              <Text className="text-xl font-black uppercase tracking-tight text-white">Budget Optimization</Text>
            </View>
            <BudgetOptimizer 
              destination={locationName}
              duration={trip?.userSelection?.totalDays}
              travelers={trip?.userSelection?.traveler}
              budgetTier={trip?.userSelection?.budget}
            />
          </View>

          <View>
            <View className="flex-row items-center gap-3 mb-6 mt-6">
              <View className="w-1.5 h-6 bg-green-500 rounded-full" />
              <Text className="text-xl font-black uppercase tracking-tight text-white">Smart Logistics</Text>
            </View>
            <PackingListGenerator 
              tripId={id} 
              destination={locationName} 
              totalDays={trip?.userSelection?.totalDays} 
            />
          </View>
        </View>
        
      </View>
    </ScrollView>
  );
}
