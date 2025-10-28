// User preferences and personalization service
export const USER_PREFS_KEY = 'newsapp_user_prefs';

export function getUserPreferences() {
  const defaultPrefs = {
    interests: [],
    preferredSources: [],
    blockedSources: [],
    readingHistory: [],
    biasPreference: 'all', // 'left', 'center', 'right', 'all'
    language: 'en',
    country: 'us',
    lastUpdated: Date.now()
  };
  
  try {
    const saved = localStorage.getItem(USER_PREFS_KEY);
    return saved ? { ...defaultPrefs, ...JSON.parse(saved) } : defaultPrefs;
  } catch {
    return defaultPrefs;
  }
}

export function saveUserPreferences(prefs) {
  try {
    const updated = { ...prefs, lastUpdated: Date.now() };
    localStorage.setItem(USER_PREFS_KEY, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

export function addToReadingHistory(article) {
  const prefs = getUserPreferences();
  const history = prefs.readingHistory || [];
  
  // Add article to history (avoid duplicates)
  const exists = history.some(item => item.url === article.url);
  if (!exists) {
    history.unshift({
      url: article.url,
      title: article.title,
      source: article.source?.name,
      publishedAt: article.publishedAt,
      readAt: new Date().toISOString()
    });
    
    // Keep only last 100 articles
    if (history.length > 100) {
      history.splice(100);
    }
    
    saveUserPreferences({ ...prefs, readingHistory: history });
  }
}

export function getPersonalizedQuery(prefs) {
  const { interests, preferredSources, blockedSources, biasPreference } = prefs;
  
  let query = '';
  
  // Add interests
  if (interests.length > 0) {
    query += interests.map(i => `"${i}"`).join(' OR ');
  }
  
  // Add preferred sources
  if (preferredSources.length > 0) {
    const sourcesQuery = preferredSources.map(s => `source:${s}`).join(' OR ');
    query += query ? ` AND (${sourcesQuery})` : sourcesQuery;
  }
  
  // Exclude blocked sources
  if (blockedSources.length > 0) {
    const blockedQuery = blockedSources.map(s => `-source:${s}`).join(' ');
    query += query ? ` ${blockedQuery}` : blockedQuery;
  }
  
  return query.trim();
}

export function getBiasFilteredSources(prefs) {
  const { biasPreference, preferredSources, blockedSources } = prefs;
  
  // Simple bias mapping - replace with your bias database
  const biasMap = {
    'left': ['CNN', 'MSNBC', 'The New York Times', 'The Washington Post'],
    'center': ['Reuters', 'Associated Press', 'BBC News', 'PBS NewsHour'],
    'right': ['Fox News', 'Breitbart', 'The Daily Wire', 'Newsmax']
  };
  
  let sources = [];
  
  if (biasPreference !== 'all') {
    sources = biasMap[biasPreference] || [];
  }
  
  // Add preferred sources
  sources = [...new Set([...sources, ...preferredSources])];
  
  // Remove blocked sources
  sources = sources.filter(s => !blockedSources.includes(s));
  
  return sources;
}

