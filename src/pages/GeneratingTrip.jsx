import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getChatSession, AI_PROMPT } from '../api/generateTrip';
import { db } from '../service/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { Loader2, Sparkles, Map, Hotel, Utensils, Plane, ShieldCheck, Globe } from 'lucide-react';

const LOADING_STEPS = [
  { icon: <Globe className="w-6 h-6 text-blue-400" />, text: "Analyzing global travel patterns..." },
  { icon: <ShieldCheck className="w-6 h-6 text-green-400" />, text: "Verifying safety and visa protocols..." },
  { icon: <Hotel className="w-6 h-6 text-purple-400" />, text: "Scouting premium hotel availability..." },
  { icon: <Utensils className="w-6 h-6 text-orange-400" />, text: "Curating local culinary experiences..." },
  { icon: <Plane className="w-6 h-6 text-sky-400" />, text: "Finding optimal flight routes..." },
  { icon: <Map className="w-6 h-6 text-emerald-400" />, text: "Designing your custom daily itinerary..." },
];

export default function GeneratingTrip() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!state?.tripParams) {
      navigate('/create-trip');
      return;
    }

    // Cycle through loading steps visually
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % LOADING_STEPS.length);
    }, 2500);

    generateTrip();

    return () => clearInterval(interval);
  }, []);

  const generateTrip = async () => {
    try {
      const { location, totalDays, budget, traveler } = state.tripParams;
      const user = JSON.parse(localStorage.getItem('user'));
      
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API Key is missing. Please check your environment configurations.");
      }
      
      const chatSession = getChatSession(apiKey);

      const FINAL_PROMPT = AI_PROMPT
        .replace('{location}', location)
        .replace('{totalDays}', totalDays)
        .replace('{traveler}', traveler)
        .replace('{budget}', budget);

      const result = await chatSession.generateContent(FINAL_PROMPT);
      let tripDataText = result.response.text();
      
      const regex = /\{[\s\S]*\}/;
      const match = tripDataText.match(regex);
      if (match) tripDataText = match[0];

      await saveToFirebase(JSON.parse(tripDataText), location, totalDays, budget, traveler, user);
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to generate trip. Please try again.");
    }
  };

  const saveToFirebase = async (tripData, location, totalDays, budget, traveler, user) => {
    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: { location, totalDays, budget, traveler },
      tripData: tripData,
      userEmail: user?.email || null, // Avoid undefined to prevent Firebase error
      id: docId
    });
    navigate('/view-trip/' + docId);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-5">
        <div className="text-center space-y-6 max-w-md">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <h2 className="text-red-500 font-bold text-xl mb-2">Generation Interrupted</h2>
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="text-center relative z-10 max-w-6xl px-10">
        <div className="mb-12 relative">
          <div className="w-24 h-24 bg-orange-500 rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.4)] animate-pulse">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -inset-4 border border-orange-500/20 rounded-full animate-spin-slow"></div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
          Crafting Your <span className="text-orange-500">Perfect Journey</span>
        </h1>
        <p className="text-gray-400 text-lg mb-12 font-medium">
          Our AI is weaving together a personalized itinerary for <span className="text-white font-bold">{state?.tripParams?.location?.split(',')[0] || 'your destination'}</span>
        </p>

        {/* Dynamic Status Steps */}
        <div className="space-y-6 relative mb-12">
           {LOADING_STEPS.map((step, index) => (
             <div 
               key={index}
               className={`flex items-center gap-4 transition-all duration-700 absolute left-1/2 -translate-x-1/2 w-full justify-center ${
                 index === currentStep ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
               }`}
             >
                <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-800 shadow-xl">
                  {step.icon}
                </div>
                <span className="text-xl font-bold tracking-wide">{step.text}</span>
             </div>
           ))}
        </div>

        {/* Progress Bar Container */}
        <div className="mt-20 w-full max-w-xl mx-auto h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
           <div className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,1)] animate-progress"></div>
        </div>
        
        <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-gray-500 animate-pulse">
          Please do not refresh this page
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 40%; transform: translateX(50%); }
          100% { width: 100%; transform: translateX(100%); }
        }
        .animate-progress {
          animation: progress 2s infinite ease-in-out;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
      `}} />
    </div>
  );
}
