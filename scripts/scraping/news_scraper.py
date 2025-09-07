#!/usr/bin/env python3
"""
Web scraping utilities for Bengali political news sources
"""

import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
import logging
from typing import List, Dict, Any
from backend.config.settings import settings

class NewsSource:
    def __init__(self, name: str, base_url: str, selectors: Dict[str, str]):
        self.name = name
        self.base_url = base_url
        self.selectors = selectors

# Define news sources with their CSS selectors
NEWS_SOURCES = {
    'anandabazar': NewsSource(
        name='Anandabazar Patrika',
        base_url='https://www.anandabazar.com',
        selectors={
            'article_links': 'a.story-card-link',
            'title': 'h1.story-headline',
            'content': '.story-content p',
            'date': '.story-date'
        }
    ),
    'eisamay': NewsSource(
        name='Ei Samay',
        base_url='https://eisamay.indiatimes.com',
        selectors={
            'article_links': 'a[data-nid]',
            'title': 'h1',
            'content': '.article-content p',
            'date': '.publish-date'
        }
    ),
    'bartaman': NewsSource(
        name='Bartaman',
        base_url='https://bartamanpatrika.com',
        selectors={
            'article_links': '.news-title a',
            'title': '.news-details h1',
            'content': '.news-details-content p',
            'date': '.news-date'
        }
    )
}

class PoliticalNewsScraper:
    def __init__(self):
        self.setup_webdriver()
        self.setup_logging()
    
    def setup_webdriver(self):
        """Setup Chrome WebDriver with appropriate options"""
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        
        try:
            self.driver = webdriver.Chrome(options=chrome_options)
        except Exception as e:
            logging.error(f"Failed to setup WebDriver: {e}")
            self.driver = None
    
    def setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger(__name__)
    
    def scrape_articles(self, source_name: str, max_articles: int = 10) -> List[Dict[str, Any]]:
        """Scrape articles from a specific news source"""
        if source_name not in NEWS_SOURCES:
            raise ValueError(f"Unknown news source: {source_name}")
        
        source = NEWS_SOURCES[source_name]
        articles = []
        
        try:
            if self.driver:
                self.driver.get(source.base_url)
                time.sleep(3)  # Wait for page to load
                
                # Find article links
                soup = BeautifulSoup(self.driver.page_source, 'html.parser')
                article_links = soup.select(source.selectors['article_links'])[:max_articles]
                
                for link in article_links:
                    article_url = link.get('href')
                    if not article_url.startswith('http'):
                        article_url = source.base_url + article_url
                    
                    article_data = self.scrape_single_article(article_url, source)
                    if article_data:
                        articles.append(article_data)
                        time.sleep(1)  # Be respectful to the server
                        
        except Exception as e:
            self.logger.error(f"Error scraping {source_name}: {e}")
        
        return articles
    
    def scrape_single_article(self, url: str, source: NewsSource) -> Dict[str, Any]:
        """Scrape a single article"""
        try:
            self.driver.get(url)
            time.sleep(2)
            
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            
            # Extract article data
            title_elem = soup.select_one(source.selectors['title'])
            content_elems = soup.select(source.selectors['content'])
            date_elem = soup.select_one(source.selectors['date'])
            
            title = title_elem.get_text().strip() if title_elem else ""
            content = " ".join([p.get_text().strip() for p in content_elems])
            date = date_elem.get_text().strip() if date_elem else ""
            
            return {
                'url': url,
                'title': title,
                'content': content,
                'source': source.name,
                'date': date,
                'scraped_at': time.strftime('%Y-%m-%d %H:%M:%S')
            }
            
        except Exception as e:
            self.logger.error(f"Error scraping article {url}: {e}")
            return None
    
    def close(self):
        """Close the WebDriver"""
        if self.driver:
            self.driver.quit()

def main():
    """Main function for testing"""
    scraper = PoliticalNewsScraper()
    
    try:
        # Scrape articles from each source
        for source_name in NEWS_SOURCES.keys():
            print(f"Scraping {source_name}...")
            articles = scraper.scrape_articles(source_name, max_articles=3)
            print(f"Found {len(articles)} articles from {source_name}")
            
            for article in articles:
                print(f"- {article['title']}")
    
    finally:
        scraper.close()

if __name__ == "__main__":
    main()