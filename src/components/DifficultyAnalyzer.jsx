import React from 'react';
import { Star, Shield, Info, Globe, HardHat, Plane, AlertCircle } from 'lucide-react';

const DifficultyAnalyzer = ({ destination, duration }) => {
  const detectDifficulty = (dest) => {
    const destLower = (dest || '').toLowerCase();

    const easyKws = ['thailand', 'singapore', 'dubai', 'bali', 'malaysia', 'turkey', 'vietnam'];
    const mediumKws = ['kerala', 'goa', 'india', 'mexico', 'costa rica', 'colombia'];
    const hardKws = ['nepal', 'indonesia', 'africa', 'central asia', 'afghanistan', 'pakistan'];

    if (easyKws.some(kw => destLower.includes(kw))) {
      return {
        level: 'EASY',
        score: 1.5,
        recommendation: "This is an excellent destination for first-time or solo travelers. Well-established infrastructure, easy visa process, and tourist-friendly environment make it ideal for worry-free travel planning.",
        factors: [
          { name: 'Language Barrier', level: 'Low', color: 'green', desc: 'English widely spoken, guides available' },
          { name: 'Infrastructure', level: 'Excellent', color: 'green', desc: 'Modern transport and high-speed internet' },
          { name: 'Visa Requirements', level: 'Easy', color: 'green', desc: 'Not needed or Visa on Arrival' },
          { name: 'Tourist Friendly', level: 'Very Yes', color: 'green', desc: 'Extremely popular and safe for tourists' }
        ],
        type: 'Perfect for beginners'
      };
    }

    if (hardKws.some(kw => destLower.includes(kw))) {
      return {
        level: 'HARD',
        score: 4.5,
        recommendation: "This destination requires significant travel experience and preparation. Limited tourist infrastructure, visa complexity, and language barriers are expected. Recommended for adventurous explorers only.",
        factors: [
          { name: 'Language Barrier', level: 'High', color: 'red', desc: 'Limited English, local dialect essential' },
          { name: 'Infrastructure', level: 'Basic', color: 'red', desc: 'Limited public transport, unstable utilities' },
          { name: 'Visa Requirements', level: 'Complex', color: 'red', desc: 'Advance application & embassy visits required' },
          { name: 'Tourist Friendly', level: 'Limited', color: 'red', desc: 'Less established tourist trails' }
        ],
        type: 'For adventurous travelers only'
      };
    }

    // Default to MEDIUM
    return {
      level: 'MEDIUM',
      score: 3,
      recommendation: "A good destination for experienced travelers. While infrastructure is developed and tourism is established, you'll need some travel experience to navigate language barriers and logistics.",
      factors: [
        { name: 'Language Barrier', level: 'Medium', color: 'yellow', desc: 'English spoken in tourist hubs only' },
        { name: 'Infrastructure', level: 'Good', color: 'yellow', desc: 'Decent connectivity, varying transport standards' },
        { name: 'Visa Requirements', level: 'Moderate', color: 'yellow', desc: 'Online application or simple E-Visa' },
        { name: 'Tourist Friendly', level: 'Moderately', color: 'yellow', desc: 'Well-known but requires some local knowledge' }
      ],
      type: 'Good for experienced travelers'
    };
  };

  const difficulty = detectDifficulty(destination);
  const stars = Math.round(difficulty.score);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mt-8 mb-8 font-sans">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
          📊 Trip Difficulty Analyzer
        </h2>
        <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
            />
          ))}
          <span className="text-xs font-bold text-gray-500 ml-2 uppercase tracking-wider">
            {difficulty.level} ({stars}/5)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {difficulty.factors.map((factor, idx) => (
          <div 
            key={idx} 
            className={`p-4 rounded-xl border-l-4 transition-all hover:shadow-md ${
              factor.color === 'green' ? 'bg-green-50 border-green-400' :
              factor.color === 'yellow' ? 'bg-yellow-50 border-yellow-400' :
              'bg-red-50 border-red-400'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2.5 h-2.5 rounded-full ${
                factor.color === 'green' ? 'bg-green-500' :
                factor.color === 'yellow' ? 'bg-yellow-500' :
                'bg-red-500'
              }`} />
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
                {factor.name}
              </h3>
            </div>
            <p className="text-xs font-bold text-gray-700 mb-1">{factor.level}</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              {factor.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
           <Info className="w-12 h-12" />
        </div>
        <p className="text-sm text-gray-700 font-medium leading-relaxed relative z-10">
          <span className="text-orange-600 font-bold block mb-1">💡 Travel Recommendation:</span>
          {difficulty.recommendation}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-[10px] font-black uppercase text-gray-500 shadow-sm">
            🎯 {difficulty.type}
          </span>
          <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-[10px] font-black uppercase text-gray-500 shadow-sm">
            ⏳ {duration || '?'} {difficulty.level.toLowerCase()} trip
          </span>
        </div>
      </div>
    </div>
  );
};

export default DifficultyAnalyzer;
