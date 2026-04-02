import Header from './components/custom/Header'
import { Button } from './components/ui/button'
import { Link } from 'react-router-dom'

function App() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-9 px-5 sm:px-10 md:px-16 lg:px-24 mx-auto max-w-[1600px]">
        <h1 className="font-extrabold text-[50px] text-center mt-16 max-w-4xl">
          <span className="text-orange-500">Discover Your Next Adventure with AI:</span> Personalized Itineraries at Your Fingertips
        </h1>
        <p className="text-xl text-gray-500 text-center max-w-2xl">
          Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-5">
          <Link to="/create-trip">
            <Button className="w-full sm:w-auto px-8 py-6 text-lg rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all shadow-lg hover:shadow-orange-500/50">
              Get Started, It's Free
            </Button>
          </Link>
          <Link to="/budget-destination">
            <Button className="w-full sm:w-auto px-8 py-6 text-lg rounded-full bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white font-semibold transition-all shadow-lg flex items-center justify-center gap-2">
              ✨ Find Destinations Within My Budget
            </Button>
          </Link>
        </div>
        <div className="w-full mt-10 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
          <div className="aspect-video bg-gray-900 w-full flex items-center justify-center text-gray-500">
            [App Mockup / Hero Image Placeholder]
          </div>
        </div>
      </div>
    </>
  )
}

export default App
