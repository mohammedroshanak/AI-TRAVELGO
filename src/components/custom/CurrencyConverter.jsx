import React, { useState } from 'react';
import { conversionRates } from '../../utils/currency';
import { ArrowRightLeft, ChevronDown } from 'lucide-react';

function CurrencyConverter({ baseCurrency, onCurrencyChange }) {
  // Ensure we default to USD if base is missing or not in our map
  const initialCurrency = conversionRates[baseCurrency] ? 'USD' : 'EUR'; 
  const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency === baseCurrency ? 'EUR' : 'USD');

  const handleCurrencyChange = (e) => {
    const newCurr = e.target.value;
    setSelectedCurrency(newCurr);
    if (onCurrencyChange) {
      onCurrencyChange(newCurr);
    }
  };

  const availableCurrencies = Object.keys(conversionRates);

  const safeBaseCurrency = conversionRates[baseCurrency] ? baseCurrency : 'USD';
  const baseRate = conversionRates[safeBaseCurrency] || 1;
  const targetRate = conversionRates[selectedCurrency] || 1;
  const exchangeRate = (1 / baseRate) * targetRate;

  // Let the parent know initially if we have a default target
  React.useEffect(() => {
    if (onCurrencyChange && selectedCurrency) {
      onCurrencyChange(selectedCurrency);
    }
  }, []);

  return (
    <div className="mt-10 mb-5 pb-8 pt-4 px-8 bg-[#0a1120] border border-gray-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden group hover:border-orange-500/30 transition-all duration-500">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-all"></div>
      
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
        <div className="flex-1 text-center lg:text-left">
          <h2 className="font-black text-2xl text-white mb-2 flex items-center justify-center lg:justify-start gap-3">
            <ArrowRightLeft className="text-orange-500 w-6 h-6" />
            Currency Intelligence
          </h2>
          <p className="text-gray-400 font-medium">
            Instantly switch between <span className="text-orange-400 font-bold">{safeBaseCurrency}</span> and global currencies.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
          {/* Base Currency Display */}
          <div className="flex flex-col items-center gap-2 bg-gray-900/50 p-4 rounded-2xl border border-gray-800 w-full sm:w-32">
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">From</span>
             <span className="text-2xl font-black text-white">{safeBaseCurrency}</span>
          </div>

          <div className="hidden sm:block text-orange-500/30">
            <ArrowRightLeft className="w-8 h-8" />
          </div>

          {/* Target Currency Selector */}
          <div className="flex flex-col items-center gap-2 bg-gray-900/50 p-4 rounded-2xl border border-orange-500/30 w-full sm:w-48 shadow-[0_0_20px_rgba(249,115,22,0.1)] relative group/select">
             <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Convert To</span>
             <div className="relative w-full flex items-center justify-center">
               <select 
                 value={selectedCurrency} 
                 onChange={handleCurrencyChange}
                 className="bg-transparent text-white text-2xl font-black focus:outline-none cursor-pointer w-full text-center pr-8 hover:text-orange-400 transition-colors"
               >
                 {availableCurrencies.map(curr => (
                   <option key={curr} value={curr} className="bg-gray-900">{curr}</option>
                 ))}
               </select>
               <ChevronDown className="absolute right-0 w-5 h-5 text-orange-500 pointer-events-none group-hover/select:translate-y-0.5 transition-transform" />
             </div>
          </div>
        </div>

        {safeBaseCurrency !== selectedCurrency && (
          <div className="flex flex-col items-center lg:items-end gap-1 shrink-0">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Live Exchange Rate</p>
             <div className="text-3xl font-black text-white flex items-baseline gap-2">
                <span className="text-orange-500">1.00</span> 
                <span className="text-gray-500 text-sm font-bold">{safeBaseCurrency}</span>
                <span className="text-white">≈</span>
                <span className="text-orange-500">{exchangeRate.toFixed(2)}</span>
                <span className="text-gray-500 text-sm font-bold">{selectedCurrency}</span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CurrencyConverter;
