import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import CreateTrip from './create-trip/index.jsx'
import ViewTrip from './view-trip/index.jsx'
import MyTrips from './my-trips/index.jsx'
import BudgetDestination from './pages/BudgetDestination.jsx'
import GeneratingTrip from './pages/GeneratingTrip.jsx'
import AIInsights from './pages/AIInsights.jsx'
import TravelChatbot from './components/TravelChatbot.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TravelChatbot />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/budget-destination" element={<BudgetDestination />} />
        <Route path="/generating-trip" element={<GeneratingTrip />} />
        <Route path="/trip-ai-insights/:tripId" element={<AIInsights />} />
        <Route path="/view-trip/:tripId" element={<ViewTrip />} />
        <Route path="/my-trips" element={<MyTrips />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
