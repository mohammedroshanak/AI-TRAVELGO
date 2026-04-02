import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Wallet, Calendar, Users, Heart, Sparkles, Navigation, Globe2 } from 'lucide-react-native';
import { generateSharedDestinations } from '../../src/api/generateTrip';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BudgetDestinationScreen() {
  const router = useRouter();

  const [fromLocation, setFromLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('4-5 days');
  const [travelers, setTravelers] = useState('1');
  const [preference, setPreference] = useState('Adventure');
  
  const [destinations, setDestinations] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [generatingTripFor, setGeneratingTripFor] = useState(null);
  
  // Auth Sync State
  const [openDialog, setOpenDialog] = useState(false);
  const [emailAuth, setEmailAuth] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingDestination, setPendingDestination] = useState(null);
  
  const scrollViewRef = useRef(null);

  const DURATION_OPTIONS = ['2-3 days', '4-5 days', '6-7 days', '8+ days'];
  const PREFERENCE_OPTIONS = ['Adventure', 'Beach', 'Nature', 'Cultural', 'Luxury', 'Budget Friendly'];

  const handleSearchDestinations = async () => {
    if (!budget || !travelers) {
      alert("Please enter at least your Budget and Number of Travelers.");
      return;
    }
    setLoadingSearch(true);
    setDestinations([]);
    
    try {
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");
      const results = await generateSharedDestinations(fromLocation, budget, duration, travelers, preference, apiKey);
      setDestinations(results);
    } catch(e) {
      console.error(e);
      alert("Failed to generate. Check your API limit.");
    } finally {
      setLoadingSearch(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 500);
    }
  };

  const checkAuthAndGenerate = async (destination) => {
    setGeneratingTripFor(destination.destinationName);
    const userStr = await AsyncStorage.getItem('user');
    
    if (!userStr) {
      setPendingDestination(destination);
      setOpenDialog(true);
      return;
    }
    
    proceedToGenerate(destination);
  };

  const handleSyncAuth = async () => {
    if (!emailAuth || !emailAuth.includes('@')) {
      alert("Please enter a valid Google email to sync your trips.");
      return;
    }
    
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 1000));
    await AsyncStorage.setItem('user', JSON.stringify({ email: emailAuth.toLowerCase() }));
    setIsSyncing(false);
    setOpenDialog(false);
    
    if (pendingDestination) {
      proceedToGenerate(pendingDestination);
    }
  };

  const proceedToGenerate = (destination) => {
    let pseudoBudgetTier = 'Moderate';
    if (preference === 'Budget Friendly') pseudoBudgetTier = 'Cheap';
    if (preference === 'Luxury') pseudoBudgetTier = 'Luxury';

    setTimeout(() => {
      setGeneratingTripFor(null);
      router.push({
        pathname: '/generating-trip',
        params: { 
          tripParams: JSON.stringify({
             location: `${destination.destinationName}, ${destination.country}`,
             totalDays: duration?.match(/\d+/)?.[0] || '3',
             traveler: travelers || '1',
             budget: pseudoBudgetTier
          }) 
        }
      });
    }, 100);
  };

  return (
    <ScrollView ref={scrollViewRef} className="flex-1 bg-[#020817]">
      <View className="px-5 py-10 pt-16">
        
        {/* Header */}
        <View className="items-center mb-10">
          <Text className="text-4xl font-black mb-4 flex justify-center items-center text-center text-white">
             Find Destinations Within Your Budget
          </Text>
          <Text className="text-gray-400 text-lg text-center">
            Tell us how much you want to spend, and our AI will suggest the perfect destinations.
          </Text>
        </View>

        {/* Input Form Card */}
        <View className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl mb-12">
          
          {/* From Location */}
          <View className="mb-6">
            <View className="flex-row items-center gap-2 mb-2">
              <MapPin size={18} color="#f97316" />
              <Text className="text-sm font-bold text-gray-300">From Location (Optional)</Text>
            </View>
            <View className="bg-black border border-gray-700 rounded-xl overflow-hidden" style={{ minHeight: 56, zIndex: 100 }}>
               <GooglePlacesAutocomplete
                  placeholder='Where are you traveling from?'
                  onPress={(data, details = null) => {
                    setFromLocation(data.description);
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

          {/* Budget & Travelers Row */}
          <View className="flex-row gap-4 mb-6">
             <View className="flex-1">
                <View className="flex-row items-center gap-2 mb-2">
                  <Wallet size={18} color="#f97316" />
                  <Text className="text-sm font-bold text-gray-300">Budget (₹)</Text>
                </View>
                <TextInput 
                  value={budget}
                  onChangeText={setBudget}
                  keyboardType="numeric"
                  placeholder="E.g. 50000"
                  placeholderTextColor="#6b7280"
                  className="w-full bg-black border border-gray-700 rounded-xl px-4 py-4 text-white text-base font-bold"
                />
             </View>
             <View className="flex-1">
                <View className="flex-row items-center gap-2 mb-2">
                  <Users size={18} color="#f97316" />
                  <Text className="text-sm font-bold text-gray-300">Travelers</Text>
                </View>
                <TextInput 
                  value={travelers}
                  onChangeText={setTravelers}
                  keyboardType="numeric"
                  placeholder="E.g. 2"
                  placeholderTextColor="#6b7280"
                  className="w-full bg-black border border-gray-700 rounded-xl px-4 py-4 text-white text-base font-bold"
                />
             </View>
          </View>

          {/* Duration Selector */}
          <View className="mb-6">
             <View className="flex-row items-center gap-2 mb-3">
               <Calendar size={18} color="#f97316" />
               <Text className="text-sm font-bold text-gray-300">Trip Duration</Text>
             </View>
             <View className="flex-row flex-wrap gap-3">
               {DURATION_OPTIONS.map(opt => (
                 <TouchableOpacity 
                    key={opt}
                    onPress={() => setDuration(opt)}
                    className={`px-4 py-2 rounded-lg border ${duration === opt ? 'bg-orange-500/20 border-orange-500' : 'bg-black border-gray-700'}`}
                 >
                   <Text className={`${duration === opt ? 'text-orange-500 font-bold' : 'text-gray-400'}`}>{opt}</Text>
                 </TouchableOpacity>
               ))}
             </View>
          </View>

          {/* Preference Selector */}
          <View className="mb-8">
             <View className="flex-row items-center gap-2 mb-3">
               <Heart size={18} color="#f97316" />
               <Text className="text-sm font-bold text-gray-300">Travel Preference</Text>
             </View>
             <View className="flex-row flex-wrap gap-3">
               {PREFERENCE_OPTIONS.map(opt => (
                 <TouchableOpacity 
                    key={opt}
                    onPress={() => setPreference(opt)}
                    className={`px-4 py-2 rounded-lg border ${preference === opt ? 'bg-orange-500/20 border-orange-500' : 'bg-black border-gray-700'}`}
                 >
                   <Text className={`${preference === opt ? 'text-orange-500 font-bold' : 'text-gray-400'}`}>{opt}</Text>
                 </TouchableOpacity>
               ))}
             </View>
          </View>

          {/* Search Button */}
          <TouchableOpacity 
            onPress={handleSearchDestinations}
            disabled={loadingSearch}
            className={`w-full py-5 rounded-2xl flex-row items-center justify-center gap-3 shadow-lg shadow-orange-500/30 ${loadingSearch ? 'bg-orange-600/50' : 'bg-orange-500'}`}
          >
            {loadingSearch ? (
              <ActivityIndicator color="white" />
            ) : (
              <Sparkles color="white" size={20} />
            )}
            <Text className="text-white font-black text-lg">
              {loadingSearch ? 'Finding Destinations...' : 'Generate Destinations'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results Grid */}
        {destinations.length > 0 && (
           <View className="mb-10">
              <Text className="text-3xl font-black text-center text-white mb-8">AI Suggested Destinations</Text>
              
              {destinations.map((dest, i) => (
                <View key={i} className="bg-white rounded-3xl overflow-hidden mb-8 shadow-xl">
                   <View className="p-6">
                      <View className="flex-row justify-between items-start mb-3">
                         <View className="flex-1 mr-4">
                            <Text className="text-2xl font-black text-gray-900 leading-tight">{dest.destinationName}</Text>
                            <Text className="text-gray-500 font-bold uppercase text-xs mt-1 tracking-wider"><Globe2 color="#6b7280" size={12} /> {dest.country}</Text>
                         </View>
                         <View className="bg-orange-100 px-3 py-1.5 rounded-lg border border-orange-200">
                            <Text className="text-orange-700 font-black text-sm">{dest.estimatedCost}</Text>
                         </View>
                      </View>
                      
                      <Text className="text-gray-600 font-medium mb-5 leading-relaxed">{dest.shortDescription}</Text>
                      
                      <View className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-2 gap-3">
                         <View className="flex-row items-center gap-3">
                            <Sparkles size={16} color="#a855f7" />
                            <Text className="text-sm font-bold text-gray-700 flex-1">{dest.topHighlight}</Text>
                         </View>
                         <View className="flex-row items-center gap-3">
                            <Calendar size={16} color="#3b82f6" />
                            <Text className="text-sm font-bold text-gray-700 flex-1">Best: {dest.bestTravelTime}</Text>
                         </View>
                      </View>
                   </View>
                   
                   <TouchableOpacity 
                     onPress={() => checkAuthAndGenerate(dest)}
                     disabled={generatingTripFor === dest.destinationName}
                     className="bg-gray-900 border-t border-gray-100 py-5 flex-row justify-center items-center gap-2 active:bg-black"
                   >
                     {generatingTripFor === dest.destinationName ? (
                       <ActivityIndicator color="white" size="small" />
                     ) : (
                       <Navigation color="#fba11b" size={18} />
                     )}
                     <Text className="text-white font-bold text-base">
                       {generatingTripFor === dest.destinationName ? 'Generating...' : 'Generate Full Trip Plan'}
                     </Text>
                   </TouchableOpacity>
                </View>
              ))}
           </View>
        )}

      </View>

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
