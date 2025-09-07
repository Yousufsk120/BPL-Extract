import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "BPL-Extract" in data["message"]

def test_health_endpoint():
    """Test the health check endpoint"""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "BPL-Extract" in data["service"]

def test_scraping_sources_endpoint():
    """Test the news sources endpoint"""
    response = client.get("/api/v1/scraping/sources")
    assert response.status_code == 200
    data = response.json()
    assert "bengali_sources" in data
    assert "english_sources" in data
    assert len(data["bengali_sources"]) > 0

def test_sentiment_analyze_endpoint():
    """Test sentiment analysis endpoint"""
    test_data = {
        "text": "This is a positive political statement",
        "language": "english"
    }
    response = client.post("/api/v1/sentiment/analyze", json=test_data)
    assert response.status_code == 200
    data = response.json()
    assert "sentiment" in data
    assert "confidence" in data

def test_twitter_trends_endpoint():
    """Test Twitter trends endpoint"""
    response = client.get("/api/v1/social/twitter/trends")
    assert response.status_code == 200
    data = response.json()
    assert "trends" in data
    assert "timestamp" in data

def test_election_predictions_endpoint():
    """Test election predictions endpoint"""
    response = client.get("/api/v1/predictions/election")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        assert "constituency" in data[0]
        assert "predicted_winner" in data[0]