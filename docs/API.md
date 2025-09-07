# API Documentation

## Overview

The BPL-Extract API provides endpoints for political intelligence operations including web scraping, sentiment analysis, social media monitoring, and election predictions.

Base URL: `http://localhost:8000/api/v1`

## Authentication

Currently, the API does not require authentication for development. In production, implement proper API key authentication.

## Endpoints

### Health Check

**GET** `/health`

Returns the health status of the API.

**Response:**
```json
{
  "status": "healthy",
  "service": "BPL-Extract API"
}
```

### News Scraping

#### Scrape News Articles

**POST** `/scraping/news`

Scrape political news articles from specified URLs.

**Request Body:**
```json
{
  "urls": ["https://example.com/news1", "https://example.com/news2"],
  "target_keywords": ["bengal", "politics", "election"]
}
```

**Response:**
```json
[
  {
    "url": "https://example.com/news1",
    "title": "News Article Title",
    "content": "Article content...",
    "extracted_data": {
      "sentiment": "neutral",
      "keywords": ["bengal", "politics"]
    },
    "timestamp": "2023-01-01T00:00:00Z"
  }
]
```

#### Get News Sources

**GET** `/scraping/sources`

Get list of available news sources for scraping.

**Response:**
```json
{
  "bengali_sources": [
    {
      "name": "Anandabazar Patrika",
      "url": "https://www.anandabazar.com"
    }
  ],
  "english_sources": [
    {
      "name": "The Telegraph",
      "url": "https://www.telegraphindia.com"
    }
  ]
}
```

### Sentiment Analysis

#### Analyze Text Sentiment

**POST** `/sentiment/analyze`

Analyze sentiment of given text (supports Bengali and English).

**Request Body:**
```json
{
  "text": "বাংলার রাজনীতি নিয়ে আলোচনা",
  "language": "bengali"
}
```

**Response:**
```json
{
  "text": "বাংলার রাজনীতি নিয়ে আলোচনা",
  "sentiment": "neutral",
  "confidence": 0.75,
  "emotions": {
    "anger": 0.1,
    "joy": 0.3,
    "sadness": 0.2,
    "fear": 0.1
  }
}
```

#### Batch Sentiment Analysis

**POST** `/sentiment/batch`

Analyze sentiment for multiple texts.

**Request Body:**
```json
["Text 1", "Text 2", "Text 3"]
```

**Response:**
```json
[
  {
    "text": "Text 1",
    "sentiment": "positive",
    "confidence": 0.85,
    "emotions": {...}
  }
]
```

#### Extract Keywords

**GET** `/sentiment/keywords/{text}`

Extract political keywords from text.

**Response:**
```json
{
  "keywords": ["bengal", "election", "politics", "party"],
  "entities": ["TMC", "BJP", "CPM", "Congress"],
  "locations": ["Kolkata", "Bengal", "West Bengal"]
}
```

### Social Media Monitoring

#### Get Twitter Trends

**GET** `/social/twitter/trends`

Get trending political topics on Twitter for Bengal.

**Response:**
```json
{
  "trends": [
    {
      "topic": "#BengalPolitics",
      "volume": 5000
    }
  ],
  "timestamp": "2023-01-01T00:00:00Z"
}
```

#### Get Reddit Posts

**GET** `/social/reddit/posts?limit=10`

Get political posts from Bengal-related subreddits.

**Parameters:**
- `limit` (optional): Number of posts to retrieve (default: 10)

**Response:**
```json
{
  "posts": [
    {
      "subreddit": "r/kolkata",
      "title": "Political Discussion",
      "content": "Sample political discussion content",
      "upvotes": 150,
      "comments": 45,
      "timestamp": "2023-01-01T00:00:00Z"
    }
  ]
}
```

#### Setup Social Media Monitoring

**POST** `/social/monitor`

Set up social media monitoring for specific keywords.

**Request Body:**
```json
{
  "keywords": ["bengal politics", "election"],
  "platforms": ["twitter", "reddit"]
}
```

**Response:**
```json
{
  "message": "Monitoring setup successful",
  "keywords": ["bengal politics", "election"],
  "platforms": ["twitter", "reddit"],
  "status": "active"
}
```

#### Get Platform Analytics

**GET** `/social/analytics/{platform}`

Get analytics for a specific social media platform.

**Parameters:**
- `platform`: Platform name (twitter, reddit, facebook)

**Response:**
```json
{
  "platform": "twitter",
  "total_posts": 1500,
  "sentiment_breakdown": {
    "positive": 45,
    "neutral": 35,
    "negative": 20
  },
  "top_hashtags": ["#BengalPolitics", "#Election2024", "#Democracy"]
}
```

### Election Predictions

#### Get Election Predictions

**GET** `/predictions/election`

Get election predictions for Bengal constituencies.

**Response:**
```json
[
  {
    "constituency": "Kolkata North",
    "predicted_winner": "TMC",
    "confidence": 0.75,
    "vote_share_prediction": {
      "TMC": 45.5,
      "BJP": 35.2,
      "CPM": 12.1,
      "Congress": 7.2
    }
  }
]
```

#### Get Polling Data

**GET** `/predictions/polls`

Get latest polling data and trends.

**Response:**
```json
{
  "latest_poll": {
    "date": "2023-12-01",
    "sample_size": 2500,
    "margin_of_error": 3.5,
    "results": {
      "TMC": 38.5,
      "BJP": 35.2,
      "CPM": 15.1,
      "Congress": 8.7,
      "Others": 2.5
    }
  },
  "trend": "TMC leading with slight margin"
}
```

#### Get Swing Analysis

**GET** `/predictions/swing-analysis`

Analyze vote swing patterns.

**Response:**
```json
{
  "overall_swing": {
    "from_previous": {
      "TMC": -2.3,
      "BJP": +1.8,
      "CPM": -0.5,
      "Congress": +1.0
    }
  },
  "key_constituencies": [
    {
      "name": "Kolkata North",
      "swing": "TMC to BJP: -3.2%"
    }
  ]
}
```

#### Update Prediction Model

**POST** `/predictions/update-model`

Update the election prediction model with new data.

**Request Body:**
```json
{
  "data_source": "poll",
  "data": {...}
}
```

**Response:**
```json
{
  "message": "Model updated successfully",
  "accuracy_improvement": "+2.3%",
  "last_updated": "2023-12-05T10:30:00Z"
}
```

## Error Handling

All endpoints return standard HTTP status codes:

- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error description",
  "detail": "Detailed error message"
}
```

## Rate Limiting

API endpoints are rate limited to prevent abuse:
- 100 requests per minute for general endpoints
- 10 requests per minute for scraping endpoints
- 1000 requests per minute for analysis endpoints

## WebSocket Support

Real-time updates are available via WebSocket connections:
- `ws://localhost:8000/ws/trends` - Real-time trend updates
- `ws://localhost:8000/ws/alerts` - Real-time alerts and notifications