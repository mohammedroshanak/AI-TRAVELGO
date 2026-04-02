export const currencyMap = {
  'Dubai': { currency: 'AED', symbol: 'د.إ' },
  'United Arab Emirates': { currency: 'AED', symbol: 'د.إ' },
  'India': { currency: 'INR', symbol: '₹' },
  'USA': { currency: 'USD', symbol: '$' },
  'United States': { currency: 'USD', symbol: '$' },
  'Europe': { currency: 'EUR', symbol: '€' },
  'France': { currency: 'EUR', symbol: '€' },
  'Germany': { currency: 'EUR', symbol: '€' },
  'Italy': { currency: 'EUR', symbol: '€' },
  'Spain': { currency: 'EUR', symbol: '€' },
  'Japan': { currency: 'JPY', symbol: '¥' },
  'UK': { currency: 'GBP', symbol: '£' },
  'United Kingdom': { currency: 'GBP', symbol: '£' },
  'Australia': { currency: 'AUD', symbol: 'A$' },
  'Canada': { currency: 'CAD', symbol: 'C$' }
};

export const detectCurrency = (locationString) => {
  if (!locationString) return { currency: 'USD', symbol: '$' };
  
  for (const [key, value] of Object.entries(currencyMap)) {
    if (locationString.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  // Default fallback
  return { currency: 'USD', symbol: '$' };
}

// Fixed conversion rates against USD base
export const conversionRates = {
  'USD': 1,
  'INR': 83.5,
  'AED': 3.67,
  'EUR': 0.92,
  'JPY': 150.5,
  'GBP': 0.79,
  'AUD': 1.53,
  'CAD': 1.35
};

export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (amount === undefined || amount === null || isNaN(amount)) return amount;
  if (fromCurrency === toCurrency) return Number(amount).toFixed(2);
  
  const fromRate = conversionRates[fromCurrency] || 1;
  const toRate = conversionRates[toCurrency] || 1;

  // Convert amount to USD first, then to target currency
  const amountInUSD = amount / fromRate;
  const result = amountInUSD * toRate;
  
  return result.toFixed(2);
}

export const extractPriceValue = (priceString) => {
  if (!priceString) return 0;
  if (typeof priceString === 'number') return priceString;
  const match = priceString.match(/[\d,]+(\.\d+)?/);
  if (match) {
    return parseFloat(match[0].replace(/,/g, ''));
  }
  return 0;
}
