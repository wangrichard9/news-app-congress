# Bias Detection Implementation Summary

## What Was Added

### 1. New Files

#### `backend/bias_detection.py`
A dedicated module for bias detection that:
- Loads the `d4data/bias-detection-model` from Hugging Face
- Provides a `BiasDetector` class with methods to detect bias in text
- Handles model loading errors gracefully
- Returns structured bias detection results

#### `backend/BIAS_DETECTION_SETUP.md`
Comprehensive documentation covering:
- Model details and specifications
- Installation instructions
- API endpoint documentation
- Usage examples
- Troubleshooting guide

### 2. Updated Files

#### `backend/main.py`
- Added import for the bias_detection module
- Added two new Pydantic models: `BiasDetectionRequest` and `BiasDetectionResponse`
- Added two new API endpoints:
  - `POST /bias/detect` - Detect bias in any text
  - `POST /bias/analyze-article` - Analyze a news article for bias

#### `backend/requirements.txt`
Added dependencies:
- `transformers==4.46.0` - Hugging Face transformers library
- `tensorflow==2.17.0` - TensorFlow for model inference
- `torch==2.6.0` - PyTorch (alternate backend)
- `numpy==2.0.2` - Numerical operations

## API Endpoints

### POST /bias/detect

Detects bias in any text input.

**Request**:
```json
{
  "text": "Your text to analyze"
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

### POST /bias/analyze-article

Analyzes a full news article for bias.

**Request**:
```json
{
  "title": "Article Title",
  "description": "Article description",
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
  "article_description": "Article description",
  "source": "Source Name",
  "bias_detected": true,
  "confidence": 0.87,
  "label": "LABEL_1",
  "category": "biased",
  "analysis": {
    "text_analyzed": "Article Title. Article description...",
    "bias_level": "high",
    "category": "biased"
  }
}
```

## Installation and Setup

1. **Install dependencies**:
```bash
cd backend
pip install -r requirements.txt
```

2. **Run the backend**:
```bash
python main.py
```

The model will download automatically on first run (~260MB).

## How the Model Works

The `d4data/bias-detection-model` is a fine-tuned DistilBERT model that:
- Takes text input (up to 512 tokens)
- Classifies it as "neutral/fair" (LABEL_0) or "biased" (LABEL_1)
- Returns a confidence score (0-1)
- Was trained on the MBAD dataset for 30 epochs

**Model Performance**:
- Train Accuracy: 76.97%
- Validation Accuracy: 62.00%
- Carbon Emissions: 0.319355 Kg

## Integration with Frontend

The frontend already has bias detection functionality in `frontend/src/services/biasDetection.js` that uses Hugging Face API. The backend implementation provides an alternative:

**Advantages of Backend Implementation**:
- ✅ No API key required
- ✅ No rate limits
- ✅ Faster inference (no network latency)
- ✅ More control over processing
- ✅ Can process articles in batch

**Current Frontend Approach**:
- Uses Hugging Face Inference API
- Requires API key
- Subject to rate limits

You can now choose to:
1. Keep using the Hugging Face API from frontend
2. Switch to backend implementation for better performance
3. Use both (fallback option)

## Next Steps

To integrate this with your frontend:

1. **Update the frontend service** (`frontend/src/services/biasDetection.js`):
```javascript
// Add backend endpoint option
export async function detectBiasFromBackend(text) {
  const response = await fetch('http://localhost:8000/bias/detect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  return await response.json();
}
```

2. **Update article analysis** to use backend endpoint as an option

3. **Add bias indicators** to articles in the UI based on backend analysis

## Model Reference

**Model**: d4data/bias-detection-model  
**Repository**: https://github.com/dreji18/Fairness-in-AI  
**Authors**: Deepak John Reji, Shaina Raza  
**Research Topic**: Bias and Fairness in AI

## Testing

Test the endpoints using curl:

```bash
# Test text bias detection
curl -X POST "http://localhost:8000/bias/detect" \
  -H "Content-Type: application/json" \
  -d '{"text": "Sample text to analyze"}'

# Test article analysis
curl -X POST "http://localhost:8000/bias/analyze-article" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "description": "This is a test article description",
    "url": "https://example.com",
    "published_at": "2024-01-01T00:00:00Z",
    "source": {"name": "Test Source"}
  }'
```

## Notes

- First startup may take a few minutes while the model downloads
- The model uses about 260MB of RAM
- Inference time is typically 50-200ms per article
- The model supports up to 512 tokens per text


