import React, { useState, useEffect } from 'react'
import Header from '../components/custom/Header'
import { Button } from '../components/ui/button'

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app, db } from '../service/firebaseConfig';
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate } from 'react-router-dom';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

function CreateTrip() {
  const [place, setPlace] = useState('')
  const [days, setDays] = useState('')
  const [budget, setBudget] = useState('')
  const [travelers, setTravelers] = useState('')
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  
  const navigate = useNavigate();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const handleInputChange = (name, value) => {
    if (name === 'days' && value > 14) return;
    if (name === 'days' && value) {
      setDays(value)
    }
  }

  const SaveTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString();

    await setDoc(doc(db, "AITrips", docId), {
      userSelection: {
        location: place?.label,
        totalDays: days,
        budget: budget,
        traveler: travelers
      },
      tripData: JSON.parse(TripData),
      userEmail: user?.email,
      id: docId
    });

    setLoading(false);
    navigate('/view-trip/' + docId);
  }

  const OnGenerateTrip = async () => {
    if (!place || !days || !budget || !travelers) {
      alert("Please fill all details");
      return;
    }

    // AUTH GUARD: Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setOpenDialog(true);
      return;
    }

    navigate('/generating-trip', {
      state: {
        tripParams: {
          location: place?.label,
          totalDays: days,
          budget: budget,
          traveler: travelers
        }
      }
    });
  }

  const login = () => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem('user', JSON.stringify(result.user));
      setOpenDialog(false);
      OnGenerateTrip();
    }).catch(error => {
      console.error(error);
      alert("Google Sign-In Error: " + (error?.message || error));
    })
  }

  return (
    <div>
      <Header />
      <div className="px-5 sm:px-10 md:px-20 lg:px-24 mx-auto max-w-[1700px] mt-10 pb-20">
        <h2 className="font-bold text-3xl">Tell us your travel preferences</h2>
        <p className="mt-3 text-gray-400 text-xl">Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</p>
        
        <div className="mt-10 flex flex-col gap-9">
          <div>
            <h2 className="text-xl my-3 font-medium">What is your destination of choice?</h2>
            <GooglePlacesAutocomplete 
              apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
              selectProps={{
                place,
                onChange: (v) => { setPlace(v); console.log(v); },
                styles: {
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: 'transparent',
                    borderColor: '#374151',
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
                    backgroundColor: '#1f2937'
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

          <div>
            <h2 className="text-xl my-3 font-medium">How many days are you planning your trip?</h2>
            <input 
              type="number" 
              placeholder="Ex. 3" 
              className="border rounded-md p-3 w-full bg-transparent border-gray-700" 
              onChange={(e) => handleInputChange('days', e.target.value)}
            />
          </div>

          <div>
            <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
              {[
                { label: 'Cheap', emoji: '💵', desc: 'Stay conscious of costs' },
                { label: 'Moderate', emoji: '💰', desc: 'Keep cost on the average side' },
                { label: 'Luxury', emoji: '💸', desc: 'Dont worry about cost' }
              ].map((opt, idx) => (
                <div 
                  key={idx}
                  onClick={() => setBudget(opt.label)}
                  className={`cursor-pointer p-4 border rounded-lg hover:shadow-md hover:border-orange-500 transition-all ${budget === opt.label ? 'border-orange-500 shadow-md transform scale-105' : 'border-gray-700'}`}
                >
                  <h2 className="text-4xl">{opt.emoji}</h2>
                  <h2 className="font-bold text-lg mt-2">{opt.label}</h2>
                  <h2 className="text-sm text-gray-400">{opt.desc}</h2>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl my-3 font-medium">Who do you plan on traveling with?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
              {[
                { label: 'Just Me', emoji: '🧍', desc: 'A sole traveler in exploration' },
                { label: 'A Couple', emoji: '🥂', desc: 'Two travelers in tandem' },
                { label: 'Family', emoji: '👨‍👩‍👧', desc: 'A group of fun loving adventurers' },
              ].map((opt, idx) => (
                <div 
                  key={idx}
                  onClick={() => setTravelers(opt.label)}
                  className={`cursor-pointer p-4 border rounded-lg hover:shadow-md hover:border-orange-500 transition-all ${travelers === opt.label ? 'border-orange-500 shadow-md transform scale-105' : 'border-gray-700'}`}
                >
                  <h2 className="text-4xl">{opt.emoji}</h2>
                  <h2 className="font-bold text-lg mt-2">{opt.label}</h2>
                  <h2 className="text-sm text-gray-400">{opt.desc}</h2>
                </div>
              ))}
            </div>
          </div>
          
          <div className="my-10 flex justify-end">
             <Button 
               disabled={loading}
               onClick={OnGenerateTrip}
             >
               {loading ? 'Generating...' : 'Generate Trip'}
             </Button>
          </div>
        </div>

        {/* Simple Login Dialog */}
        {openDialog && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 p-8 rounded-xl max-w-md w-full m-4">
              <h2 className="text-2xl font-bold mb-4">Sign In with Google</h2>
              <p className="text-gray-400 mb-6">Sign in to the App with Google Authentication to securely save your trips and access them across devices.</p>
              <Button onClick={login} className="w-full flex items-center justify-center gap-4 py-6">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="google" className="h-6 w-6 bg-white rounded-full p-1" />
                Sign In With Google
              </Button>
              <Button variant="outline" onClick={() => setOpenDialog(false)} className="w-full mt-4 bg-transparent border border-gray-600 hover:bg-gray-800">
                Cancel
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default CreateTrip
