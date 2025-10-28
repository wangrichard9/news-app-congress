import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import ApiService from '../services/api';
import ArticleCard from '../ui/ArticleCard';

function Feed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, addToReadingHistory } = useUser();

  useEffect(() => {
    if (!user) return;
    
    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await ApiService.getPersonalizedNews(user.username, 20);
        setArticles(res.articles || []);
      } catch (e) {
        setError('Failed to load news.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized feed...</p>
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

  const handleArticleClick = (article) => {
    addToReadingHistory(article);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Your News Feed</h2>
      <div className="grid gap-4">
        {articles.map((a) => (
          <div key={a.url} onClick={() => handleArticleClick(a)} className="cursor-pointer hover:scale-[1.01] transition-transform duration-200">
            <ArticleCard article={a} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;


