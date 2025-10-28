import React, { useEffect, useState } from 'react';
import { getPersonalizedRecommendations, getTrendingTopics, getReadingInsights } from '../services/recommendations';
import { getUserPreferences } from '../services/userPrefs';
import ArticleCard from '../ui/ArticleCard';

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRecommendations();
    loadTrendingTopics();
    loadInsights();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const recs = await getPersonalizedRecommendations(15);
      setRecommendations(recs);
    } catch (e) {
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingTopics = async () => {
    try {
      const topics = await getTrendingTopics();
      setTrendingTopics(topics);
    } catch (e) {
      console.error('Failed to load trending topics:', e);
    }
  };

  const loadInsights = () => {
    const prefs = getUserPreferences();
    const insights = getReadingInsights(prefs);
    setInsights(insights);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading personalized recommendations...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Personalized Recommendations</h2>
      
      {/* Reading Insights */}
      {insights && insights.totalRead > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-md p-6 mb-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Reading Insights</h3>
          <p className="text-gray-600 mb-4">You've read <span className="font-bold text-blue-600">{insights.totalRead}</span> articles</p>
          
          {insights.topSources.length > 0 && (
            <div className="mt-4">
              <strong className="text-gray-900">Top Sources:</strong>
              <div className="flex flex-wrap gap-2 mt-3">
                {insights.topSources.map(({ source, count }) => (
                  <span key={source} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {source} ({count})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trending Topics */}
      {trendingTopics.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Trending Topics</h3>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map(({ topic, count }) => (
              <span key={topic} className="px-4 py-2 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 rounded-full text-sm font-medium border border-orange-300">
                {topic} ({count})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Recommended for You</h3>
        {recommendations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-200">
            <p className="text-gray-600">No recommendations available. Try setting your interests in Preferences.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {recommendations.map((article, index) => (
              <div key={article.url} className="relative cursor-pointer hover:scale-[1.01] transition-transform duration-200">
                <ArticleCard article={article} />
                <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <button 
          onClick={loadRecommendations}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Refresh Recommendations
        </button>
      </div>
    </div>
  );
}

export default Recommendations;

