import axios from 'axios';

const NEWSAPI_BASE = 'https://newsapi.org/v2';
const API_KEY = process.env.REACT_APP_NEWSAPI_KEY;

if (!API_KEY) {
  // Warn early in dev
  // eslint-disable-next-line no-console
  console.warn('Missing REACT_APP_NEWSAPI_KEY. Create a .env file to use NewsAPI.');
}

export async function getTopHeadlines({ country = 'us', category, pageSize = 20 } = {}) {
  const params = { country, apiKey: API_KEY, pageSize };
  if (category) params.category = category;
  const { data } = await axios.get(`${NEWSAPI_BASE}/top-headlines`, { params });
  return data;
}

export async function searchEverything({ q, from, to, language = 'en', sortBy = 'publishedAt', pageSize = 20 } = {}) {
  const params = { q, from, to, language, sortBy, pageSize, apiKey: API_KEY };
  const { data } = await axios.get(`${NEWSAPI_BASE}/everything`, { params });
  return data;
}


