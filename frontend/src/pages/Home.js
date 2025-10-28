import React from 'react';
import { Link } from "react-router-dom";
import { useUser } from '../contexts/UserContext';

function Home() {
  const { isLoggedIn, user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className={isLoggedIn 
        ? "sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm"
        : "sticky top-0 z-50 bg-purple-600 text-white shadow-md"}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-1">
              <Link 
                to="/" 
                className={isLoggedIn 
                  ? "px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-all duration-200" 
                  : "px-3 py-2 text-sm font-medium hover:bg-purple-700 rounded-md transition-all duration-200"}
              >
                Home
              </Link>
              {isLoggedIn && (
                <>
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
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <span className="text-sm text-gray-600">
                  Welcome, <span className="font-semibold text-blue-600">{user?.username}</span>
                </span>
              ) : (
                <Link to="/login" className="px-4 py-2 text-sm font-medium bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all duration-200">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* AI-Powered */}
            <Link
              to="/feed"
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 block"
            >
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">AI-Powered</h3>
              <p className="text-gray-600">
                Advanced artificial intelligence to curate and personalize your news experience
              </p>
            </Link>

            {/* Bias Analysis */}
            <Link
              to="/bias"
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 block"
            >
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Bias Analysis</h3>
              <p className="text-gray-600">
                Understand multiple perspectives with our comprehensive bias detection system
              </p>
            </Link>

            {/* Personalized */}
            <Link
              to="/recommendations"
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 block"
            >
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Personalized</h3>
              <p className="text-gray-600">
                Tailored news feed based on your interests and reading patterns
              </p>
            </Link>

            {/* Compare */}
            <Link
              to="/compare"
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 block"
            >
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Compare</h3>
              <p className="text-gray-600">
                Compare different news sources to spot variations in coverage
              </p>
            </Link>

            {/* Preferences */}
            <Link
              to="/preferences"
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 block"
            >
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Preferences</h3>
              <p className="text-gray-600">
                Set your interests to receive personalized news tailored to you
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
