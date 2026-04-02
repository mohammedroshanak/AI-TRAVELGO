import React, { useState, useCallback } from 'react';
import { ArrowRightLeft, Check, Minus, Trophy, HelpCircle } from 'lucide-react';

const ComparisonTool = ({ trips }) => {
  const [selectedTrip1, setSelectedTrip1] = useState(trips[0]?.id || '');
  const [selectedTrip2, setSelectedTrip2] = useState(trips[1]?.id || '');
  const [showComparison, setShowComparison] = useState(false);

  const getTripById = (id) => trips.find(t => t.id === id);

  const calculateCost = (budget, duration, travelers) => {
    const rates = {
      'Cheap': 15000,
      'Moderate': 30000,
      'Standard': 30000,
      'Luxury': 60000
    };
    const rate = rates[budget] || 30000;
    const dur = parseInt(duration) || 1;
    const trav = parseInt(travelers) || 1;
    return rate * dur * trav;
  };

  const getDifficulty = (dest) => {
    const destLower = (dest || '').toLowerCase();
    const easyKws = ['thailand', 'singapore', 'dubai', 'bali', 'malaysia', 'turkey', 'vietnam'];
    const hardKws = ['nepal', 'indonesia', 'africa', 'central asia', 'afghanistan', 'pakistan'];

    if (easyKws.some(kw => destLower.includes(kw))) return { label: 'Easy', score: 1 };
    if (hardKws.some(kw => destLower.includes(kw))) return { label: 'Hard', score: 3 };
    return { label: 'Medium', score: 2 };
  };

  const handleCompare = () => {
    if (selectedTrip1 && selectedTrip2 && selectedTrip1 !== selectedTrip2) {
      setShowComparison(true);
    } else {
      alert("Please select two different trips to compare.");
    }
  };

  if (trips.length < 2) {
    return (
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl text-center mb-10">
        <p className="text-gray-400">Create at least 2 trips to use the Comparison Tool!</p>
      </div>
    );
  }

  const trip1 = getTripById(selectedTrip1);
  const trip2 = getTripById(selectedTrip2);

  if (showComparison && trip1 && trip2) {
    const cost1 = calculateCost(trip1.userSelection.budget, trip1.userSelection.totalDays, trip1.userSelection.traveler);
    const cost2 = calculateCost(trip2.userSelection.budget, trip2.userSelection.totalDays, trip2.userSelection.traveler);
    const diff1 = getDifficulty(trip1.userSelection.location);
    const diff2 = getDifficulty(trip2.userSelection.location);

    let points1 = 0;
    let points2 = 0;

    if (parseInt(trip1.userSelection.totalDays) < parseInt(trip2.userSelection.totalDays)) points1++;
    else if (parseInt(trip1.userSelection.totalDays) > parseInt(trip2.userSelection.totalDays)) points2++;

    if (cost1 < cost2) points1++;
    else if (cost1 > cost2) points2++;

    if (diff1.score < diff2.score) points1++;
    else if (diff1.score > diff2.score) points2++;

    const winner = points1 > points2 ? trip1 : points2 > points1 ? trip2 : null;

    const rows = [
      { field: 'DESTINATION', val1: trip1.userSelection.location, val2: trip2.userSelection.location, better: null },
      { field: 'DURATION', val1: `${trip1.userSelection.totalDays} Days`, val2: `${trip2.userSelection.totalDays} Days`, better: parseInt(trip1.userSelection.totalDays) < parseInt(trip2.userSelection.totalDays) ? 1 : 2 },
      { field: 'BUDGET TYPE', val1: trip1.userSelection.budget, val2: trip2.userSelection.budget, better: (trip1.userSelection.budget === 'Cheap' && trip2.userSelection.budget !== 'Cheap') ? 1 : (trip2.userSelection.budget === 'Cheap' && trip1.userSelection.budget !== 'Cheap') ? 2 : null },
      { field: 'TRAVELERS', val1: trip1.userSelection.traveler, val2: trip2.userSelection.traveler, better: null },
      { field: 'EST. COST', val1: `₹${cost1.toLocaleString('en-IN')}`, val2: `₹${cost2.toLocaleString('en-IN')}`, better: cost1 < cost2 ? 1 : 2 },
      { field: 'DIFFICULTY', val1: diff1.label, val2: diff2.label, better: diff1.score < diff2.score ? 1 : 2 },
      { field: 'TRAVEL STYLE', val1: trip1.userSelection.budget, val2: trip2.userSelection.budget, better: null },
      { field: 'RECOMMENDATION', val1: diff1.score === 1 ? 'Beginner Friendly' : 'Explorer Mode', val2: diff2.score === 1 ? 'Beginner Friendly' : 'Explorer Mode', better: null }
    ];

    return (
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden mb-12 animate-in fade-in zoom-in duration-500 font-sans text-gray-900">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 flex justify-between items-center">
            <h2 className="text-white text-xl font-black flex items-center gap-2">
              <ArrowRightLeft className="w-6 h-6" /> Comparison Breakdown
            </h2>
            <button 
              onClick={() => setShowComparison(false)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-colors border border-white/10"
            >
              Compare Again
            </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-black uppercase tracking-widest text-[10px] text-gray-500">Feature</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px] text-orange-600">{trip1.userSelection.location.split(',')[0]}</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px] text-blue-600">{trip2.userSelection.location.split(',')[0]}</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px] text-gray-500">Advantage</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="p-4 text-xs font-bold text-gray-500">{row.field}</td>
                  <td className={`p-4 text-sm font-medium ${row.better === 1 ? 'text-gray-900' : 'text-gray-500'}`}>{row.val1}</td>
                  <td className={`p-4 text-sm font-medium ${row.better === 2 ? 'text-gray-900' : 'text-gray-500'}`}>{row.val2}</td>
                  <td className="p-4">
                    {row.better ? (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${row.better === 1 ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                        <Check className="w-4 h-4" />
                      </div>
                    ) : (
                      <Minus className="w-4 h-4 text-gray-300" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
           {winner ? (
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                   <p className="text-xs font-black uppercase tracking-widest text-gray-400">Winning Choice</p>
                   <h3 className="text-lg font-black text-gray-900">{winner.userSelection.location}</h3>
                </div>
             </div>
           ) : (
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-2xl flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-black text-gray-900">It's a Tie!</h3>
             </div>
           )}

           <div className="text-right">
              <p className="text-xs text-gray-500 font-medium">Based on value, duration, and accessibility scores.</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 p-8 rounded-3xl mb-12 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-8">
          <ArrowRightLeft className="text-orange-500 w-8 h-8" /> Compare Your Trips
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Select First Trip</label>
            <select 
              value={selectedTrip1} 
              onChange={(e) => setSelectedTrip1(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-4 text-white focus:border-orange-500 focus:outline-none appearance-none transition-all"
            >
              {trips.map(t => (
                <option key={t.id} value={t.id}>{t.userSelection.location} - {t.userSelection.totalDays} Days</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Select Second Trip</label>
            <select 
              value={selectedTrip2} 
              onChange={(e) => setSelectedTrip2(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-4 text-white focus:border-orange-500 focus:outline-none appearance-none transition-all"
            >
              {trips.map(t => (
                <option key={t.id} value={t.id}>{t.userSelection.location} - {t.userSelection.totalDays} Days</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <button 
            onClick={handleCompare}
            disabled={selectedTrip1 === selectedTrip2}
            className="bg-orange-600 hover:bg-orange-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-black px-12 py-4 rounded-2xl shadow-xl shadow-orange-600/20 transition-all active:scale-95 flex items-center gap-2"
          >
            Compare Adventures
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTool;
