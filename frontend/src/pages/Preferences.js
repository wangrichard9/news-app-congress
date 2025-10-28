import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

const AVAILABLE_SOURCES = [
  'CNN', 'Fox News', 'Reuters', 'Associated Press', 'BBC News', 
  'The New York Times', 'The Washington Post', 'MSNBC', 'PBS NewsHour',
  'Breitbart', 'The Daily Wire', 'Newsmax'
];

function Preferences() {
  const { user, preferences, updatePreferences } = useUser();
  const [prefs, setPrefs] = useState(preferences || {
    interests: [],
    preferred_sources: [],
    blocked_sources: [],
    bias_preference: 'all',
    language: 'en',
    country: 'us'
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (preferences) {
      setPrefs(preferences);
    }
  }, [preferences]);

  const handleInterestChange = (interest, checked) => {
    const interests = checked 
      ? [...prefs.interests, interest]
      : prefs.interests.filter(i => i !== interest);
    setPrefs({ ...prefs, interests });
  };

  const handleSourceChange = (source, type) => {
    const key = type === 'preferred' ? 'preferred_sources' : 'blocked_sources';
    const sources = prefs[key] || [];
    const updated = sources.includes(source)
      ? sources.filter(s => s !== source)
      : [...sources, source];
    setPrefs({ ...prefs, [key]: updated });
  };

  const handleSave = async () => {
    try {
      await updatePreferences(prefs);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error('Failed to save preferences:', e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Personalization Settings</h2>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Interests</h3>
        <div className="flex flex-wrap gap-3">
          {['climate', 'sports', 'technology', 'politics', 'economy', 'health', 'entertainment', 'science'].map(interest => (
            <label key={interest} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={(prefs.interests || []).includes(interest)}
                onChange={(e) => handleInterestChange(interest, e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 capitalize">{interest}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Bias Preference</h3>
        <select 
          value={prefs.bias_preference || 'all'} 
          onChange={(e) => setPrefs({ ...prefs, bias_preference: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Sources</option>
          <option value="left">Left-leaning</option>
          <option value="center">Center</option>
          <option value="right">Right-leaning</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Preferred Sources</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {AVAILABLE_SOURCES.map(source => (
            <label key={source} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={(prefs.preferred_sources || []).includes(source)}
                onChange={(e) => handleSourceChange(source, 'preferred')}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{source}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Blocked Sources</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {AVAILABLE_SOURCES.map(source => (
            <label key={source} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={(prefs.blocked_sources || []).includes(source)}
                onChange={(e) => handleSourceChange(source, 'blocked')}
                className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500"
              />
              <span className="ml-2 text-sm text-gray-700">{source}</span>
            </label>
          ))}
        </div>
      </div>

      <button 
        onClick={handleSave}
        className={`w-full px-6 py-3 text-base font-medium text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
          saved 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
        }`}
      >
        {saved ? '✓ Saved!' : 'Save Preferences'}
      </button>
    </div>
  );
}

export default Preferences;
