import React, { useState } from 'react';
import { searchEverything } from '../services/newsapi';
import ArticleCard from '../ui/ArticleCard';

function Compare() {
  const [query, setQuery] = useState('climate change');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function onSearch(e) {
    e.preventDefault();
    setLoading(true);
    const res = await searchEverything({ q: query, pageSize: 10 });
    setResults(res.articles || []);
    setLoading(false);
  }

  const groupedBySource = results.reduce((acc, a) => {
    const name = a?.source?.name || 'Unknown';
    if (!acc[name]) acc[name] = [];
    acc[name].push(a);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Compare Sources</h2>
      <form onSubmit={onSearch} className="mb-8">
        <div className="flex gap-3">
          <input 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Search a topic..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
          />
          <button 
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Search
          </button>
        </div>
      </form>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-8">
          {Object.keys(groupedBySource).sort().map((sourceName) => (
            <div key={sourceName} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">{sourceName}</h3>
              <div className="grid gap-4">
                {groupedBySource[sourceName].map((a) => (
                  <ArticleCard key={a.url} article={a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Compare;


