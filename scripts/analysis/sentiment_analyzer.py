#!/usr/bin/env python3
"""
Sentiment analysis utilities for Bengali and English political text
"""

import nltk
from textblob import TextBlob
import pickle
import os
from typing import Dict, List, Tuple
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import re

# Download required NLTK data
try:
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
    nltk.download('vader_lexicon', quiet=True)
except:
    pass

class BengaliSentimentAnalyzer:
    """Sentiment analyzer specifically designed for Bengali political text"""
    
    def __init__(self, model_path: str = None):
        self.model_path = model_path or "./data/models/bengali_sentiment_model.pkl"
        self.vectorizer = TfidfVectorizer(max_features=5000, stop_words='english')
        self.model = LogisticRegression()
        self.is_trained = False
        
        # Bengali political keywords and their sentiment weights
        self.bengali_political_lexicon = {
            # Positive terms
            'উন্নতি': 1, 'ভালো': 1, 'সুন্দর': 1, 'অগ্রগতি': 1, 'সফল': 1,
            'জয়': 1, 'শান্তি': 1, 'স্থিতিশীল': 1, 'কল্যাণ': 1,
            
            # Negative terms  
            'খারাপ': -1, 'দুর্নীতি': -1, 'অশান্তি': -1, 'ব্যর্থ': -1,
            'হিংসা': -1, 'সমস্যা': -1, 'বিতর্ক': -1, 'সংকট': -1,
            
            # Neutral/mixed terms
            'রাজনীতি': 0, 'নির্বাচন': 0, 'সরকার': 0, 'দল': 0
        }
    
    def preprocess_text(self, text: str) -> str:
        """Preprocess Bengali/English mixed text"""
        # Remove URLs, mentions, hashtags
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        text = re.sub(r'@\w+|#\w+', '', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text.lower()
    
    def analyze_sentiment(self, text: str) -> Dict[str, float]:
        """Analyze sentiment of given text"""
        processed_text = self.preprocess_text(text)
        
        # Use TextBlob for basic sentiment (works better for English)
        blob = TextBlob(processed_text)
        textblob_sentiment = blob.sentiment.polarity
        
        # Custom Bengali lexicon-based analysis
        bengali_score = self._analyze_bengali_sentiment(processed_text)
        
        # Combine scores (weighted average)
        combined_score = (textblob_sentiment * 0.6) + (bengali_score * 0.4)
        
        # Classify sentiment
        if combined_score > 0.1:
            sentiment_label = "positive"
        elif combined_score < -0.1:
            sentiment_label = "negative" 
        else:
            sentiment_label = "neutral"
        
        return {
            'sentiment': sentiment_label,
            'confidence': abs(combined_score),
            'score': combined_score,
            'textblob_score': textblob_sentiment,
            'bengali_score': bengali_score
        }
    
    def _analyze_bengali_sentiment(self, text: str) -> float:
        """Analyze sentiment using Bengali political lexicon"""
        words = text.split()
        total_score = 0
        word_count = 0
        
        for word in words:
            if word in self.bengali_political_lexicon:
                total_score += self.bengali_political_lexicon[word]
                word_count += 1
        
        if word_count == 0:
            return 0
        
        return total_score / word_count
    
    def batch_analyze(self, texts: List[str]) -> List[Dict[str, float]]:
        """Analyze sentiment for multiple texts"""
        results = []
        for text in texts:
            result = self.analyze_sentiment(text)
            result['text'] = text[:100] + "..." if len(text) > 100 else text
            results.append(result)
        
        return results
    
    def extract_political_keywords(self, text: str) -> Dict[str, List[str]]:
        """Extract political entities and keywords"""
        processed_text = self.preprocess_text(text)
        
        # Political parties (case-insensitive)
        parties = {
            'TMC': ['tmc', 'trinamool', 'তৃণমূল'],
            'BJP': ['bjp', 'bharatiya janata', 'ভারতীয় জনতা'],
            'CPM': ['cpm', 'communist', 'কমিউনিস্ট'],
            'Congress': ['congress', 'কংগ্রেস']
        }
        
        # Politicians
        politicians = ['mamata', 'modi', 'amit shah', 'মমতা', 'মোদী']
        
        # Political issues
        issues = ['election', 'নির্বাচন', 'corruption', 'দুর্নীতি', 
                 'development', 'উন্নয়ন', 'unemployment', 'বেকারত্ব']
        
        found_entities = {
            'parties': [],
            'politicians': [],
            'issues': []
        }
        
        # Find party mentions
        for party, keywords in parties.items():
            if any(keyword in processed_text for keyword in keywords):
                found_entities['parties'].append(party)
        
        # Find politician mentions
        for politician in politicians:
            if politician in processed_text:
                found_entities['politicians'].append(politician)
        
        # Find issue mentions
        for issue in issues:
            if issue in processed_text:
                found_entities['issues'].append(issue)
        
        return found_entities

def main():
    """Test the sentiment analyzer"""
    analyzer = BengaliSentimentAnalyzer()
    
    # Test texts (mix of Bengali and English)
    test_texts = [
        "বাংলার উন্নতি হচ্ছে, সরকার ভালো কাজ করছে",
        "The political situation in Bengal is very good",
        "দুর্নীতি বন্ধ করতে হবে, এই সরকার ব্যর্থ",
        "TMC is leading in the polls",
        "BJP vs TMC fight is intensifying"
    ]
    
    print("=== Sentiment Analysis Results ===")
    for i, text in enumerate(test_texts, 1):
        result = analyzer.analyze_sentiment(text)
        print(f"\n{i}. Text: {text}")
        print(f"   Sentiment: {result['sentiment']} (confidence: {result['confidence']:.2f})")
        print(f"   Score: {result['score']:.2f}")
        
        # Extract entities
        entities = analyzer.extract_political_keywords(text)
        if any(entities.values()):
            print(f"   Entities: {entities}")

if __name__ == "__main__":
    main()