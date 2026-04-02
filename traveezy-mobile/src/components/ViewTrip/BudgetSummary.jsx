import React from 'react';
import { View, Text } from 'react-native';
import { Banknote, PlaneTakeoff, Utensils, Car, Ticket } from 'lucide-react-native';
import { extractPriceValue, convertCurrency } from '../../utils/currency';

export default function BudgetSummary({ trip, baseCurrency, targetCurrency }) {
  const costs = trip?.tripData?.estimatedCosts;
  if (!costs) return null;

  const totalDays = trip?.userSelection?.totalDays || 3;
  const travelerStr = String(trip?.userSelection?.traveler || '1');
  const travelerCount = parseInt(travelerStr.match(/\d+/)?.[0] || '1', 10);
  const total = (costs.totalFlights || 0) + ((costs.dailyFoodPerPerson || 0) * totalDays * travelerCount) + ((costs.transportationPerDay || 0) * totalDays) + (costs.totalActivities || 0);

  const renderPrice = (amount, suffix = "") => {
    const originalStr = `${amount} ${baseCurrency}${suffix}`;
    
    if (!targetCurrency || targetCurrency === baseCurrency) {
      return (
        <Text className="text-xl font-bold text-white mt-1">
          <Text className="text-orange-500">{amount}</Text> {baseCurrency}{suffix}
        </Text>
      );
    }

    const converted = convertCurrency(amount, baseCurrency, targetCurrency);
    
    return (
      <View>
        <Text className="text-xl font-bold text-orange-500 mt-1">{amount} {baseCurrency}{suffix}</Text>
        <View className="bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20 mt-1 self-start">
          <Text className="text-[10px] text-orange-200 font-bold">≈ {converted} {targetCurrency}{suffix}</Text>
        </View>
      </View>
    );
  };

  return (
    <View className="mb-8 mt-4 bg-gray-900/80 p-5 mx-4 rounded-3xl border border-gray-800 shadow-xl overflow-hidden">
      <View className="flex-row items-center gap-2 mb-6 border-b border-gray-800/80 pb-4">
        <Banknote size={24} color="#f97316" />
        <Text className="text-white font-bold text-xl ml-2">Budget Summary</Text>
      </View>
      
      <View className="flex-row flex-wrap justify-between">
        {/* Flights */}
        <View className="w-[48%] bg-black/40 p-4 rounded-2xl border border-gray-800/50 mb-3">
          <View className="flex-row items-center gap-1.5 mb-1 text-gray-400">
            <PlaneTakeoff size={14} color="#9ca3af" />
            <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">Flights</Text>
          </View>
          {renderPrice(costs.totalFlights)}
        </View>

        {/* Daily Food */}
        <View className="w-[48%] bg-black/40 p-4 rounded-2xl border border-gray-800/50 mb-3">
          <View className="flex-row items-center gap-1.5 mb-1 text-gray-400">
            <Utensils size={14} color="#9ca3af" />
            <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">Daily Food</Text>
          </View>
          {renderPrice(costs.dailyFoodPerPerson, " /person")}
        </View>

        {/* Transport */}
        <View className="w-[48%] bg-black/40 p-4 rounded-2xl border border-gray-800/50 mb-3">
          <View className="flex-row items-center gap-1.5 mb-1 text-gray-400">
            <Car size={14} color="#9ca3af" />
            <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">Transport</Text>
          </View>
          {renderPrice(costs.transportationPerDay, " /day")}
        </View>

        {/* Activities */}
        <View className="w-[48%] bg-black/40 p-4 rounded-2xl border border-gray-800/50 mb-3">
          <View className="flex-row items-center gap-1.5 mb-1 text-gray-400">
            <Ticket size={14} color="#9ca3af" />
            <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">Activities</Text>
          </View>
          {renderPrice(costs.totalActivities)}
        </View>
      </View>

      <View className="mt-2 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl items-center flex-row justify-between">
        <Text className="text-orange-200/80 font-medium uppercase tracking-widest text-xs">Total Est.</Text>
        {renderPrice(total)}
      </View>
    </View>
  );
}
