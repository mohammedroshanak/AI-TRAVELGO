import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth'
import { app } from '../../service/firebaseConfig'

function Header() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if(savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error("Failed to parse user data:", e);
        localStorage.removeItem('user');
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    window.location.reload()
  }

  return (
    <div className="p-3 shadow-md flex justify-between items-center px-5 border-b border-gray-800">
      <Link to="/" className="flex gap-2 items-center cursor-pointer">
        <img src="/vite.svg" alt="logo" className="h-8 w-8" />
        <h2 className="font-bold text-xl text-orange-500">TravelGo</h2>
      </Link>
      
      <div>
        {user ? (
          <div className="flex gap-4 items-center">
             <Link to="/my-trips">
                <Button variant="outline" className="bg-transparent border border-gray-600 hover:bg-gray-800">My Trips</Button>
             </Link>
             <Link to="/create-trip">
                <Button className="rounded-full bg-orange-500 text-white">+</Button>
             </Link>
             <div className="relative group cursor-pointer">
               <img src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="user" className="h-[35px] w-[35px] rounded-full object-cover border border-orange-500" />
               <div className="absolute right-0 top-10 hidden group-hover:block bg-gray-900 border border-gray-700 rounded shadow-lg p-2 z-50">
                  <h2 onClick={handleLogout} className="text-red-500 hover:bg-gray-800 p-2 rounded cursor-pointer whitespace-nowrap">Logout</h2>
               </div>
             </div>
          </div>
        ) : (
          <Link to="/create-trip">
            <Button>Sign In</Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Header
