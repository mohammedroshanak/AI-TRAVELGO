import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/custom/Header';
import { Button } from '../components/ui/button';
import { getChatSession, getDestinationPrompt } from '../api/generateTrip';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app, db } from '../service/firebaseConfig';
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate } from 'react-router-dom';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { MapPin, Wallet, Calendar, Users, Heart, Loader2, Sparkles, Navigation, Globe2, IndianRupee } from 'lucide-react';

export default function BudgetDestination() {
  const [fromLocation, setFromLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('4-5 days');
  const [travelers, setTravelers] = useState(1);
  const [preference, setPreference] = useState('Adventure');
  
  const [destinations, setDestinations] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [generatingTripFor, setGeneratingTripFor] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [pendingDestination, setPendingDestination] = useState(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (destinations.length > 0 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [destinations]);

  const navigate = useNavigate();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const handleSearchDestinations = async () => {
    if (!budget || !travelers) {
      alert("Please enter at least your Budget and Number of Travelers.");
      return;
    }

    setLoadingSearch(true);
    setDestinations([]);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API Key is missing. Please check your environment configurations.");
      }
      
      const chatSession = getChatSession(apiKey);
      const prompt = getDestinationPrompt(fromLocation, budget, duration, travelers, preference);

      const result = await chatSession.generateContent(prompt);
      let text = result.response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/); // Match array
      if (jsonMatch) text = jsonMatch[0];

      const data = JSON.parse(text);
      if (Array.isArray(data) && data.length > 0) {
        setDestinations(data);
      } else if (data.destinations) { // Fallback if AI wraps it
        setDestinations(data.destinations);
      } else {
        throw new Error("Invalid format received");
      }
    } catch (e) {
      console.error("Gemini Error:", e);
      alert("Failed to generate destinations. Please verify your API Key quota.");
    } finally {
      setLoadingSearch(false);
    }
  };

  const SaveTrip = async (TripDataText, destination) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString();

    // Mapping dropdown values back to format expected by ViewTrip components
    let mappedBudget = 'Moderate';
    if (preference === 'Budget Friendly') mappedBudget = 'Cheap';
    if (preference === 'Luxury') mappedBudget = 'Luxury';
    
    const totalDaysNum = duration.match(/\d+/)?.[0] || '3';

    await setDoc(doc(db, "AITrips", docId), {
      userSelection: {
        location: `${destination.destinationName}, ${destination.country}`,
        totalDays: totalDaysNum,
        budget: mappedBudget,
        traveler: travelers.toString()
      },
      tripData: JSON.parse(TripDataText),
      userEmail: user?.email,
      id: docId
    });

    navigate('/view-trip/' + docId);
  };

  const handleGenerateTrip = async (destination) => {
    setGeneratingTripFor(destination.destinationName);
    
    // allow paint for the loading spinner
    await new Promise(resolve => setTimeout(resolve, 50));

    let pseudoBudgetTier = 'Moderate';
    if (preference === 'Budget Friendly') pseudoBudgetTier = 'Cheap';
    if (preference === 'Luxury') pseudoBudgetTier = 'Luxury';

    navigate('/generating-trip', {
      state: {
        tripParams: {
          location: `${destination.destinationName}, ${destination.country}`,
          totalDays: duration?.match(/\d+/)?.[0] || '3',
          traveler: travelers || '1',
          budget: pseudoBudgetTier
        }
      }
    });
  };

  const login = () => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem('user', JSON.stringify(result.user));
      setOpenDialog(false);
      if (pendingDestination) {
        handleGenerateTrip(pendingDestination);
        setPendingDestination(null);
      }
    }).catch(error => {
      console.error(error);
      alert("Google Sign-In Error: " + (error?.message || error));
    })
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <Header />
      
      <div className="max-w-[1700px] mx-auto px-5 py-10">
        {/* Header section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 flex justify-center items-center gap-4">
            <span className="text-orange-500">💰</span> Find Travel Destinations Within Your Budget
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Tell us how much you want to spend, and our AI will suggest the perfect destinations you can actually afford!
          </p>
        </div>

        {/* Input form card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 w-full max-w-[1600px] mx-auto shadow-2xl mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* From Location */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" /> From Location (Optional)
              </label>
              <GooglePlacesAutocomplete 
                apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                selectProps={{
                  value: fromLocation,
                  onChange: (v) => setFromLocation(v),
                  placeholder: "Where are you traveling from?",
                  styles: {
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: 'black',
                      borderColor: '#374151',
                      borderRadius: '12px',
                      padding: '4px',
                      color: 'white'
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: 'white'
                    }),
                    input: (provided) => ({
                      ...provided,
                      color: 'white'
                    }),
                    menu: (provided) => ({
                      ...provided,
                      backgroundColor: '#111827',
                      zIndex: 50
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isFocused ? '#374151' : 'transparent',
                      color: 'white'
                    })
                  }
                }}
              />
            </div>

            {/* Total Budget */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-orange-500" /> Total Budget (₹)
              </label>
              <input 
                type="number" 
                value={budget}
                onChange={e => setBudget(e.target.value)}
                placeholder="Enter total travel budget"
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-bold"
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" /> Trip Duration
              </label>
              <select 
                value={duration} 
                onChange={e => setDuration(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:outline-none appearance-none"
              >
                <option value="2-3 days">2–3 days</option>
                <option value="4-5 days">4–5 days</option>
                <option value="6-7 days">6–7 days</option>
                <option value="8+ days">8+ days</option>
              </select>
            </div>

            {/* Travelers */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-500" /> Travelers
              </label>
              <input 
                type="number" 
                min="1"
                value={travelers}
                onChange={e => setTravelers(e.target.value)}
                placeholder="e.g. 2"
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>

            {/* Preference */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                <Heart className="w-4 h-4 text-orange-500" /> Travel Preference
              </label>
              <select 
                value={preference} 
                onChange={e => setPreference(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:outline-none appearance-none"
              >
                <option value="Adventure">Adventure</option>
                <option value="Beach">Beach</option>
                <option value="Nature">Nature</option>
                <option value="Cultural">Cultural</option>
                <option value="Luxury">Luxury</option>
                <option value="Budget Friendly">Budget Friendly</option>
              </select>
            </div>
            
          </div>

          <div className="mt-8 flex justify-center">
            <Button 
              onClick={handleSearchDestinations}
              disabled={loadingSearch}
              className="px-10 py-6 text-lg rounded-full bg-orange-500 hover:bg-orange-600 font-bold transition-all shadow-lg hover:shadow-orange-500/50 flex flex-col md:flex-row gap-2 w-full md:w-auto"
            >
              {loadingSearch ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> AI is finding the best destinations for your budget...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> ✨ Generate Destinations</>
              )}
            </Button>
          </div>
        </div>

        {/* Results grid */}
        {destinations.length > 0 && (
          <div ref={resultsRef} className="animate-in fade-in slide-in-from-bottom-10 duration-700 pt-10">
            <h2 className="text-3xl font-black text-center mb-10 border-b border-gray-800 pb-4">
              AI Suggested Destinations
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((dest, i) => (
                <div key={i} className="bg-white text-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col group border border-gray-200">
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                          {dest.destinationName}
                        </h3>
                        <p className="text-gray-500 font-bold uppercase tracking-wider text-sm flex items-center gap-1 mt-1">
                          <Globe2 className="w-4 h-4" /> {dest.country}
                        </p>
                      </div>
                      <div className="bg-orange-100 text-orange-700 font-black px-3 py-1.5 rounded-lg text-sm border border-orange-200 text-right">
                        {dest.estimatedCost}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 flex-1 leading-relaxed mb-6 font-medium">
                      {dest.shortDescription}
                    </p>
                    
                    <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex gap-3 items-center">
                        <Sparkles className="w-5 h-5 text-purple-500 shrink-0" />
                        <span className="text-sm font-bold text-gray-700">{dest.topHighlight}</span>
                      </div>
                      <div className="flex gap-3 items-center">
                        <Calendar className="w-5 h-5 text-blue-500 shrink-0" />
                        <span className="text-sm font-bold text-gray-700">Best: {dest.bestTravelTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <Button 
                      onClick={() => handleGenerateTrip(dest)}
                      disabled={generatingTripFor === dest.destinationName}
                      className="w-full bg-gray-900 hover:bg-black text-white py-6 rounded-xl font-bold flex gap-2 overflow-hidden relative group/btn"
                    >
                      {generatingTripFor === dest.destinationName ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Generating Full Plan...</>
                      ) : (
                        <><Navigation className="w-5 h-5 text-orange-400 group-hover/btn:translate-x-1 transition-transform" /> Generate Full Trip Plan</>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Auth Dialog */}
      {openDialog && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 p-8 rounded-xl max-w-md w-full m-4">
            <h2 className="text-2xl font-bold mb-4">Sign In with Google</h2>
            <p className="text-gray-400 mb-6">Sign in to securely generate and save your AI travel itinerary.</p>
            <Button onClick={login} className="w-full flex items-center justify-center gap-4 py-6 bg-white text-black hover:bg-gray-200">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="google" className="h-6 w-6" />
              Sign In With Google
            </Button>
            <Button variant="outline" onClick={() => setOpenDialog(false)} className="w-full mt-4 bg-transparent border border-gray-600 hover:bg-gray-800 text-white">
              Cancel
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
