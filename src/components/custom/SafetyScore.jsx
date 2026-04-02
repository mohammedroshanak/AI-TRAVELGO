import React from 'react';
import { ShieldCheck, Star, Activity, Plus, Shield, Moon, Eye, UserCheck } from 'lucide-react';

export default function SafetyScore({ data }) {
  if (!data) return null;

  const { overall, factors } = data;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars.push(<Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />);
        } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
            stars.push(<Star key={i} className="w-5 h-5 fill-yellow-500/30 text-yellow-500" />);
        } else {
            stars.push(<Star key={i} className="w-5 h-5 text-gray-700" />);
        }
    }
    return stars;
  };

  const factorConfigs = [
    { label: 'Crime Level', value: factors?.crime, icon: <Shield className="w-4 h-4" /> },
    { label: 'Travel Safety', value: factors?.travel, icon: <Activity className="w-4 h-4" /> },
    { label: 'Women Safety', value: factors?.women, icon: <UserCheck className="w-4 h-4" /> },
    { label: 'Night Safety', value: factors?.night, icon: <Moon className="w-4 h-4" /> },
  ];

  const getFactorColor = (val) => {
    if (val >= 4) return 'bg-emerald-500';
    if (val >= 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm transition-all hover:scale-[1.02] shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 shadow-lg animate-pulse">
          <ShieldCheck className="w-7 h-7 text-emerald-500" />
        </div>
        <div>
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500/70">Intelligence Signal</h3>
           <p className="text-xl font-black text-white">AI Safety Score</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8 bg-black/40 p-4 rounded-xl border border-white/5">
        <div className="text-3xl font-black text-white">{overall || '4.0'}</div>
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            {renderStars(overall || 4)}
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Global Safety Rating</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {factorConfigs.map((factor, index) => (
          <div key={index} className="space-y-2 p-3 bg-white/5 rounded-xl border border-white/5 group transition-colors hover:border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 flex items-center gap-2">
                {factor.icon} {factor.label}
              </span>
              <span className="text-xs font-black text-white">{factor.value || 4.0}/5</span>
            </div>
            <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
               <div 
                 className={`h-full ${getFactorColor(factor.value)} shadow-[0_0_8px_rgba(0,0,0,0.5)] transition-all duration-1000 group-hover:opacity-80`}
                 style={{ width: `${(factor.value / 5) * 100}%` }}
               ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
