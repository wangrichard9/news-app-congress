# Hugging Face Model Setup

## Models Used

1. **Bias Detection Model**: [d4data/bias-detection-model](https://huggingface.co/d4data/bias-detection-model)
   - Detects bias and fairness in news articles
   - Trained on MBAD Dataset
   - Returns: Fair/Unfair/Biased classifications

2. **Sentiment Analysis Model**: [tabularisai/multilingual-sentiment-analysis](https://huggingface.co/tabularisai/multilingual-sentiment-analysis)
   - Multilingual sentiment analysis (supports 23 languages)
   - Returns: Very Negative, Negative, Neutral, Positive, Very Positive

## Setup Instructions

### 1. Get Your Hugging Face API Key

1. Go to https://huggingface.co/join
2. Create a free account
3. Go to https://huggingface.co/settings/tokens
4. Create a new access token with "Read" permission
5. Copy the token

### 2. Create `.env` File

In the `frontend` directory, create a file named `.env`:

```bash
# Hugging Face API Configuration
REACT_APP_HF_API_KEY=your_actual_api_key_here

# Optional: Customize models if needed
REACT_APP_HF_BIAS_MODEL=d4data/bias-detection-model
REACT_APP_HF_SENTIMENT_MODEL=tabularisai/multilingual-sentiment-analysis
```

Replace `your_actual_api_key_here` with your actual token.

### 3. Restart the Development Server

After creating the `.env` file:

1. Stop the current server (Ctrl+C)
2. Run `npm start` again
3. The models will now load on-demand via Hugging Face Inference API

## Troubleshooting

### Error: "Missing REACT_APP_HF_API_KEY"
- Make sure you created the `.env` file in the `frontend` directory
- Make sure you restarted the dev server after creating `.env`

### Error: "Model is currently loading"
- This is normal! Models load on-demand
- First request may take 30+ seconds to load the model
- Subsequent requests are faster

### Rate Limits
- Free tier has rate limits
- Upgrade at https://huggingface.co/pricing for production use

## How It Works

The app uses the Hugging Face Inference API:
- `https://api-inference.huggingface.co/models/{model_name}`
- Models are loaded dynamically (cold start ~30s)
- Responses include `{label, score}` format

Example API response:
```json
[
  {
    "label": "POSITIVE",
    "score": 0.987654
  }
]
```


