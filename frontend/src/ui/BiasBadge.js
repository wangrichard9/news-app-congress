import React from 'react';

// Minimal demo mapping; replace with MBFC or your dataset
const SOURCE_BIAS = {
  'Fox News': 'Right',
  'CNN': 'Left',
  'Reuters': 'Center',
  'Associated Press': 'Center'
};

function BiasBadge({ sourceName }) {
  const bias = SOURCE_BIAS[sourceName] || 'Unknown';
  const colorClasses = {
    'Left': 'bg-blue-100 text-blue-800 border-blue-300',
    'Right': 'bg-red-100 text-red-800 border-red-300',
    'Center': 'bg-green-100 text-green-800 border-green-300',
    'Unknown': 'bg-gray-100 text-gray-600 border-gray-300'
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${colorClasses[bias] || colorClasses['Unknown']}`}>
      {bias}
    </span>
  );
}

export default BiasBadge;


