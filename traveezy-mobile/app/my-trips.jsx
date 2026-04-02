import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserTrips } from '../src/api/firebase';

export default function MyTripsScreen() {
  const router = useRouter();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadTrips();
    }, [])
  );

  const loadTrips = async () => {
    try {
      setLoading(true);
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user?.email) {
          const trips = await getUserTrips(user.email);
          setUserTrips(trips);
        }
      }
    } catch (error) {
      console.error("Error loading trips:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#020817] px-6 pt-10">
      <Text className="text-white text-3xl font-bold mb-8">My Trips</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#f97316" className="mt-10" />
      ) : userTrips.length > 0 ? (
        userTrips.map((trip, index) => (
          <TouchableOpacity 
            key={trip.id || index}
            className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-4"
            onPress={() => router.push(`/view-trip/${trip.id}`)}
          >
            <Text className="text-white font-bold text-xl mb-1">{trip?.userSelection?.location?.label || trip?.userSelection?.location || 'Unknown Destination'}</Text>
            <Text className="text-gray-400 mb-3">{trip?.userSelection?.totalDays} Days • {trip?.userSelection?.budget} Budget</Text>
            <Text className="text-orange-500 font-semibold">View Details →</Text>
          </TouchableOpacity>
        ))
      ) : (
        <View className="items-center justify-center mt-20">
            <Text className="text-gray-400 text-lg mb-6">You haven't planned any trips yet.</Text>
            <TouchableOpacity 
                className="bg-orange-500 py-3 px-6 rounded-full"
                onPress={() => router.push('/create-trip')}
            >
                <Text className="text-white font-bold">Plan a Trip</Text>
            </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
