import React from 'react';
import { getBiasColor, getBiasLabel } from '../services/biasDetection';

function BiasBar({ biasScore, confidence, showLabel = true, size = 'medium' }) {
  // Normalize bias score to 0-100 for bar width
  const normalizedScore = ((biasScore + 2) / 4) * 100; // Convert -2 to +2 into 0-100
  
  const sizes = {
    small: { height: 8, fontSize: 10 },
    medium: { height: 12, fontSize: 12 },
    large: { height: 16, fontSize: 14 }
  };
  
  const style = sizes[size] || sizes.medium;
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {showLabel && (
        <span style={{ 
          fontSize: style.fontSize, 
          fontWeight: 'bold',
          minWidth: 60,
          textAlign: 'right'
        }}>
          {getBiasLabel(biasScore)}
        </span>
      )}
      
      <div style={{ 
        position: 'relative',
        width: 200,
        height: style.height,
        backgroundColor: '#f0f0f0',
        borderRadius: style.height / 2,
        overflow: 'hidden',
        border: '1px solid #ddd'
      }}>
        {/* Center line */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: 2,
          height: '100%',
          backgroundColor: '#666',
          transform: 'translateX(-50%)'
        }} />
        
        {/* Bias bar */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: `${Math.abs(normalizedScore - 50) * 2}%`, // Width based on distance from center
          height: '100%',
          backgroundColor: getBiasColor(biasScore),
          transform: biasScore < 0 ? 'translateX(-100%)' : 'translateX(0%)',
          borderRadius: style.height / 2,
          transition: 'all 0.3s ease'
        }} />
        
        {/* Confidence indicator */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: -2,
          width: 4,
          height: style.height + 4,
          backgroundColor: confidence > 0.7 ? '#4caf50' : confidence > 0.4 ? '#ff9800' : '#f44336',
          borderRadius: 2,
          transform: 'translateX(-50%)',
          opacity: 0.8
        }} />
      </div>
      
      <div style={{ 
        fontSize: style.fontSize - 2, 
        color: '#666',
        minWidth: 40
      }}>
        {biasScore.toFixed(1)}
      </div>
    </div>
  );
}

export default BiasBar;

