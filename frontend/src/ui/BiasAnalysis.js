import React, { useState, useEffect } from 'react';
import { analyzeArticleBias } from '../services/biasDetection';
import BiasBar from './BiasBar';

function BiasAnalysis({ article, showDetails = false }) {
  const [biasData, setBiasData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!article) return;
    
    setLoading(true);
    setError('');
    
    analyzeArticleBias(article)
      .then(data => {
        setBiasData(data);
      })
      .catch(err => {
        setError('Failed to analyze bias');
        console.error('Bias analysis error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [article]);

  if (loading) {
    return (
      <div style={{ padding: 8, fontSize: 12, color: '#666' }}>
        Analyzing bias...
      </div>
    );
  }

  if (error || !biasData) {
    return (
      <div style={{ padding: 8, fontSize: 12, color: '#f44336' }}>
        {error || 'Bias analysis unavailable'}
      </div>
    );
  }

  const { combinedBias, category, confidence, details } = biasData;

  return (
    <div style={{ padding: 8, border: '1px solid #eee', borderRadius: 6, marginTop: 8 }}>
      <div style={{ marginBottom: 8 }}>
        <BiasBar 
          biasScore={combinedBias} 
          confidence={confidence}
          size="small"
        />
      </div>
      
      {showDetails && details && (
        <div style={{ fontSize: 11, color: '#666' }}>
          <div style={{ marginBottom: 4 }}>
            <strong>Source Bias:</strong> {details.source.bias.toFixed(1)} 
            <span style={{ marginLeft: 8 }}>
              <strong>Content Bias:</strong> {details.content.biasScore.toFixed(1)}
            </span>
          </div>
          <div style={{ marginBottom: 4 }}>
            <strong>Sentiment:</strong> {details.sentiment.sentiment} 
            <span style={{ marginLeft: 8 }}>
              <strong>Confidence:</strong> {(confidence * 100).toFixed(0)}%
            </span>
          </div>
          <div>
            <strong>Category:</strong> {category.charAt(0).toUpperCase() + category.slice(1)}
          </div>
        </div>
      )}
      
      {!showDetails && (
        <div style={{ fontSize: 11, color: '#666', textAlign: 'center' }}>
          {category.charAt(0).toUpperCase() + category.slice(1)} • {(confidence * 100).toFixed(0)}% confidence
        </div>
      )}
    </div>
  );
}

export default BiasAnalysis;

