import React from 'react';

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
          Aware
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
          AI-powered, personalized, bias-aware news for Gen Z
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">AI-Powered</h3>
            <p className="text-gray-600">Advanced artificial intelligence to curate and personalize your news experience</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Bias Analysis</h3>
            <p className="text-gray-600">Understand multiple perspectives with our comprehensive bias detection system</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Personalized</h3>
            <p className="text-gray-600">Tailored news feed based on your interests and reading patterns</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;


