import React, { useState, useEffect } from 'react';
import { searchEverything } from '../services/newsapi';
import { analyzeArticleBias } from '../services/biasDetection';
import BiasBar from '../ui/BiasBar';

function BiasComparison() {
  const [query, setQuery] = useState('climate change');
  const [articles, setArticles] = useState([]);
  const [biasAnalysis, setBiasAnalysis] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchArticles = async () => {
    setLoading(true);
    setError('');
    
    try {
      const res = await searchEverything({ q: query, pageSize: 20 });
      const articles = res.articles || [];
      setArticles(articles);
      
      // Analyze bias for each article
      const analysis = {};
      for (const article of articles) {
        try {
          const bias = await analyzeArticleBias(article);
          analysis[article.url] = bias;
        } catch (e) {
          console.error('Bias analysis failed for article:', e);
        }
      }
      setBiasAnalysis(analysis);
    } catch (e) {
      setError('Failed to search articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchArticles();
  }, []);

  // Group articles by bias category
  const groupedArticles = articles.reduce((groups, article) => {
    const bias = biasAnalysis[article.url];
    if (!bias) return groups;
    
    const category = bias.category;
    if (!groups[category]) groups[category] = [];
    groups[category].push({ ...article, bias });
    return groups;
  }, {});

  // Calculate average bias by source
  const sourceBias = articles.reduce((acc, article) => {
    const source = article.source?.name || 'Unknown';
    const bias = biasAnalysis[article.url];
    if (!bias) return acc;
    
    if (!acc[source]) {
      acc[source] = { total: 0, count: 0, articles: [] };
    }
    acc[source].total += bias.combinedBias;
    acc[source].count += 1;
    acc[source].articles.push({ ...article, bias });
    
    return acc;
  }, {});

  // Sort sources by average bias
  const sortedSources = Object.entries(sourceBias)
    .map(([source, data]) => ({
      source,
      averageBias: data.total / data.count,
      count: data.count,
      articles: data.articles
    }))
    .sort((a, b) => a.averageBias - b.averageBias);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Bias Analysis & Comparison</h2>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
        <div className="flex gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a topic to analyze bias..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
          />
          <button
            onClick={searchArticles}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Source Bias Overview */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Source Bias Overview</h3>
        <div className="grid gap-4">
          {sortedSources.map(({ source, averageBias, count, articles }) => (
            <div key={source} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <strong className="text-lg text-gray-900">{source}</strong>
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{count} articles</span>
              </div>
              <BiasBar biasScore={averageBias} confidence={0.8} size="medium" />
            </div>
          ))}
        </div>
      </div>

      {/* Articles by Bias Category */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Articles by Bias Category</h3>
        {Object.entries(groupedArticles).map(([category, articles]) => (
          <div key={category} className="mb-8">
            <h4 className="text-xl font-semibold text-gray-900 mb-4 py-3 px-4 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg capitalize">
              {category} ({articles.length} articles)
            </h4>
            <div className="grid gap-4">
              {articles.map(article => (
                <div key={article.url} className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-3 gap-4">
                    <div className="flex-1">
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-gray-900 hover:text-blue-600 transition-colors duration-200"
                      >
                        <h4 className="font-semibold mb-2 line-clamp-2 hover:underline">{article.title}</h4>
                      </a>
                      <p className="text-sm text-gray-600">
                        {article.source?.name} • {new Date(article.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <BiasBar 
                      biasScore={article.bias.combinedBias} 
                      confidence={article.bias.confidence}
                      size="small"
                      showLabel={false}
                    />
                  </div>
                  {article.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {article.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BiasComparison;

