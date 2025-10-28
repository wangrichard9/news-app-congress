from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import httpx
import os
from datetime import datetime
import json

# Import bias detection module
from bias_detection import bias_detector

app = FastAPI(title="NewsApp API", version="1.0.0")

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (replace with database in production)
users_db = {}
user_preferences_db = {}
reading_history_db = {}

# Pydantic models
class UserCreate(BaseModel):
    username: str
    email: str

class UserResponse(BaseModel):
    user_id: str
    username: str
    email: str
    created_at: str

class UserPreferences(BaseModel):
    interests: List[str] = []
    preferred_sources: List[str] = []
    blocked_sources: List[str] = []
    bias_preference: str = "all"
    language: str = "en"
    country: str = "us"

class Article(BaseModel):
    title: str
    description: Optional[str] = None
    url: str
    url_to_image: Optional[str] = None
    published_at: str
    source: dict

class ReadingHistoryItem(BaseModel):
    article: Article
    read_at: str

class BiasDetectionRequest(BaseModel):
    text: str

class BiasDetectionResponse(BaseModel):
    label: str
    score: float
    category: str
    bias_score: float

# NewsAPI configuration
NEWSAPI_KEY = os.getenv("NEWSAPI_KEY", "7034edeabe7f4914bf7789e8152ccffe")
NEWSAPI_BASE = "https://newsapi.org/v2"

# Helper functions
def get_user_id(username: str) -> str:
    """Get or create user ID"""
    for user_id, user in users_db.items():
        if user["username"] == username:
            return user_id
    return None

async def fetch_news_api(endpoint: str, params: dict) -> dict:
    """Fetch from NewsAPI"""
    params["apiKey"] = NEWSAPI_KEY
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{NEWSAPI_BASE}/{endpoint}", params=params)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="NewsAPI request failed")
        return response.json()

# API Endpoints

@app.get("/")
def read_root():
    return {"message": "NewsApp API is running!", "version": "1.0.0"}

@app.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate):
    """Create a new user"""
    # Check if username exists
    for existing_user in users_db.values():
        if existing_user["username"] == user.username:
            raise HTTPException(status_code=400, detail="Username already exists")
    
    user_id = f"user_{len(users_db) + 1}"
    new_user = {
        "user_id": user_id,
        "username": user.username,
        "email": user.email,
        "created_at": datetime.now().isoformat()
    }
    users_db[user_id] = new_user
    
    return UserResponse(**new_user)

@app.get("/users/{username}", response_model=UserResponse)
def get_user(username: str):
    """Get user by username"""
    user_id = get_user_id(username)
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(**users_db[user_id])

@app.get("/users/{username}/preferences", response_model=UserPreferences)
def get_user_preferences(username: str):
    """Get user preferences"""
    user_id = get_user_id(username)
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found")
    
    prefs = user_preferences_db.get(user_id, {
        "interests": [],
        "preferred_sources": [],
        "blocked_sources": [],
        "bias_preference": "all",
        "language": "en",
        "country": "us"
    })
    
    return UserPreferences(**prefs)

@app.put("/users/{username}/preferences", response_model=UserPreferences)
def update_user_preferences(username: str, preferences: UserPreferences):
    """Update user preferences"""
    user_id = get_user_id(username)
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_preferences_db[user_id] = preferences.dict()
    return preferences

@app.get("/news/headlines")
async def get_headlines(country: str = "us", category: Optional[str] = None, page_size: int = 20):
    """Get top headlines"""
    params = {"country": country, "pageSize": page_size}
    if category:
        params["category"] = category
    
    return await fetch_news_api("top-headlines", params)

@app.get("/news/search")
async def search_news(
    q: str, 
    language: str = "en", 
    sort_by: str = "publishedAt", 
    page_size: int = 20
):
    """Search news articles"""
    params = {
        "q": q,
        "language": language,
        "sortBy": sort_by,
        "pageSize": page_size
    }
    
    return await fetch_news_api("everything", params)

