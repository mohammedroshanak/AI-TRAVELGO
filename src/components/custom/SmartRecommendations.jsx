import React from 'react';
import { ShoppingBag, Utensils, Star, Trophy, Sparkles, Zap } from 'lucide-react';

export default function SmartRecommendations({ recommendations }) {
  if (!recommendations) return null;

  const { shopping, localDelicacies, experienceScores } = recommendations;

  const ScoreBar = ({ label, score, color }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-xs font-black uppercase tracking-widest text-gray-400">{label}</span>
        <span className="text-lg font-black text-white">{score}/10</span>
      </div>
      <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
          style={{ width: `${score * 10}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      
      {/* Experience Metrics */}
      <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 text-purple-500/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
           <Trophy size={120} />
        </div>
        <h3 className="text-xl font-black mb-8 flex items-center gap-3 relative z-10">
          <Zap className="text-yellow-400 w-6 h-6" />
          Vibe Check
        </h3>
        <div className="space-y-6 relative z-10">
          <ScoreBar label="Nightlife" score={experienceScores?.nightlife || 5} color="bg-purple-500" />
          <ScoreBar label="Culture" score={experienceScores?.culture || 5} color="bg-blue-500" />
          <ScoreBar label="Relaxation" score={experienceScores?.relaxation || 5} color="bg-teal-500" />
          <ScoreBar label="Adventure" score={experienceScores?.adventure || 5} color="bg-orange-500" />
        </div>
      </div>

      {/* Shopping & Souvenirs */}
      <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 group">
        <h3 className="text-xl font-black mb-8 flex items-center gap-3">
          <ShoppingBag className="text-orange-500 w-6 h-6" />
          Smart Shopping Guide
        </h3>
        <div className="space-y-6">
          {shopping?.map((item, idx) => (
            <div key={idx} className="bg-black/40 p-5 rounded-2xl border border-gray-800/50 hover:border-orange-500/30 transition-colors">
              <h4 className="font-black text-orange-400 mb-1 flex items-center gap-2">
                <Star className="w-4 h-4 fill-orange-400" />
                {item.item}
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">
                {item.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Local Delicacies */}
      <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 group">
        <h3 className="text-xl font-black mb-8 flex items-center gap-3">
          <Utensils className="text-green-500 w-6 h-6" />
          Must-Try Delicacies
        </h3>
        <div className="space-y-6">
          {localDelicacies?.map((food, idx) => (
            <div key={idx} className="bg-black/40 p-5 rounded-2xl border border-gray-800/50 hover:border-green-500/30 transition-colors">
              <h4 className="font-black text-green-400 mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {food.food}
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">
                {food.description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
