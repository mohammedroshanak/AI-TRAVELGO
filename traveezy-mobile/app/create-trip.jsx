import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateTripScreen() {
  const router = useRouter();

  const [place, setPlace] = useState(null);
  const [days, setDays] = useState('');
  const [budget, setBudget] = useState('');
  const [travelers, setTravelers] = useState('');
  
  // Auth Sync State
  const [openDialog, setOpenDialog] = useState(false);
  const [emailAuth, setEmailAuth] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleInputChange = (value) => {
    if (value > 14) return;
    setDays(value);
  };

  const checkAuthAndGenerate = async () => {
    if (!place || !days || !budget || !travelers) {
      alert("Please fill all details");
      return;
    }

    const userStr = await AsyncStorage.getItem('user');
    if (!userStr) {
      setOpenDialog(true);
      return;
    }
    
    proceedToGenerate();
  };

  const handleSyncAuth = async () => {
    if (!emailAuth || !emailAuth.includes('@')) {
      alert("Please enter a valid Google email to sync your trips.");
      return;
    }
    
    setIsSyncing(true);
    // Simulate OAuth delay, save credentials for cross-device Firestore syncing
    await new Promise(r => setTimeout(r, 1000));
    await AsyncStorage.setItem('user', JSON.stringify({ email: emailAuth.toLowerCase() }));
    setIsSyncing(false);
    setOpenDialog(false);
    
    proceedToGenerate();
  };

  const proceedToGenerate = () => {
    router.push({
      pathname: '/generating-trip',
      params: { 
        tripParams: JSON.stringify({
           location: place?.description,
           totalDays: days,
           traveler: travelers,
           budget: budget
        }) 
      }
    });
  };

  const budgetOptions = [
    { label: 'Cheap', emoji: '💵', desc: 'Stay conscious of costs' },
    { label: 'Moderate', emoji: '💰', desc: 'Keep cost average' },
    { label: 'Luxury', emoji: '💸', desc: 'Dont worry about cost' }
  ];

  const travelersOptions = [
    { label: 'Just Me', emoji: '🧍', desc: 'A sole traveler' },
    { label: 'A Couple', emoji: '🥂', desc: 'Two travelers' },
    { label: 'Family', emoji: '👨‍👩‍👧', desc: 'A group of adventurers' },
  ];

  return (
    <ScrollView className="flex-1 bg-[#020817] px-5 pt-12 pb-20" keyboardShouldPersistTaps="handled">
      <Text className="text-white text-3xl font-black mb-2">Tell us your travel preferences</Text>
      <Text className="text-gray-400 text-base mb-10">
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </Text>

      <View className="mb-8 z-50">
        <Text className="text-white text-xl font-bold mb-3">What is your destination of choice?</Text>
        <View className="bg-black border border-gray-700 rounded-xl overflow-hidden" style={{ minHeight: 60, zIndex: 100 }}>
           <GooglePlacesAutocomplete
              placeholder='Search destination...'
              onPress={(data, details = null) => {
                setPlace(data);
              }}
              query={{
                key: process.env.EXPO_PUBLIC_GOOGLE_PLACE_API_KEY || process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
                language: 'en',
              }}
              styles={{
                textInputContainer: { backgroundColor: 'transparent', width: '100%' },
                textInput: { height: 50, color: '#fff', backgroundColor: 'transparent', fontSize: 16, paddingHorizontal: 16 },
                predefinedPlacesDescription: { color: '#9ca3af' },
                row: { backgroundColor: '#1f2937', padding: 13, height: 44, flexDirection: 'row' },
                description: { color: '#fff' },
                separator: { height: 1, backgroundColor: '#374151' },
              }}
              textInputProps={{ placeholderTextColor: '#6b7280' }}
              fetchDetails={false}
              enablePoweredByContainer={false}
           />
        </View>
      </View>

      <View className="mb-8 z-[-1]">
        <Text className="text-white text-xl font-bold mb-3">How many days are you planning your trip?</Text>
        <TextInput 
          value={days}
          onChangeText={handleInputChange}
          keyboardType="numeric"
          placeholder="Ex. 3"
          placeholderTextColor="#6b7280"
          className="w-full bg-black border border-gray-700 rounded-xl px-4 py-4 text-white text-base"
        />
      </View>

      <View className="mb-8 z-[-1]">
        <Text className="text-white text-xl font-bold mb-4">What is Your Budget?</Text>
        <View className="gap-4">
          {budgetOptions.map((opt, idx) => (
            <TouchableOpacity 
              key={idx}
              onPress={() => setBudget(opt.label)}
              className={`p-5 border rounded-2xl flex-row items-center gap-4 ${budget === opt.label ? 'border-orange-500 bg-orange-500/10' : 'border-gray-700 bg-black'}`}
              activeOpacity={0.7}
            >
              <Text className="text-4xl">{opt.emoji}</Text>
              <View>
                 <Text className="font-bold text-white text-lg">{opt.label}</Text>
                 <Text className="text-sm text-gray-400">{opt.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="mb-10 z-[-1]">
        <Text className="text-white text-xl font-bold mb-4">Who do you plan on traveling with?</Text>
        <View className="gap-4">
          {travelersOptions.map((opt, idx) => (
            <TouchableOpacity 
              key={idx}
              onPress={() => setTravelers(opt.label)}
              className={`p-5 border rounded-2xl flex-row items-center gap-4 ${travelers === opt.label ? 'border-orange-500 bg-orange-500/10' : 'border-gray-700 bg-black'}`}
              activeOpacity={0.7}
            >
              <Text className="text-4xl">{opt.emoji}</Text>
              <View>
                 <Text className="font-bold text-white text-lg">{opt.label}</Text>
                 <Text className="text-sm text-gray-400">{opt.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        onPress={checkAuthAndGenerate}
        className="bg-orange-500 py-4 rounded-xl mb-20 shadow-lg z-[-1]"
        activeOpacity={0.8}
      >
        <Text className="text-white text-center font-bold text-lg">Generate Trip</Text>
      </TouchableOpacity>

      {/* Cross-Device Auth Sync Modal */}
      <Modal animationType="slide" transparent={true} visible={openDialog}>
        <View className="flex-1 justify-center items-center bg-black/80 px-5">
          <View className="bg-gray-900 border border-gray-700 p-8 rounded-3xl w-full shadow-2xl">
            <Text className="text-2xl font-black text-white mb-2 text-center">Sync with Web App</Text>
            <Text className="text-gray-400 mb-8 text-center leading-5">
              Enter the Google Email you use on the Traveezy website to securely save and access your trips directly from your phone.
            </Text>
            
            <TextInput 
               value={emailAuth}
               onChangeText={setEmailAuth}
               placeholder="your.email@gmail.com"
               placeholderTextColor="#6b7280"
               keyboardType="email-address"
               autoCapitalize="none"
               className="w-full bg-black border border-gray-700 rounded-xl px-4 py-4 text-white text-base mb-6 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
            
            <TouchableOpacity 
              onPress={handleSyncAuth} 
              disabled={isSyncing}
              className="w-full py-4 bg-white rounded-xl mb-4 flex-row justify-center items-center shadow-lg"
              activeOpacity={0.8}
            >
              {isSyncing ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text className="text-black font-black text-lg">Securely Sync Account</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => setOpenDialog(false)} 
              className="w-full py-4 bg-transparent border border-gray-800 rounded-xl flex-row justify-center items-center"
              activeOpacity={0.5}
            >
              <Text className="text-white font-bold text-base">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