@app.get("/news/personalized/{username}")
async def get_personalized_news(username: str, limit: int = 20):
    """Get personalized news for user"""
    user_id = get_user_id(username)
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found")
    
    prefs = user_preferences_db.get(user_id, {})
    interests = prefs.get("interests", [])
    
    if interests:
        # Search based on interests
        query = " OR ".join([f'"{interest}"' for interest in interests])
        result = await search_news(q=query, page_size=limit)
    else:
        # Fallback to headlines
        result = await get_headlines(page_size=limit)
    
    return result

@app.post("/users/{username}/reading-history")
def add_reading_history(username: str, history_item: ReadingHistoryItem):
    """Add article to reading history"""
    user_id = get_user_id(username)
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_id not in reading_history_db:
        reading_history_db[user_id] = []
    
    reading_history_db[user_id].append(history_item.dict())
    
    # Keep only last 100 items
    if len(reading_history_db[user_id]) > 100:
        reading_history_db[user_id] = reading_history_db[user_id][-100:]
    
    return {"message": "Reading history updated"}

@app.get("/users/{username}/reading-history")
def get_reading_history(username: str):
    """Get user's reading history"""
    user_id = get_user_id(username)
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found")
    
    return reading_history_db.get(user_id, [])

@app.get("/users/{username}/insights")
def get_user_insights(username: str):
    """Get user reading insights"""
    user_id = get_user_id(username)
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found")
    
    history = reading_history_db.get(user_id, [])
    
    if not history:
        return {
            "total_read": 0,
            "top_sources": [],
            "top_topics": []
        }
    
    # Analyze reading patterns
    source_counts = {}
    topic_counts = {}
    
    for item in history:
        article = item["article"]
        
        # Count sources
        source_name = article.get("source", {}).get("name", "Unknown")
        source_counts[source_name] = source_counts.get(source_name, 0) + 1
        
        # Simple topic extraction
        title_words = article.get("title", "").lower().split()
        for word in title_words:
            if len(word) > 4:
                topic_counts[word] = topic_counts.get(word, 0) + 1
    
    top_sources = [
        {"source": source, "count": count}
        for source, count in sorted(source_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    ]
    
    top_topics = [
        {"topic": topic, "count": count}
        for topic, count in sorted(topic_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    ]
    
    return {
        "total_read": len(history),
        "top_sources": top_sources,
        "top_topics": top_topics
    }

@app.post("/bias/detect", response_model=BiasDetectionResponse)
def detect_bias(request: BiasDetectionRequest):
    """Detect bias in text using the d4data/bias-detection-model"""
    if not bias_detector.is_available():
        raise HTTPException(status_code=503, detail="Bias detection model not available")
    
    try:
        # Detect bias in the text
        result = bias_detector.detect_bias(request.text)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        label = result.get("label", "UNKNOWN")
        score = result.get("score", 0.0)
        category = result.get("category", "unknown")
        is_biased = result.get("is_biased", False)
        
        # Calculate bias score based on model output
        bias_score = score if is_biased else -score
        
        return BiasDetectionResponse(
            label=label,
            score=score,
            category=category,
            bias_score=bias_score
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during bias detection: {str(e)}")

@app.post("/bias/analyze-article")
def analyze_article_bias(article: Article):
    """Analyze bias in a news article"""
    if not bias_detector.is_available():
        raise HTTPException(status_code=503, detail="Bias detection model not available")
    
    try:
        # Combine title and description for analysis
        text = f"{article.title}. {article.description or ''}".strip()
        
        # Detect bias
        result = bias_detector.detect_bias(text)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        label = result.get("label", "UNKNOWN")
        score = result.get("score", 0.0)
        category = result.get("category", "unknown")
        is_biased = result.get("is_biased", False)
        
        # Source bias information (if available)
        source_name = article.source.get("name", "Unknown")
        
        # Determine bias level
        if not is_biased:
            bias_level = "none"
        elif score > 0.8:
            bias_level = "high"
        elif score > 0.5:
            bias_level = "medium"
        else:
            bias_level = "low"
        
        return {
            "article_title": article.title,
            "article_description": article.description,
            "source": source_name,
            "bias_detected": is_biased,
            "confidence": score,
            "label": label,
            "category": category,
            "analysis": {
                "text_analyzed": text[:200] + "..." if len(text) > 200 else text,
                "bias_level": bias_level,
                "category": category
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during article analysis: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)