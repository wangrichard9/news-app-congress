# Bias Detection Setup Guide

This document explains how to set up and use the bias detection feature in the NewsApp backend.

## Overview

The bias detection feature uses the `d4data/bias-detection-model` from Hugging Face, which is:
- A fine-tuned DistilBERT model (distilbert-base-uncased)
- Trained on the MBAD dataset for 30 epochs
- Can detect bias and fairness in sentences (news articles)

### Model Details
- **Base Model**: distilbert-base-uncased
- **Task**: Sequence Classification (Bias Detection)
- **Training**: 30 epochs, batch size 16, learning rate 5e-5
- **Sequence Length**: Maximum 512 tokens
- **Accuracy**: Train: 76.97%, Validation: 62.00%

## Installation

1. **Install Python dependencies**:
```bash
cd backend
pip install -r requirements.txt
```

2. **Install additional packages** (if not already in requirements.txt):
```bash
pip install transformers tensorflow torch numpy
```

## Model Loading

The bias detection model is loaded automatically when the backend starts. The model will:
1. Download from Hugging Face on first run (~260MB)
2. Load into memory for fast inference
3. Cache locally for subsequent runs

**Note**: First startup may take a few minutes while the model downloads.

## API Endpoints

### 1. Detect Bias in Text

**Endpoint**: `POST /bias/detect`

**Request Body**:
```json
{
  "text": "The irony, of course, is that the exhibit that invites people to throw trash at vacuuming Ivanka Trump lookalike reflects every stereotype feminists claim to stand against."
}
```

**Response**:
```json
{
  "label": "LABEL_1",
  "score": 0.87,
  "category": "biased",
  "bias_score": 0.87
}
```

**Parameters**:
- `label`: The model's prediction label
- `score`: Confidence score (0-1)
- `category`: "neutral" or "biased"
- `bias_score`: Normalized bias score

### 2. Analyze Article for Bias

**Endpoint**: `POST /bias/analyze-article`

**Request Body**:
```json
{
  "title": "Article Title",
  "description": "Article description or content",
  "url": "https://example.com/article",
  "url_to_image": "https://example.com/image.jpg",
  "published_at": "2024-01-01T00:00:00Z",
  "source": {
    "id": "source-id",
    "name": "Source Name"
  }
}
```

**Response**:
```json
{
  "article_title": "Article Title",
  "article_description": "Article description or content",
  "source": "Source Name",
  "bias_detected": true,
  "confidence": 0.87,
  "label": "LABEL_1",
  "category": "biased",
  "analysis": {
    "text_analyzed": "Article Title. Article description or content...",
    "bias_level": "high",
    "category": "biased"
  }
}
```

## Usage in Frontend

The frontend can call these endpoints to analyze articles:

```javascript
// Detect bias in text
const response = await fetch('http://localhost:8000/bias/detect', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: articleTitle + ' ' + articleDescription
  })
});
const result = await response.json();

// Analyze full article
const articleResponse = await fetch('http://localhost:8000/bias/analyze-article', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(article)
});
const biasAnalysis = await articleResponse.json();
```

## How It Works

1. **Text Input**: The model accepts text (up to 512 tokens) from article titles and descriptions
2. **Classification**: It classifies the text as either "neutral/fair" (LABEL_0) or "biased" (LABEL_1)
3. **Confidence Score**: Returns a confidence score from 0-1
4. **Bias Level**: Determines if bias is detected and the level (low, medium, high)

## Error Handling

If the model is not available, you'll receive:
```json
{
  "detail": "Bias detection model not available"
}
```

This can happen if:
- The model failed to load on startup
- Disk space is insufficient
- Network issues prevented model download

## Performance Considerations

- **Memory**: The model uses approximately 260MB of RAM
- **Inference Time**: Typically 50-200ms per article
- **Batch Processing**: For analyzing multiple articles, consider processing in batches

## References

- **Model**: [d4data/bias-detection-model on Hugging Face](https://huggingface.co/d4data/bias-detection-model)
- **Research**: "Bias and Fairness in AI" by Deepak John Reji, Shaina Raza
- **GitHub**: https://github.com/dreji18/Fairness-in-AI
- **Dataset**: MBAD Data
- **Carbon Emissions**: 0.319355 Kg

## Troubleshooting

### Model Fails to Load
- Check disk space (need ~260MB)
- Check internet connection for first-time download
- Review backend logs for detailed error messages

### Slow Performance
- Model loading takes time on first startup
- Consider caching model results for identical text
- Use GPU if available (requires additional setup)

### Out of Memory
- Reduce batch size if processing multiple articles
- Consider using model quantization
- Use cloud inference API instead of local model

## Future Enhancements

Potential improvements:
- Add sentiment analysis integration
- Implement bias score aggregation for multi-article feeds
- Add historical bias trends
- Integrate with user preferences for bias filtering
- Add bias explanations (why text is considered biased)


