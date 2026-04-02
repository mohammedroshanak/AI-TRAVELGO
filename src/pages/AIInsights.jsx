import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../service/firebaseConfig';
import Header from '../components/custom/Header';
import DifficultyAnalyzer from '../components/DifficultyAnalyzer';
import BudgetOptimizer from '../components/BudgetOptimizer';
import PackingListGenerator from '../components/custom/PackingListGenerator';
import SmartRecommendations from '../components/custom/SmartRecommendations';
import CrowdPredictor from '../components/custom/CrowdPredictor';
import SafetyScore from '../components/custom/SafetyScore';
import FoodExplorer from '../components/custom/FoodExplorer';
import { ArrowLeft, BrainCircuit, Sparkles, TrendingUp, Lightbulb, ShieldCheck, Utensils } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function AIInsights() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripId && GetTripData();
  }, [tripId]);

  const GetTripData = async () => {
    try {
      setLoading(true);
      
      // If in mock mode, use the local mock data to ensure all new features are testable
      if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const { MOCK_TRIP_DATA } = await import('../mock/mockTripData.js');
        // Simulate a tiny delay for realism
        await new Promise(r => setTimeout(r, 500));
        setTrip({
          userSelection: { location: 'Dubai, UAE', totalDays: '5', budget: 'Luxury', traveler: '2 People' },
          tripData: MOCK_TRIP_DATA
        });
        setLoading(false);
        return;
      }

      const docRef = doc(db, 'AITrips', tripId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTrip(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (e) {
      console.error("AI Insights Data Error:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
     return (
       <div className="min-h-screen bg-black flex items-center justify-center">
         <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
       </div>
     );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-[#020817] text-white">
        <Header />
        <div className="flex flex-col items-center justify-center h-[70vh] gap-6 px-5 text-center">
          <div className="bg-red-500/10 p-6 rounded-3xl border border-red-500/20">
            <h2 className="text-2xl font-bold text-red-500 mb-2">Trip Not Found</h2>
            <p className="text-gray-400">We couldn't retrieve the details for this journey. Please try again or go back to your trips.</p>
          </div>
          <Button onClick={() => navigate('/my-trips')} className="bg-orange-500 hover:bg-orange-600">
            Go to My Trips
          </Button>
        </div>
      </div>
    );
  }

  const locationName = trip?.userSelection?.location;
  const smartRecs = trip?.tripData?.smartRecommendations;

  return (
    <div className="min-h-screen bg-[#020817] text-white pb-20 font-sans">
      <Header />
      
      <div className="max-w-[1600px] mx-auto px-5 pt-10">
        {/* Navigation & Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Trip Details
            </button>
            <h1 className="text-4xl md:text-5xl font-black flex items-center gap-4">
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">Advanced AI Insights</span>
            </h1>
            <p className="text-gray-400 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" /> 
              Deep analytical breakdown for your journey to <span className="text-white font-bold">{locationName}</span>
            </p>
          </div>
          
          <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-2xl flex items-center gap-4">
             <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
               <BrainCircuit className="text-white w-7 h-7" />
             </div>
             <div>
                <p className="text-xs font-black uppercase tracking-widest text-purple-400">AI Intelligence Core</p>
                <p className="text-sm font-bold text-gray-300">Analysis Active</p>
             </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="space-y-20">
          
          {/* Section: Expert Intelligence */}
          <section className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
             <div className="flex items-center gap-3 mb-8">
               <div className="w-1.5 h-8 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.4)]"></div>
               <h2 className="text-2xl font-black uppercase tracking-tight">Expert Intelligence</h2>
             </div>
             
             {/* Top Grid: Crowd & Safety */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <CrowdPredictor data={smartRecs?.crowdPredictor} />
                <SafetyScore data={smartRecs?.safetyScore} />
             </div>

             {/* Smart Recommendations Section */}
             <div className="mb-16">
                <SmartRecommendations recommendations={smartRecs} />
             </div>

             {/* Food Section (Expanded) */}
             <div className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                   <Utensils className="w-5 h-5 text-yellow-400" />
                   <h3 className="text-lg font-black uppercase tracking-widest text-gray-300">Culinary Intelligence</h3>
                </div>
                <FoodExplorer data={smartRecs?.foodExplorer} />
             </div>
          </section>

          {/* Section: Diagnostics */}
          <section className="space-y-16 pt-16 border-t border-white/5">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-1.5 h-8 bg-purple-500 rounded-full"></div>
                      <h2 className="text-xl font-black uppercase tracking-tight">Difficulty Matrix</h2>
                   </div>
                   <DifficultyAnalyzer 
                     destination={locationName} 
                     duration={trip?.userSelection?.totalDays} 
                   />
                </div>

                <div>
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-1.5 h-8 bg-blue-500 rounded-full"></div>
                      <h2 className="text-xl font-black uppercase tracking-tight">Budget Optimization</h2>
                   </div>
                   <BudgetOptimizer 
                     destination={locationName}
                     duration={trip?.userSelection?.totalDays}
                     travelers={trip?.userSelection?.traveler}
                     budgetTier={trip?.userSelection?.budget}
                   />
                </div>
             </div>

             {/* Full-Width Packing List */}
             <div>
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-1.5 h-8 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.3)]"></div>
                   <h2 className="text-xl font-black uppercase tracking-tight">Smart Logistics & Packing List</h2>
                </div>
                <PackingListGenerator 
                  tripId={tripId} 
                  destination={locationName} 
                  totalDays={trip?.userSelection?.totalDays} 
                />
             </div>
          </section>

        </div>

        {/* Footer Note */}
        <div className="mt-20 text-center py-10 border-t border-gray-800">
           <p className="text-gray-500 text-sm italic font-medium">
             Analyzed using Gemini 1.5 Flash • Real-time Safety & Crowd Intelligence Active
           </p>
        </div>
      </div>
    </div>
  );
}
