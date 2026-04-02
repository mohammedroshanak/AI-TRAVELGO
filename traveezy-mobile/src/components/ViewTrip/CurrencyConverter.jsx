import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowRightLeft } from 'lucide-react-native';

import { conversionRates } from '../../utils/currency';

export default function CurrencyConverter({ baseCurrency, onCurrencyChange }) {
  const initialCurrency = conversionRates[baseCurrency] ? 'USD' : 'EUR'; 
  const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency === baseCurrency ? 'EUR' : 'USD');

  const availableCurrencies = Object.keys(conversionRates);

  const safeBaseCurrency = conversionRates[baseCurrency] ? baseCurrency : 'USD';
  const baseRate = conversionRates[safeBaseCurrency] || 1;
  const targetRate = conversionRates[selectedCurrency] || 1;
  const exchangeRate = (1 / baseRate) * targetRate;

  useEffect(() => {
    if (onCurrencyChange && selectedCurrency) {
      onCurrencyChange(selectedCurrency);
    }
  }, [selectedCurrency]);

  const handleCurrencyChange = (curr) => {
    setSelectedCurrency(curr);
  };

  return (
    <View className="mt-8 mb-5 bg-[#0a1120] border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      <View className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />
      
      <View className="flex-row items-center gap-3 mb-6">
        <ArrowRightLeft size={24} color="#f97316" />
        <Text className="font-black text-2xl text-white">Currency Intelligence</Text>
      </View>

      <Text className="text-gray-400 font-medium mb-6">
        Convert your local budget against <Text className="text-orange-400 font-bold">{safeBaseCurrency}</Text>
      </Text>

      <View className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800 mb-6 flex-row justify-between items-center">
        <View>
          <Text className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Base Currency</Text>
          <Text className="text-2xl font-black text-white">{safeBaseCurrency}</Text>
        </View>
        <ArrowRightLeft size={20} color="#fb923c" opacity={0.5} />
        <View className="items-end">
          <Text className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-1">Target Currency</Text>
          <Text className="text-2xl font-black text-white">{selectedCurrency}</Text>
        </View>
      </View>

      <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Select Target:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
        {availableCurrencies.map(curr => (
          <TouchableOpacity 
            key={curr}
            onPress={() => handleCurrencyChange(curr)}
            className={`px-4 py-2 rounded-xl mr-3 border ${selectedCurrency === curr ? 'bg-orange-500 border-orange-400' : 'bg-gray-800 border-gray-700'}`}
          >
            <Text className={`font-bold ${selectedCurrency === curr ? 'text-white' : 'text-gray-300'}`}>{curr}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {safeBaseCurrency !== selectedCurrency && (
        <View className="items-center bg-black/40 p-4 rounded-xl border border-gray-800/80">
          <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Live Exchange Rate</Text>
          <View className="flex-row items-end gap-2">
            <Text className="text-xl font-black text-orange-500">1.00</Text> 
            <Text className="text-sm font-bold text-gray-500 mb-0.5">{safeBaseCurrency}</Text>
            <Text className="text-xl text-white mx-1">≈</Text>
            <Text className="text-xl font-black text-orange-500">{exchangeRate.toFixed(2)}</Text>
            <Text className="text-sm font-bold text-gray-500 mb-0.5">{selectedCurrency}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
