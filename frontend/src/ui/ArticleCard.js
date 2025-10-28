import React, { useEffect, useState } from 'react';
import BiasBadge from './BiasBadge';
import BiasAnalysis from './BiasAnalysis';
import { hfTextClassification } from '../services/hf';

function ArticleCard({ article }) {
  const { title, description, url, urlToImage, source } = article;
  const [sentiment, setSentiment] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const text = title || description || '';
        if (!text) return;
        const res = await hfTextClassification({ inputs: text });
        // HF returns array of arrays of {label, score}
        const preds = Array.isArray(res) ? res[0] : [];
        const best = preds.reduce((a, b) => (a.score > b.score ? a : b), { label: '', score: 0 });
        if (!cancelled) setSentiment(best.label);
      } catch (_) {
        // ignore
      }
    }
    run();
    return () => { cancelled = true; };
  }, [title, description]);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 flex gap-4">
      {urlToImage ? (
        <img 
          src={urlToImage} 
          alt="thumbnail" 
          className="w-32 h-32 md:w-40 md:h-40 object-cover flex-shrink-0" 
        />
      ) : null}
      <div className="flex-1 p-5">
        <div className="flex flex-wrap gap-2 items-center mb-3">
          <span className="text-sm font-semibold text-gray-700">{source?.name}</span>
          <BiasBadge sourceName={source?.name} />
          {sentiment && (
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              {sentiment}
            </span>
          )}
        </div>
        <a 
          href={url} 
          target="_blank" 
          rel="noreferrer" 
          className="text-gray-900 hover:text-blue-600 transition-colors duration-200"
        >
          <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:underline">{title}</h3>
        </a>
        {description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
        )}
        
        {/* Bias Analysis */}
        <BiasAnalysis article={article} showDetails={false} />
      </div>
    </div>
  );
}

export default ArticleCard;


