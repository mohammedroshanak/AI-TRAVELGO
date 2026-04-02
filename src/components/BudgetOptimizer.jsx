import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Building2, Utensils, Car, Ticket, Wallet } from 'lucide-react';

const COLORS = ['#3b82f6', '#22c55e', '#f97316', '#a855f7']; // Blue, Green, Orange, Purple

const calculateBudgetBreakdown = (destination, budgetTier, travelers) => {
  const destLower = (destination || '').toLowerCase();
  
  // Base calculation
  let basePerTraveler = 30000;
  const tierLower = (budgetTier || '').toLowerCase();
  if (tierLower.includes('budget') || tierLower.includes('cheap') || tierLower.includes('friendly')) {
    basePerTraveler = 15000;
  } else if (tierLower.includes('luxury')) {
    basePerTraveler = 60000;
  }
  
  const numTravelers = parseInt(String(travelers).match(/\d+/)?.[0] || '1', 10) || 1;
  const totalBudget = basePerTraveler * numTravelers;
  
  // Destination Adjustment
  const isExpensive = ['switzerland', 'paris', 'london', 'new york', 'dubai', 'singapore', 'tokyo'].some(w => destLower.includes(w));
  const isCheap = ['india', 'thailand', 'vietnam', 'indonesia', 'philippines', 'cambodia', 'sri lanka'].some(w => destLower.includes(w));
  
  let percentages = { accommodation: 0.40, food: 0.25, transport: 0.20, activities: 0.15 };
  
  if (isExpensive) {
    percentages = { accommodation: 0.45, food: 0.25, transport: 0.15, activities: 0.15 };
  } else if (isCheap) {
    percentages = { accommodation: 0.35, food: 0.30, transport: 0.20, activities: 0.15 };
  }
  
  const breakdown = [
    { name: 'Accommodation', value: totalBudget * percentages.accommodation, colorCls: 'text-blue-500', bgCls: 'bg-blue-500/10', borderCls: 'border-blue-500', icon: Building2 },
    { name: 'Food & Dining', value: totalBudget * percentages.food, colorCls: 'text-green-500', bgCls: 'bg-green-500/10', borderCls: 'border-green-500', icon: Utensils },
    { name: 'Transportation', value: totalBudget * percentages.transport, colorCls: 'text-orange-500', bgCls: 'bg-orange-500/10', borderCls: 'border-orange-500', icon: Car },
    { name: 'Activities', value: totalBudget * percentages.activities, colorCls: 'text-purple-500', bgCls: 'bg-purple-500/10', borderCls: 'border-purple-500', icon: Ticket }
  ];
  
  return { breakdown, totalBudget, numTravelers };
};

export default function BudgetOptimizer({ destination, duration, travelers, budgetTier }) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const numDays = parseInt(String(duration).match(/\d+/)?.[0] || '1', 10) || 1;
  
  const { breakdown, totalBudget, numTravelers } = useMemo(() => 
    calculateBudgetBreakdown(destination, budgetTier, travelers), 
  [destination, budgetTier, travelers]);
  
  const perPersonPerDay = useMemo(() => {
    return totalBudget / numTravelers / numDays;
  }, [totalBudget, numTravelers, numDays]);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  const formatCurrency = (val) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalBudget) * 100).toFixed(0);
      return (
        <div className="bg-gray-900 border border-gray-700 p-4 rounded-xl shadow-2xl backdrop-blur-md">
          <p className={`font-bold text-lg mb-1 ${data.colorCls}`}>{data.name}</p>
          <div className="flex justify-between items-center gap-6">
            <span className="text-gray-300 font-medium">Value:</span>
            <span className="text-white font-bold">{formatCurrency(data.value)}</span>
          </div>
          <div className="flex justify-between items-center gap-6 mt-1">
            <span className="text-gray-400 text-sm">Allocation:</span>
            <span className="text-gray-300 text-sm font-bold">{percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="font-bold text-xs pointer-events-none drop-shadow-md">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="mt-16 mb-16 bg-gradient-to-br from-gray-950 to-gray-900 rounded-3xl border border-gray-800 shadow-2xl p-6 md:p-10 font-sans">
      <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-4">
        <Wallet className="w-8 h-8 text-orange-500" />
        <h2 className="text-3xl font-black text-white tracking-tight">Smart Budget Breakdown</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Chart Section */}
        <div className="h-[300px] w-full relative xl:h-[350px]">
          <div className="absolute inset-0 bg-gray-900/20 rounded-full blur-3xl scale-75 shadow-[0_0_50px_rgba(59,130,246,0.1)]"></div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={breakdown}
                cx="50%"
                cy="50%"
                innerRadius="45%"
                outerRadius="80%"
                paddingAngle={4}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                labelLine={false}
                label={renderCustomizedLabel}
                stroke="none"
              >
                {breakdown.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    className="transition-all duration-300"
                    style={{
                      filter: activeIndex === index ? `drop-shadow(0px 0px 8px ${COLORS[index]})` : 'none',
                      opacity: activeIndex === -1 || activeIndex === index ? 1 : 0.6,
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {breakdown.map((item, idx) => {
            const Icon = item.icon;
            const percentage = ((item.value / totalBudget) * 100).toFixed(0);
            const isHoveredChart = activeIndex === idx;

            return (
              <div 
                key={idx}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(-1)}
                className={`bg-white p-5 rounded-2xl border-l-4 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col justify-between ${item.borderCls} ${isHoveredChart ? 'ring-2 ring-gray-200 shadow-md scale-[1.02]' : ''}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl ${item.bgCls}`}>
                    <Icon className={`w-6 h-6 ${item.colorCls}`} />
                  </div>
                  <div className={`px-2 py-1 rounded-md text-xs font-bold ${item.bgCls} ${item.colorCls}`}>
                    {percentage}%
                  </div>
                </div>
                <div>
                  <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-1">{item.name}</h3>
                  <p className="text-2xl font-black text-gray-900">{formatCurrency(item.value)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Box */}
      <div className="mt-10 bg-gray-100 rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row justify-between items-center gap-6 border border-gray-200">
        <div className="text-center lg:text-left">
          <p className="text-gray-500 font-medium mb-1">Total Estimated Budget</p>
          <div className="flex items-baseline justify-center lg:justify-start gap-2">
            <span className="text-3xl md:text-4xl font-black text-gray-900">{formatCurrency(totalBudget)}</span>
            <span className="text-gray-500 font-medium">for {numTravelers} travelers over {numDays} days</span>
          </div>
        </div>
        
        <div className="h-px w-full lg:h-16 lg:w-px bg-gray-300"></div>
        
        <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-200 text-center lg:text-left min-w-[200px]">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Per Person Per Day</p>
          <p className="text-2xl font-black text-orange-600">{formatCurrency(perPersonPerDay)}</p>
        </div>
      </div>
    </div>
  );
}
