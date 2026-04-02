import React, { useEffect, useState } from 'react'
import Header from '../components/custom/Header'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../service/firebaseConfig'
import { useNavigate, Link } from 'react-router-dom'
import ComparisonTool from '../components/ComparisonTool'

function MyTrips() {
  const [userTrips, setUserTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    GetUserTrips()
  }, [])

  const GetUserTrips = async () => {
    try {
      setLoading(true)
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user) {
        navigate('/')
        return
      }
      
      const q = query(collection(db, 'AITrips'), where('userEmail', '==', user?.email))
      const querySnapshot = await getDocs(q)
      const trips = []
      querySnapshot.forEach((doc) => {
        trips.push(doc.data())
      })
      setUserTrips(trips)
    } catch (error) {
      console.error("Error fetching trips:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header />
      <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10 pb-20">
        <h2 className="font-bold text-3xl mb-8">My Trips</h2>
        
        {userTrips?.length >= 2 && <ComparisonTool trips={userTrips} />}

        {loading ? (
             <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-10">
               {[1,2,3,4,5,6].map((item, index) => (
                 <div key={index} className="h-[220px] w-full bg-slate-800 animate-pulse rounded-xl"></div>
               ))}
             </div>
        ) : userTrips.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-10">
              {userTrips.map((trip, index) => (
                <Link to={`/view-trip/${trip?.id}`} key={index}>
                   <div className="hover:scale-105 transition-all bg-gray-900 border border-gray-800 rounded-xl overflow-hidden cursor-pointer shadow-md">
                     <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2070" className="object-cover h-[220px] w-full" alt="trip cover" />
                     <div className="p-4">
                       <h2 className="font-bold text-lg">{trip?.userSelection?.location?.label || trip?.userSelection?.location}</h2>
                       <h2 className="text-sm text-gray-400">{trip?.userSelection?.totalDays} Days trip with {trip?.userSelection?.budget} Budget</h2>
                     </div>
                   </div>
                </Link>
              ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center mt-20 text-center">
                <h2 className="text-xl text-gray-400 mb-6">You haven't planned any trips yet.</h2>
                <Link to="/create-trip" className="bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition-all">
                   Plan a Trip
                </Link>
            </div>
        )}
      </div>
    </div>
  )
}

export default MyTrips
