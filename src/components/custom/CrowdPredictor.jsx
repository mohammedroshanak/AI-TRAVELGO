import React from 'react';
import { Users, Info, Flame, Trees, Footprints } from 'lucide-react';

export default function CrowdPredictor({ data }) {
  if (!data) return null;

  const { level, description } = data;

  const getStatusConfig = (lvl) => {
    switch (lvl?.toLowerCase()) {
      case 'low':
        return {
          icon: <Trees className="w-6 h-6 text-emerald-400" />,
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/20',
          textColor: 'text-emerald-400',
          label: 'Low Crowd',
          indicator: '🟢'
        };
      case 'high':
        return {
          icon: <Flame className="w-6 h-6 text-red-400" />,
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
          textColor: 'text-red-400',
          label: 'High Crowd',
          indicator: '🔴'
        };
      case 'medium':
      default:
        return {
          icon: <Users className="w-6 h-6 text-yellow-400" />,
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20',
          textColor: 'text-yellow-400',
          label: 'Medium Crowd',
          indicator: '🟡'
        };
    }
  };

  const config = getStatusConfig(level);

  return (
    <div className={`p-6 rounded-2xl border ${config.borderColor} ${config.bgColor} backdrop-blur-sm transition-all hover:scale-[1.02] shadow-xl`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-900/50 rounded-lg">
            {config.icon}
          </div>
          <div>
            <h3 className="font-black uppercase tracking-widest text-xs text-gray-400">AI Crowd Prediction</h3>
            <p className={`text-xl font-black ${config.textColor}`}>{config.indicator} {config.label}</p>
          </div>
        </div>
        <div className="p-2 h-fit bg-white/5 rounded-full" title="Based on destination, month, and tourist season">
          <Info className="w-4 h-4 text-gray-500" />
        </div>
      </div>
      
      <p className="text-sm font-medium text-gray-300 leading-relaxed border-t border-white/5 pt-4">
        {description || "Our AI analysis suggests optimal times to visit to avoid major tourist peaks."}
      </p>

      <div className="mt-4 flex gap-2">
        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/10 text-gray-400">SEASONAL TRENDS</span>
        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/10 text-gray-400">LIVE ANALYSIS</span>
      </div>
    </div>
  );
}
