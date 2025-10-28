// Advanced bias detection using Hugging Face models
import { hfZeroShotClassification, hfTextClassification } from './hf';

// Political bias detection using specialized bias detection model
export async function detectPoliticalBias(text) {
  try {
    const result = await hfZeroShotClassification({
      inputs: text
    });
    
    // Handle both array and object responses
    let predictions;
    if (Array.isArray(result)) {
      predictions = Array.isArray(result[0]) ? result[0] : result;
    } else if (result.label) {
      predictions = [result];
    } else {
      predictions = [];
    }
    
    if (predictions && predictions.length > 0) {
      const bestMatch = predictions.reduce((a, b) => (a.score || 0) > (b.score || 0) ? a : b);
      
      // The d4data/bias-detection-model returns labels with scores
      // Map actual model labels to political bias scores
      const biasMapping = {
        'LABEL_0': 0,      // Neutral/Fair
        'LABEL_1': -1,     // Biased towards left
        'LABEL_2': 1,      // Biased towards right
        'NEUTRAL': 0,
        'FAIR': 0,
        'BIASED': 0,
      };
      
      const biasScore = biasMapping[bestMatch.label] || 0;
      
      return {
        label: bestMatch.label,
        score: bestMatch.score,
        biasScore: biasScore,
        confidence: bestMatch.score
      };
    }
    
    return { label: 'unknown', score: 0, biasScore: 0, confidence: 0 };
  } catch (error) {
    console.error('Bias detection error:', error);
    return { label: 'error', score: 0, biasScore: 0, confidence: 0 };
  }
}

// Sentiment analysis for emotional bias using multilingual model
export async function detectSentimentBias(text) {
  try {
    const result = await hfTextClassification({
      inputs: text
    });
    
    // Handle both array and object responses
    let predictions;
    if (Array.isArray(result)) {
      predictions = Array.isArray(result[0]) ? result[0] : result;
    } else if (result.label) {
      predictions = [result];
    } else {
      predictions = [];
    }
    
    if (predictions && predictions.length > 0) {
      const bestMatch = predictions.reduce((a, b) => (a.score || 0) > (b.score || 0) ? a : b);
      
      // The tabularisai/multilingual-sentiment-analysis returns 5 sentiment classes
      const sentimentMapping = {
        'Very Negative': 'NEGATIVE',
        'Negative': 'NEGATIVE', 
        'Neutral': 'NEUTRAL',
        'Positive': 'POSITIVE',
        'Very Positive': 'POSITIVE',
        // Also handle label formats
        'LABEL_0': 'Very Negative',
        'LABEL_1': 'Negative',
        'LABEL_2': 'Neutral',
        'LABEL_3': 'Positive',
        'LABEL_4': 'Very Positive'
      };
      
      const sentimentLabel = sentimentMapping[bestMatch.label] || bestMatch.label;
      const mappedSentiment = sentimentMapping[sentimentLabel] || sentimentLabel;
      
      return {
        sentiment: bestMatch.label,
        mappedSentiment: mappedSentiment,
        confidence: bestMatch.score,
        isNegative: sentimentLabel.includes('Negative'),
        isPositive: sentimentLabel.includes('Positive')
      };
    }
    
    return { 
      sentiment: 'Neutral', 
      mappedSentiment: 'NEUTRAL',
      confidence: 0, 
      isNegative: false, 
      isPositive: false 
    };
  } catch (error) {
    console.error('Sentiment detection error:', error);
    return { 
      sentiment: 'Neutral', 
      mappedSentiment: 'NEUTRAL',
      confidence: 0, 
      isNegative: false, 
      isPositive: false 
    };
  }
}

// Source bias mapping (can be enhanced with real bias databases)
const SOURCE_BIAS_MAP = {
  // Left-leaning sources
  'CNN': { bias: -1.5, confidence: 0.8 },
  'MSNBC': { bias: -1.8, confidence: 0.9 },
  'The New York Times': { bias: -1.2, confidence: 0.7 },
  'The Washington Post': { bias: -1.3, confidence: 0.8 },
  'HuffPost': { bias: -1.7, confidence: 0.9 },
  'Vox': { bias: -1.6, confidence: 0.8 },
  
  // Center sources
  'Reuters': { bias: 0.1, confidence: 0.9 },
  'Associated Press': { bias: 0.0, confidence: 0.9 },
  'BBC News': { bias: 0.2, confidence: 0.8 },
  'PBS NewsHour': { bias: 0.1, confidence: 0.8 },
  'NPR': { bias: -0.3, confidence: 0.7 },
  
  // Right-leaning sources
  'Fox News': { bias: 1.6, confidence: 0.9 },
  'Breitbart': { bias: 2.0, confidence: 0.9 },
  'The Daily Wire': { bias: 1.8, confidence: 0.8 },
  'Newsmax': { bias: 1.7, confidence: 0.8 },
  'The Blaze': { bias: 1.9, confidence: 0.8 },
  'OAN': { bias: 1.8, confidence: 0.7 }
};

export function getSourceBias(sourceName) {
  return SOURCE_BIAS_MAP[sourceName] || { bias: 0, confidence: 0.5 };
}

// Combined bias analysis
export async function analyzeArticleBias(article) {
  const { title, description, source } = article;
  const text = `${title} ${description || ''}`.trim();
  
  try {
    // Get source bias
    const sourceBias = getSourceBias(source?.name);
    
    // Analyze content bias
    const contentBias = await detectPoliticalBias(text);
    
    // Analyze sentiment
    const sentiment = await detectSentimentBias(text);
    
    // Calculate combined bias score (-2 to +2)
    const combinedBias = (sourceBias.bias * 0.4) + (contentBias.biasScore * 0.6);
    
    // Determine bias category
    let category = 'center';
    if (combinedBias <= -1.5) category = 'far-left';
    else if (combinedBias <= -0.5) category = 'left';
    else if (combinedBias <= 0.5) category = 'center';
    else if (combinedBias <= 1.5) category = 'right';
    else category = 'far-right';
    
    return {
      combinedBias: Math.max(-2, Math.min(2, combinedBias)), // Clamp to -2, +2
      category,
      sourceBias: sourceBias.bias,
      contentBias: contentBias.biasScore,
      sentiment: sentiment.sentiment,
      confidence: Math.min(sourceBias.confidence, contentBias.confidence),
      details: {
        source: sourceBias,
        content: contentBias,
        sentiment
      }
    };
  } catch (error) {
    console.error('Bias analysis error:', error);
    return {
      combinedBias: 0,
      category: 'unknown',
      sourceBias: 0,
      contentBias: 0,
      sentiment: 'neutral',
      confidence: 0,
      details: null
    };
  }
}

// Get bias color for visualization
export function getBiasColor(biasScore) {
  if (biasScore <= -1.5) return '#d32f2f'; // Dark red (far-left)
  if (biasScore <= -0.5) return '#f57c00'; // Orange (left)
  if (biasScore <= 0.5) return '#388e3c'; // Green (center)
  if (biasScore <= 1.5) return '#1976d2'; // Blue (right)
  return '#7b1fa2'; // Purple (far-right)
}

// Get bias label
export function getBiasLabel(biasScore) {
  if (biasScore <= -1.5) return 'Far Left';
  if (biasScore <= -0.5) return 'Left';
  if (biasScore <= 0.5) return 'Center';
  if (biasScore <= 1.5) return 'Right';
  return 'Far Right';
}
