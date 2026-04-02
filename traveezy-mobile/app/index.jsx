import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#020817]" edges={['top']}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}>
        
        <Text className="font-extrabold text-4xl text-center text-white mb-6 tracking-tight leading-tight">
          <Text className="text-orange-500">Discover Your Next Adventure with AI: </Text>
          Personalized Itineraries at Your Fingertips
        </Text>
        
        <Text className="text-lg text-gray-400 text-center mb-10 leading-relaxed font-medium">
          Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
        </Text>
        
        <View className="w-full gap-4">
          <TouchableOpacity 
            className="w-full bg-orange-500 py-4 lg:py-5 rounded-full shadow-[0_10px_15px_-3px_rgba(249,115,22,0.4)]"
            onPress={() => router.push('/create-trip')}
            activeOpacity={0.8}
          >
            <Text className="text-center text-white font-bold text-lg">Get Started, It's Free</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="w-full bg-gray-800 border border-gray-700 py-4 lg:py-5 rounded-full shadow-lg"
            onPress={() => router.push('/budget-destination')}
            activeOpacity={0.8}
          >
            <Text className="text-center text-white font-bold text-lg">✨ Find Destinations Within My Budget</Text>
          </TouchableOpacity>
        </View>

        <View className="w-full mt-12 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 aspect-video bg-gray-900 flex items-center justify-center">
            <Text className="text-gray-500 text-center px-4">[App Mockup / Hero Image Placeholder]</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
