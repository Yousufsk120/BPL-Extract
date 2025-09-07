import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/bpl_extract"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Application
    DEBUG: bool = True
    SECRET_KEY: str = "your_secret_key_here"
    ENVIRONMENT: str = "development"
    
    # API Keys
    TWITTER_API_KEY: Optional[str] = None
    TWITTER_API_SECRET: Optional[str] = None
    TWITTER_ACCESS_TOKEN: Optional[str] = None
    TWITTER_ACCESS_TOKEN_SECRET: Optional[str] = None
    
    REDDIT_CLIENT_ID: Optional[str] = None
    REDDIT_CLIENT_SECRET: Optional[str] = None
    REDDIT_USER_AGENT: str = "BPL-Extract/1.0"
    
    NEWS_API_KEY: Optional[str] = None
    
    # Paths
    WEBDRIVER_PATH: str = "/usr/local/bin/chromedriver"
    SENTIMENT_MODEL_PATH: str = "./data/models/sentiment_model.pkl"
    ELECTION_MODEL_PATH: str = "./data/models/election_model.pkl"
    
    class Config:
        env_file = ".env"

settings = Settings()