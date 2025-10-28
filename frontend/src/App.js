import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Feed from './pages/Feed';
import Compare from './pages/Compare';
import BiasComparison from './pages/BiasComparison';
import Onboarding from './pages/Onboarding';
import Preferences from './pages/Preferences';
import Recommendations from './pages/Recommendations';

function AppContent() {
  const { isLoggedIn, user, logout } = useUser();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Aware
              </Link>
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200">
                Sign In
              </Link>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-1">
              <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-all duration-200">
                Home
              </Link>
              <Link to="/feed" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-all duration-200">
                Feed
              </Link>
              <Link to="/recommendations" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-all duration-200">
                Recommendations
              </Link>
              <Link to="/compare" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-all duration-200">
                Compare
              </Link>
              <Link to="/bias" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-all duration-200">
                Bias Analysis
              </Link>
              <Link to="/preferences" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-all duration-200">
                Preferences
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, <span className="font-semibold text-blue-600">{user?.username}</span></span>
              <button 
                onClick={logout} 
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/bias" element={<BiasComparison />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/preferences" element={<Preferences />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
