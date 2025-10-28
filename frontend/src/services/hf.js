import axios from 'axios';

const HF_API_KEY = process.env.REACT_APP_HF_API_KEY;
const HF_BIAS_MODEL = process.env.REACT_APP_HF_BIAS_MODEL || 'd4data/bias-detection-model';
const HF_SENTIMENT_MODEL = process.env.REACT_APP_HF_SENTIMENT_MODEL || 'tabularisai/multilingual-sentiment-analysis';
const HF_BASE = 'https://api-inference.huggingface.co/models';

if (!HF_API_KEY) {
  // eslint-disable-next-line no-console
  console.warn('Missing REACT_APP_HF_API_KEY. Create a .env file to use Hugging Face.');
}

export async function hfTextClassification({ model = HF_SENTIMENT_MODEL, inputs }) {
  try {
    const response = await axios.post(
      `${HF_BASE}/${encodeURIComponent(model)}`,
      { inputs },
      { 
        headers: { 
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000, // 30 second timeout for model loading
      }
    );
    return response.data;
  } catch (error) {
    console.error('Hugging Face API Error:', error.response?.data || error.message);
    throw error;
  }
}

export async function hfZeroShotClassification({ model = HF_BIAS_MODEL, inputs, candidate_labels }) {
  try {
    const response = await axios.post(
      `${HF_BASE}/${encodeURIComponent(model)}`,
      { inputs },
      { 
        headers: { 
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Hugging Face API Error:', error.response?.data || error.message);
    throw error;
  }
}


