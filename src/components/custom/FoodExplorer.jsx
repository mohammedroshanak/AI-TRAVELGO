import React from 'react';
import { Utensils, Star, Soup, ChefHat, MapPin, Coffee, Pizza, Cake, Navigation } from 'lucide-react';

export default function FoodExplorer({ data }) {
  if (!data) return null;

  const { mustTry, recommendedRestaurants } = data;

  const getFoodIcon = (index) => {
    const icons = [<Soup className="w-4 h-4" />, <Pizza className="w-4 h-4" />, <Cake className="w-4 h-4" />, <Coffee className="w-4 h-4" />];
    return icons[index % icons.length];
  };

  return (
    <div className="space-y-8">
      {/* Must Try Foods */}
      <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
            <Utensils className="w-5 h-5 text-orange-500" />
          </div>
          <h3 className="text-xl font-black text-white">Local Delicacies Recommender</h3>
        </div>

        <div className="flex flex-wrap gap-3">
          {mustTry?.map((food, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-3 bg-gray-900/80 border border-gray-800 rounded-xl transition-all hover:border-orange-500/40 hover:scale-[1.05] cursor-default group">
               <span className="text-orange-500 group-hover:animate-bounce">{getFoodIcon(i)}</span>
               <span className="text-sm font-bold text-gray-200">{food}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Restaurants */}
      <div>
        <div className="flex items-center gap-3 mb-6">
           <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center border border-yellow-500/20">
             <ChefHat className="w-5 h-5 text-yellow-500" />
           </div>
           <h3 className="text-xl font-black text-white">Recommended Restaurants</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedRestaurants?.map((res, i) => (
            <div key={i} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5 hover:border-yellow-500/30 transition-all hover:-translate-y-1 group">
               <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                     <h4 className="font-black text-lg text-white group-hover:text-yellow-500 transition-colors">{res.name}</h4>
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{res.cuisine}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-lg border border-yellow-500/20">
                     <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                     <span className="text-xs font-black text-yellow-500">{res.rating}</span>
                  </div>
               </div>

               <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Top Rated Location
                  </span>
                  <div className="w-8 h-8 rounded-full bg-yellow-500/5 border border-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition-all">
                     <Navigation className="w-4 h-4 text-yellow-500" />
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
