// API service for backend communication
const API_BASE = 'http://localhost:8000';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Request failed' }));
        throw new Error(error.detail || `HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User management
  async createUser(username, email) {
    return this.request('/users/', {
      method: 'POST',
      body: JSON.stringify({ username, email }),
    });
  }

  async getUser(username) {
    return this.request(`/users/${username}`);
  }

  // User preferences
  async getUserPreferences(username) {
    return this.request(`/users/${username}/preferences`);
  }

  async updateUserPreferences(username, preferences) {
    return this.request(`/users/${username}/preferences`, {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  // News endpoints
  async getHeadlines(country = 'us', category = null, pageSize = 20) {
    const params = new URLSearchParams({ country, pageSize });
    if (category) params.append('category', category);
    
    return this.request(`/news/headlines?${params}`);
  }

  async searchNews(q, language = 'en', sortBy = 'publishedAt', pageSize = 20) {
    const params = new URLSearchParams({ q, language, sortBy, pageSize });
    return this.request(`/news/search?${params}`);
  }

  async getPersonalizedNews(username, limit = 20) {
    return this.request(`/news/personalized/${username}?limit=${limit}`);
  }

  // Reading history
  async addToReadingHistory(username, article) {
    const historyItem = {
      article: {
        title: article.title,
        description: article.description,
        url: article.url,
        url_to_image: article.urlToImage,
        published_at: article.publishedAt,
        source: article.source
      },
      read_at: new Date().toISOString()
    };

    return this.request(`/users/${username}/reading-history`, {
      method: 'POST',
      body: JSON.stringify(historyItem),
    });
  }

  async getReadingHistory(username) {
    return this.request(`/users/${username}/reading-history`);
  }

  async getUserInsights(username) {
    return this.request(`/users/${username}/insights`);
  }
}

export default new ApiService();

