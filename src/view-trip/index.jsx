import React, { useEffect, useState } from 'react'
import Header from '../components/custom/Header'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../service/firebaseConfig'
import { 
  MapPin, 
  Wallet, 
  Calendar, 
  Users, 
  Map, 
  Clock, 
  Banknote, 
  Navigation, 
  BrainCircuit, 
  Sparkles 
} from 'lucide-react'
import WeatherIntelligence from '../components/custom/WeatherIntelligence'
import CurrencyConverter from '../components/custom/CurrencyConverter'
import { detectCurrency, extractPriceValue, convertCurrency } from '../utils/currency'

function ViewTrip() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [targetCurrency, setTargetCurrency] = useState(null)

  useEffect(() => {
    tripId && GetTripData()
  }, [tripId])

  const GetTripData = async () => {
    const docRef = doc(db, 'AITrips', tripId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      setTrip(docSnap.data())
    } else {
      console.log("No such document!")
    }
  }

  if(!trip) return (
    <div>
      <Header />
      <div className="flex flex-col h-[80vh] items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-medium animate-pulse">Loading amazing journey...</p>
      </div>
    </div>
  )

  const locationName = trip?.userSelection?.location;
  const baseCurrencyInfo = trip?.tripData?.currencyInfo || detectCurrency(locationName);
  const baseCurrency = baseCurrencyInfo?.currency || 'USD';

  const renderPrice = (originalPriceStr) => {
    if (!originalPriceStr) return 'N/A';
    // If it's a number passing as string
    if (!targetCurrency || targetCurrency === baseCurrency) return <span className="text-orange-500 font-bold">{originalPriceStr}</span>;

    const val = extractPriceValue(originalPriceStr);
    if (!val) return <span className="text-orange-500 font-bold">{originalPriceStr}</span>;

    const converted = convertCurrency(val, baseCurrency, targetCurrency);
    
    return (
      <span className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 mt-1">
        <span className="text-orange-500 font-bold">{originalPriceStr}</span>
        <span className="text-xs text-orange-200/90 bg-orange-900/40 px-2 py-0.5 rounded border border-orange-500/30 w-fit whitespace-nowrap">~ {converted} {targetCurrency}</span>
      </span>
    );
  }

  // Calculate estimated budget
  const calculateTotalBudget = () => {
    if (!trip?.tripData?.estimatedCosts) return null;
    const costs = trip.tripData.estimatedCosts;
    const totalDays = trip.userSelection?.totalDays || 3; // Default 3 if missing
    const travelerStr = String(trip.userSelection?.traveler || '1');
    const travelerCount = parseInt(travelerStr.match(/\d+/)?.[0] || '1', 10);
    const total = (costs.totalFlights || 0) + ((costs.dailyFoodPerPerson || 0) * totalDays * travelerCount) + ((costs.transportationPerDay || 0) * totalDays) + (costs.totalActivities || 0);
    return renderPrice(`${total} ${baseCurrency}`);
  }

   return (
    <div className="bg-black min-h-screen text-white pb-20 selection:bg-orange-500/30 font-sans">
      <Header />
      
      {/* Hero Header */}
      <div className="w-full h-[40vh] md:h-[55vh] relative overflow-hidden flex items-end">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
        <div className="absolute inset-0 z-0 bg-gray-900 animate-pulse"></div>
        <img 
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3" 
          alt={locationName} 
          className="absolute inset-0 w-full h-full object-cover z-0" 
        />
        <div className="w-full z-20 pb-10 sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5">
          <div className="inline-block px-3 py-1 bg-orange-500 text-white font-bold text-xs uppercase tracking-widest rounded-md mb-4 shadow-lg shadow-orange-500/20">
            Exclusive Destination
          </div>
          <h1 className="text-5xl md:text-7xl font-black drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] tracking-tight mb-2 text-white leading-tight">
            {locationName?.split(',')[0]}
          </h1>
          <p className="text-gray-200 text-lg md:text-2xl font-medium max-w-2xl drop-shadow-md pb-6 flex items-center gap-2">
            <MapPin className="text-orange-500 w-5 h-5 hidden sm:inline" />
            {locationName}
          </p>
          
          <div className="flex flex-wrap gap-3">
             <div className="px-5 py-2.5 bg-black/60 backdrop-blur-md text-white rounded-full text-sm font-medium flex items-center gap-2 border border-white/10 shadow-xl hover:bg-black/80 transition-colors">
               <Calendar className="w-4 h-4 text-orange-400" /> {trip?.userSelection?.totalDays} Days
             </div>
             <div className="px-5 py-2.5 bg-black/60 backdrop-blur-md text-white rounded-full text-sm font-medium flex items-center gap-2 border border-white/10 shadow-xl hover:bg-black/80 transition-colors">
               <Wallet className="w-4 h-4 text-orange-400" /> {trip?.userSelection?.budget} Budget
             </div>
             <div className="px-5 py-2.5 bg-black/60 backdrop-blur-md text-white rounded-full text-sm font-medium flex items-center gap-2 border border-white/10 shadow-xl hover:bg-black/80 transition-colors">
               <Users className="w-4 h-4 text-orange-400" /> {trip?.userSelection?.traveler}
             </div>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-10 md:px-16 lg:px-24 max-w-[1920px] mx-auto -mt-8 relative z-30">
        
        {/* Intelligence Section (Weather & Currency) */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <WeatherIntelligence location={locationName} />
          <div className="flex flex-col pt-10">
            <CurrencyConverter 
              baseCurrency={baseCurrency} 
              onCurrencyChange={setTargetCurrency} 
            />
          </div>
        </div>
        
        {/* Advanced AI Insights Button */}
        <div className="mb-20">
           <Link to={`/trip-ai-insights/${tripId}`}>
             <div className="group relative bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-1 shadow-[0_0_30px_rgba(147,51,234,0.3)] hover:shadow-[0_0_50px_rgba(147,51,234,0.5)] transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="bg-[#020817]/40 backdrop-blur-xl rounded-[22px] px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-8 h-full relative z-10">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                         <BrainCircuit className="text-white w-8 h-8" />
                      </div>
                      <div>
                         <h2 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase tracking-tight">Advanced AI Insights</h2>
                         <p className="text-purple-200/60 font-medium text-sm md:text-lg">View smart budget breakdown, packing list, and travel difficulty matrix.</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 bg-white/10 px-6 py-4 rounded-2xl hover:bg-white/20 transition-colors border border-white/5">
                      <span className="font-black text-white px-2">ANALYZE NOW</span>
                      <Sparkles className="text-yellow-400 w-5 h-5 animate-pulse" />
                   </div>
                </div>
             </div>
           </Link>
        </div>

        {/* Estimated Budget Summary */}
        {trip?.tripData?.estimatedCosts && (
          <div className="mb-16 bg-gradient-to-br from-gray-900 via-gray-900/90 to-black p-8 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden group hover:border-orange-500/30 transition-colors duration-500">
             <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors duration-500"></div>
             
             <h2 className="font-bold text-3xl mb-8 flex items-center gap-3 relative z-10 text-white">
               <Banknote className="text-orange-500 w-8 h-8" />
               Estimated Budget Summary
             </h2>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-800/50 hover:border-gray-600 transition-colors">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">🛫 Flights</p>
                  <p className="text-xl font-bold text-white">{renderPrice(`${trip.tripData.estimatedCosts.totalFlights} ${baseCurrency}`)}</p>
                </div>
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-800/50 hover:border-gray-600 transition-colors">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">🍔 Daily Food</p>
                  <p className="text-xl font-bold text-white">{renderPrice(`${trip.tripData.estimatedCosts.dailyFoodPerPerson} ${baseCurrency}`)} /person</p>
                </div>
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-800/50 hover:border-gray-600 transition-colors">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">🚕 Transport</p>
                  <p className="text-xl font-bold text-white">{renderPrice(`${trip.tripData.estimatedCosts.transportationPerDay} ${baseCurrency}`)} /day</p>
                </div>
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-800/50 hover:border-gray-600 transition-colors">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">🎟️ Activities</p>
                  <p className="text-xl font-bold text-white">{renderPrice(`${trip.tripData.estimatedCosts.totalActivities} ${baseCurrency}`)}</p>
                </div>
             </div>
             <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gradient-to-r from-orange-500/20 to-orange-500/5 border border-orange-500/30 rounded-2xl relative z-10">
               <span className="text-orange-200/80 font-medium uppercase tracking-widest text-sm mb-2 md:mb-0">Estimated Total Journey Cost</span>
               <span className="text-4xl md:text-5xl font-black text-white drop-shadow-md">{calculateTotalBudget()}</span>
             </div>
          </div>
        )}

        {/* Hotels Section */}
        <div className="mt-16 mb-20">
           <h2 className="font-bold text-4xl mb-10 flex items-center gap-4 py-2 border-b-2 border-orange-500/20 inline-flex">
             <MapPin className="text-orange-500 w-10 h-10 align-middle" /> 
             <span>Premium Stays</span>
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {trip?.tripData?.hotelOptions?.map((hotel, index) => (
                 <a key={index} href={`https://www.google.com/maps/search/?api=1&query=${hotel?.hotelName},${hotel?.hotelAddress}`} target="_blank" rel="noreferrer" className="block group h-full">
                    <div className="h-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl overflow-hidden shadow-xl transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.15)] group-hover:border-orange-500/40 flex flex-col">
                       <div className="relative overflow-hidden h-56 w-full">
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-80 group-hover:opacity-60 transition-opacity"></div>
                         <img 
                           src={hotel.hotelImageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2070"} 
                           alt="hotel" 
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                         />
                         <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-bold text-yellow-500 flex items-center gap-1.5 border border-white/10 shadow-lg">
                           ⭐ <span className="text-white">{hotel?.rating}</span>
                         </div>
                       </div>
                       <div className="p-6 flex-1 flex flex-col z-20 relative bg-gray-900/40">
                          <h3 className="font-bold text-xl mb-3 line-clamp-1 group-hover:text-orange-400 transition-colors">{hotel?.hotelName}</h3>
                          <p className="text-sm text-gray-400 flex gap-2 items-start mb-6 line-clamp-2 leading-relaxed">
                            <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gray-500" />
                            {hotel?.hotelAddress}
                          </p>
                          <div className="mt-auto pt-5 border-t border-gray-800/80 flex justify-between items-end">
                             <div>
                               <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Price per night</div>
                               <div className="text-xl md:text-2xl">{renderPrice(hotel?.price)}</div>
                             </div>
                             <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                               <Navigation className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                             </div>
                          </div>
                       </div>
                    </div>
                 </a>
              ))}
           </div>
        </div>

        {/* Itinerary Section */}
        <div className="my-20">
           <h2 className="font-bold text-4xl mb-12 flex items-center gap-4 py-2 border-b-2 border-orange-500/20 inline-flex">
             <Map className="text-orange-500 w-10 h-10" /> 
             <span>Your Daily Journey</span>
           </h2>
           <div className="space-y-16">
              {trip?.tripData?.itinerary?.map((item, index) => (
                 <div key={index} className="relative pl-6 md:pl-12">
                    {/* Glowing Timeline Line */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500/80 via-gray-800 to-gray-800 hidden md:block rounded-full"></div>
                    
                    <div className="relative">
                      {/* Timeline Glow Dot */}
                      <div className="absolute -left-[54px] top-3 w-6 h-6 rounded-full bg-orange-500 border-[6px] border-black hidden md:block z-10 shadow-[0_0_15px_rgba(249,115,22,0.6)]"></div>
                      
                      <h3 className="text-3xl font-black text-white mb-8 flex items-center gap-4 bg-gray-900/80 backdrop-blur-sm w-fit px-6 py-3 rounded-2xl border border-gray-700/50 shadow-lg">
                        <span className="text-orange-500 font-mono tracking-tighter">{item.day}</span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {item.plan?.map((place, idx) => (
                            <div key={idx} className="group bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-3xl p-5 flex flex-col xl:flex-row gap-6 hover:border-orange-500/40 hover:bg-gray-800/80 transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(249,115,22,0.1)] group-scope overflow-hidden relative">
                               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors"></div>
                               
                               <div className="xl:w-40 xl:h-40 w-full h-56 rounded-2xl overflow-hidden shrink-0 relative z-10 shadow-lg">
                                 <img 
                                   src={place.placeImageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070"} 
                                   alt={place.placeName} 
                                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                 />
                               </div>
                               <div className="flex-1 flex flex-col justify-center relative z-10">
                                  <h4 className="font-bold text-2xl mb-3 group-hover:text-orange-400 transition-colors text-white">{place.placeName}</h4>
                                  <p className="text-sm text-gray-400 mb-6 line-clamp-3 leading-relaxed">{place.placeDetails}</p>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4 mt-auto">
                                    <div className="text-sm flex items-center gap-3 text-gray-300 font-medium bg-black/40 px-3 py-2 rounded-lg border border-gray-800">
                                      <Clock className="w-4 h-4 text-orange-500 shrink-0" /> <span className="truncate">{place.time}</span>
                                    </div>
                                    <div className="text-sm flex items-center gap-3 text-gray-300 font-medium bg-black/40 px-3 py-2 rounded-lg border border-gray-800">
                                      <Banknote className="w-4 h-4 text-green-400 shrink-0" /> 
                                      <span className="truncate">{place.ticketPricing === "Free" ? "Free Admission" : renderPrice(place.ticketPricing)}</span>
                                    </div>
                                    <div className="text-sm flex items-center gap-3 text-gray-400 font-medium bg-black/40 px-3 py-2 rounded-lg border border-gray-800 sm:col-span-2">
                                      <Navigation className="w-4 h-4 text-blue-400 shrink-0" /> <span className="truncate">{place.travelTimeToNextLocation}</span>
                                    </div>
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}

export default ViewTrip
