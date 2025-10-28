import React, { useState } from 'react';

const INTERESTS = ['climate', 'sports', 'innovation', 'mental health', 'economy'];

function Onboarding() {
  const [selected, setSelected] = useState(() => new Set());

  function toggle(interest) {
    const next = new Set(selected);
    if (next.has(interest)) next.delete(interest); else next.add(interest);
    setSelected(next);
  }

  function save() {
    localStorage.setItem('interests', JSON.stringify(Array.from(selected)));
    alert('Saved interests!');
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Aware!</h2>
        <p className="text-gray-600 mb-8">Select your interests to get personalized news</p>
        
        <div className="flex flex-wrap gap-4 mb-8">
          {INTERESTS.map((i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                selected.has(i)
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl scale-105'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              {i}
            </button>
          ))}
        </div>
        
        <div className="text-center">
          <button 
            onClick={save}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;


