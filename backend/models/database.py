from sqlalchemy import Column, Integer, String, Text, DateTime, Float, JSON, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import datetime

Base = declarative_base()

class Article(Base):
    __tablename__ = "articles"
    
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True)
    title = Column(String)
    content = Column(Text)
    source = Column(String)
    language = Column(String, default="bengali")
    sentiment_score = Column(Float)
    sentiment_label = Column(String)
    keywords = Column(JSON)
    published_at = Column(DateTime)
    scraped_at = Column(DateTime, default=func.now())

class SocialMediaPost(Base):
    __tablename__ = "social_media_posts"
    
    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String)  # twitter, reddit, facebook
    post_id = Column(String, unique=True, index=True)
    content = Column(Text)
    author = Column(String)
    engagement_data = Column(JSON)  # likes, shares, comments
    sentiment_score = Column(Float)
    sentiment_label = Column(String)
    hashtags = Column(JSON)
    posted_at = Column(DateTime)
    scraped_at = Column(DateTime, default=func.now())

class PollData(Base):
    __tablename__ = "poll_data"
    
    id = Column(Integer, primary_key=True, index=True)
    poll_source = Column(String)
    constituency = Column(String)
    sample_size = Column(Integer)
    margin_of_error = Column(Float)
    results = Column(JSON)  # party-wise vote share
    poll_date = Column(DateTime)
    created_at = Column(DateTime, default=func.now())

class ElectionPrediction(Base):
    __tablename__ = "election_predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    constituency = Column(String)
    predicted_winner = Column(String)
    confidence_score = Column(Float)
    vote_share_prediction = Column(JSON)
    model_version = Column(String)
    prediction_date = Column(DateTime, default=func.now())

class MonitoringKeyword(Base):
    __tablename__ = "monitoring_keywords"
    
    id = Column(Integer, primary_key=True, index=True)
    keyword = Column(String, index=True)
    category = Column(String)  # political_party, politician, issue
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())