// Personalized recommendation engine
import { getUserPreferences } from './userPrefs';
import { searchEverything } from './newsapi';
import { hfZeroShotClassification } from './hf';

// Topic classification for better recommendations
const TOPIC_LABELS = [
  'politics', 'technology', 'business', 'health', 'science', 'sports', 
  'entertainment', 'world news', 'climate', 'economy', 'education'
];

export async function getPersonalizedRecommendations(limit = 20) {
  const prefs = getUserPreferences();
  const { interests, readingHistory, preferredSources, blockedSources } = prefs;
  
  try {
    // Get articles based on interests
    let articles = [];
    if (interests.length > 0) {
      const q = interests.map(i => `"${i}"`).join(' OR ');
      const res = await searchEverything({ 
        q, 
        language: prefs.language, 
        sortBy: 'publishedAt', 
        pageSize: limit * 2 // Get more to filter
      });
      articles = res.articles || [];
    } else {
      // Fallback to trending topics
      const trendingTopics = ['technology', 'climate change', 'economy', 'health'];
      const q = trendingTopics.map(t => `"${t}"`).join(' OR ');
      const res = await searchEverything({ 
        q, 
        language: prefs.language, 
        sortBy: 'publishedAt', 
        pageSize: limit * 2
      });
      articles = res.articles || [];
    }
    
    // Apply source filtering
    articles = filterBySources(articles, preferredSources, blockedSources);
    
    // Score articles based on user behavior
    const scoredArticles = await scoreArticles(articles, prefs);
    
    // Sort by score and return top recommendations
    return scoredArticles
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
      
  } catch (error) {
    console.error('Recommendation error:', error);
    return [];
  }
}

function filterBySources(articles, preferredSources, blockedSources) {
  return articles.filter(article => {
    const sourceName = article.source?.name;
    
    // Block unwanted sources
    if (blockedSources.includes(sourceName)) {
      return false;
    }
    
    // If preferred sources exist, only show those
    if (preferredSources.length > 0) {
      return preferredSources.includes(sourceName);
    }
    
    return true;
  });
}

async function scoreArticles(articles, prefs) {
  const { readingHistory, interests } = prefs;
  
  return Promise.all(articles.map(async (article) => {
    let score = 0;
    
    // Base score from recency (newer = higher score)
    const publishedAt = new Date(article.publishedAt);
    const hoursAgo = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60);
    score += Math.max(0, 24 - hoursAgo) * 0.1; // Decay over 24 hours
    
    // Interest matching score
    if (interests.length > 0) {
      const titleText = (article.title + ' ' + (article.description || '')).toLowerCase();
      const interestMatches = interests.filter(interest => 
        titleText.includes(interest.toLowerCase())
      ).length;
      score += interestMatches * 2;
    }
    
    // Reading history bonus (avoid recently read)
    const recentlyRead = readingHistory.some(item => 
      item.url === article.url || 
      item.title === article.title
    );
    if (recentlyRead) {
      score -= 5; // Penalty for recently read
    }
    
    // Source preference score
    const sourceName = article.source?.name;
    if (prefs.preferredSources.includes(sourceName)) {
      score += 1;
    }
    
    // AI-powered topic relevance (optional)
    try {
      const topicRelevance = await getTopicRelevance(article, interests);
      score += topicRelevance * 0.5;
    } catch (error) {
      // Ignore AI errors, continue with other scoring
    }
    
    return { ...article, score };
  }));
}

async function getTopicRelevance(article, interests) {
  if (interests.length === 0) return 0;
  
  try {
    const text = (article.title + ' ' + (article.description || '')).substring(0, 500);
    const result = await hfZeroShotClassification({
      inputs: text,
      candidate_labels: interests
    });
    
    // Return the highest confidence score
    if (result && result.length > 0) {
      return Math.max(...result[0].map(r => r.score));
    }
    return 0;
  } catch (error) {
    return 0;
  }
}

export async function getTrendingTopics() {
  try {
    const res = await searchEverything({ 
      q: 'trending OR breaking OR latest',
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: 50
    });
    
    // Extract topics from article titles using simple keyword extraction
    const topics = {};
    res.articles?.forEach(article => {
      const words = article.title.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 4);
      
      words.forEach(word => {
        topics[word] = (topics[word] || 0) + 1;
      });
    });
    
    // Return top trending topics
    return Object.entries(topics)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, count }));
      
  } catch (error) {
    console.error('Trending topics error:', error);
    return [];
  }
}

export function getReadingInsights(prefs) {
  const { readingHistory } = prefs;
  
  if (readingHistory.length === 0) {
    return { totalRead: 0, topSources: [], topTopics: [] };
  }
  
  // Analyze reading patterns
  const sourceCounts = {};
  const topicCounts = {};
  
  readingHistory.forEach(article => {
    // Count sources
    const source = article.source;
    if (source) {
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    }
    
    // Simple topic extraction from titles
    const words = article.title.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 4);
    
    words.forEach(word => {
      topicCounts[word] = (topicCounts[word] || 0) + 1;
    });
  });
  
  const topSources = Object.entries(sourceCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([source, count]) => ({ source, count }));
  
  const topTopics = Object.entries(topicCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([topic, count]) => ({ topic, count }));
  
  return {
    totalRead: readingHistory.length,
    topSources,
    topTopics
  };
}

