import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Sparkles, Map, Hotel, Utensils, Plane, ShieldCheck, Globe } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateSharedTrip } from '../../src/api/generateTrip';
import { saveTrip } from '../src/api/firebase';

const LOADING_STEPS = [
  { icon: <Globe color="#60a5fa" size={32} />, text: "Analyzing global travel patterns..." },
  { icon: <ShieldCheck color="#4ade80" size={32} />, text: "Verifying safety and visa protocols..." },
  { icon: <Hotel color="#c084fc" size={32} />, text: "Scouting premium hotel availability..." },
  { icon: <Utensils color="#fb923c" size={32} />, text: "Curating local culinary experiences..." },
  { icon: <Plane color="#38bdf8" size={32} />, text: "Finding optimal flight routes..." },
  { icon: <Map color="#34d399" size={32} />, text: "Designing your custom daily itinerary..." },
];

export default function GeneratingTripScreen() {
  const { tripParams } = useLocalSearchParams();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);
  
  // Basic Animation for Steps
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!tripParams) {
      router.replace('/create-trip');
      return;
    }

    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true })
      ]).start();
      
      setCurrentStep(prev => (prev + 1) % LOADING_STEPS.length);
    }, 2500);

    createTripSequence();

    return () => clearInterval(interval);
  }, []);

  const createTripSequence = async () => {
    try {
      const parsedParams = JSON.parse(tripParams);
      
      // Get User (if logged in, else anonymous)
      const userStr = await AsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : { email: 'anonymous@traveezy.com' };

      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key is missing. Please verify your environment file.");

      // Generate trip using shared Monorepo logic
      const tripData = await generateSharedTrip(parsedParams, apiKey);

      // Save mapped structure to Firebase
      const docId = Date.now().toString();
      const firestorePayload = {
        userSelection: {
          location: parsedParams.location,
          totalDays: parsedParams.totalDays,
          budget: parsedParams.budget,
          traveler: parsedParams.traveler
        },
        tripData: tripData,
        userEmail: user.email,
        id: docId
      };

      await saveTrip(docId, firestorePayload);

      // Navigate to View Trip
      router.replace(`/view-trip/${docId}`);

    } catch (e) {
      console.error('Generation Error:', e);
      setError(e.stack || e.message || "Failed to generate trip. Please try again.");
    }
  };

  if (error) {
    return (
      <View className="flex-1 bg-black items-center justify-center px-6">
        <View className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl w-full items-center">
          <Text className="text-red-500 font-bold text-2xl mb-4 text-center">Generation Interrupted</Text>
          <Text className="text-gray-300 text-center mb-6 leading-6">{error}</Text>
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-full bg-white py-4 rounded-xl"
          >
            <Text className="text-black text-center font-bold text-lg">Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const parsedLocation = tripParams ? JSON.parse(tripParams).location?.split(',')[0] : 'your destination';

  return (
    <View className="flex-1 bg-[#020817] items-center justify-center px-6">
      
      <View className="w-24 h-24 bg-orange-500 rounded-3xl items-center justify-center shadow-lg shadow-orange-500/50 mb-10">
        <Sparkles color="white" size={40} />
      </View>
      
      <Text className="text-4xl font-black text-white text-center tracking-tight mb-4">
        Crafting Your <Text className="text-orange-500">Perfect Journey</Text>
      </Text>
      
      <Text className="text-gray-400 text-lg text-center mb-16 px-4">
        Our AI is weaving together a personalized itinerary for <Text className="text-white font-bold">{parsedLocation}</Text>
      </Text>

      <Animated.View style={{ opacity: fadeAnim }} className="items-center bg-gray-900/50 p-6 rounded-3xl border border-gray-800 w-full mb-16 min-h-[160px] justify-center">
         <View className="mb-4">
            {LOADING_STEPS[currentStep].icon}
         </View>
         <Text className="text-xl font-bold text-white text-center">
            {LOADING_STEPS[currentStep].text}
         </Text>
      </Animated.View>

      <ActivityIndicator size="large" color="#f97316" />
      <Text className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-gray-500">
        Please do not close this app
      </Text>
    </View>
  );
}
