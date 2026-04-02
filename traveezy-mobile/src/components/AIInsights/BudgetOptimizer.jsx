import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { Building2, Utensils, Car, Ticket, Wallet } from 'lucide-react-native';

const calculateBudgetBreakdown = (destination, budgetTier, travelers) => {
  const destLower = (destination || '').toLowerCase();
  
  let basePerTraveler = 30000;
  const tierLower = (budgetTier || '').toLowerCase();
  if (tierLower.includes('budget') || tierLower.includes('cheap') || tierLower.includes('friendly')) {
    basePerTraveler = 15000;
  } else if (tierLower.includes('luxury')) {
    basePerTraveler = 60000;
  }
  
  const numTravelers = parseInt(String(travelers).match(/\d+/)?.[0] || '1', 10) || 1;
  const totalBudget = basePerTraveler * numTravelers;
  
  const isExpensive = ['switzerland', 'paris', 'london', 'new york', 'dubai', 'singapore', 'tokyo'].some(w => destLower.includes(w));
  const isCheap = ['india', 'thailand', 'vietnam', 'indonesia', 'philippines', 'cambodia', 'sri lanka'].some(w => destLower.includes(w));
  
  let percentages = { accommodation: 0.40, food: 0.25, transport: 0.20, activities: 0.15 };
  
  if (isExpensive) {
    percentages = { accommodation: 0.45, food: 0.25, transport: 0.15, activities: 0.15 };
  } else if (isCheap) {
    percentages = { accommodation: 0.35, food: 0.30, transport: 0.20, activities: 0.15 };
  }
  
  const breakdown = [
    { name: 'Accommodation', value: totalBudget * percentages.accommodation, colorCode: '#3b82f6', bgCls: 'bg-blue-500/10', barCls: 'bg-blue-500', icon: Building2 },
    { name: 'Food & Dining', value: totalBudget * percentages.food, colorCode: '#22c55e', bgCls: 'bg-green-500/10', barCls: 'bg-green-500', icon: Utensils },
    { name: 'Transportation', value: totalBudget * percentages.transport, colorCode: '#f97316', bgCls: 'bg-orange-500/10', barCls: 'bg-orange-500', icon: Car },
    { name: 'Activities', value: totalBudget * percentages.activities, colorCode: '#a855f7', bgCls: 'bg-purple-500/10', barCls: 'bg-purple-500', icon: Ticket }
  ];
  
  return { breakdown, totalBudget, numTravelers };
};

export default function BudgetOptimizer({ destination, duration, travelers, budgetTier }) {
  const numDays = parseInt(String(duration).match(/\d+/)?.[0] || '1', 10) || 1;
  
  const { breakdown, totalBudget, numTravelers } = useMemo(() => 
    calculateBudgetBreakdown(destination, budgetTier, travelers), 
  [destination, budgetTier, travelers]);
  
  const perPersonPerDay = useMemo(() => {
    return totalBudget / numTravelers / numDays;
  }, [totalBudget, numTravelers, numDays]);

  const formatCurrency = (val) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  return (
    <View className="bg-[#020817] rounded-3xl p-5 border border-gray-800 mb-6 w-full">
      <View className="flex-row items-center gap-3 mb-6 border-b border-gray-800/80 pb-4">
        <Wallet color="#f97316" size={24} />
        <Text className="text-xl font-black text-white tracking-tight">Budget Breakdown</Text>
      </View>

      <View className="mb-6 gap-3">
        {breakdown.map((item, idx) => {
          const Icon = item.icon;
          const percentage = ((item.value / totalBudget) * 100).toFixed(0);

          return (
            <View key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center gap-3">
                  <View className={`p-2 rounded-xl ${item.bgCls}`}>
                    <Icon color={item.colorCode} size={20} />
                  </View>
                  <View>
                    <Text className="text-gray-400 font-bold text-[10px] uppercase tracking-wider mb-0.5">{item.name}</Text>
                    <Text className="text-lg font-black text-white">{formatCurrency(item.value)}</Text>
                  </View>
                </View>
                <View className={`px-2 py-1 rounded-md ${item.bgCls}`}>
                  <Text style={{color: item.colorCode}} className="text-xs font-bold">{percentage}%</Text>
                </View>
              </View>
              
              {/* Progress Bar */}
              <View className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                <View className={`h-full ${item.barCls} rounded-full`} style={{ width: `${percentage}%` }} />
              </View>
            </View>
          );
        })}
      </View>

      <View className="bg-white/5 rounded-2xl p-5 border border-white/5">
        <Text className="text-gray-400 font-medium mb-1 text-center">Total Estimated Budget</Text>
        <Text className="text-3xl font-black text-white text-center mb-1">{formatCurrency(totalBudget)}</Text>
        <Text className="text-gray-500 font-medium text-[10px] uppercase text-center mb-4">for {numTravelers} travelers over {numDays} days</Text>
        
        <View className="h-px w-full bg-white/10 mb-4" />
        
        <View className="bg-black/40 px-4 py-3 rounded-xl items-center border border-white/5">
          <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">Per Person / Day</Text>
          <Text className="text-xl font-black text-orange-500">{formatCurrency(perPersonPerDay)}</Text>
        </View>
      </View>
    </View>
  );
}
