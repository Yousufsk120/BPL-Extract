#!/usr/bin/env python3
"""
BPL-Extract: Advanced Political Intelligence Platform for Bengal
Main application with retry mechanisms and default configuration support
"""

import json
import time
import requests
import logging
import os
from typing import Dict, List, Optional
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('bpl_extract.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)


class RetryableExtractor:
    """Main class for BPL political intelligence extraction with retry mechanisms"""
    
    def __init__(self, config_path: str = "config.json"):
        """Initialize with configuration file"""
        self.config = self.load_config(config_path)
        self.session = requests.Session()
        self.setup_session()
        
    def load_config(self, config_path: str) -> Dict:
        """Load configuration from file with error handling"""
        try:
            with open(config_path, 'r') as f:
                config = json.load(f)
                logger.info(f"Configuration loaded successfully from {config_path}")
                return config
        except FileNotFoundError:
            logger.error(f"Configuration file {config_path} not found")
            raise
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON in configuration file {config_path}")
            raise
            
    def setup_session(self):
        """Setup HTTP session with default headers"""
        self.session.headers.update({
            'User-Agent': self.config['scraping']['user_agent']
        })
        
    def retry_request(self, url: str, max_retries: Optional[int] = None) -> Optional[requests.Response]:
        """
        Make HTTP request with retry logic
        
        Args:
            url: URL to fetch
            max_retries: Maximum number of retries (uses config default if None)
            
        Returns:
            Response object or None if all retries failed
        """
        if max_retries is None:
            max_retries = self.config['scraping']['max_retries']
            
        retry_delay = self.config['scraping']['retry_delay']
        timeout = self.config['scraping']['timeout']
        
        for attempt in range(max_retries + 1):
            try:
                logger.info(f"Attempting to fetch {url} (attempt {attempt + 1}/{max_retries + 1})")
                response = self.session.get(url, timeout=timeout)
                response.raise_for_status()
                logger.info(f"Successfully fetched {url}")
                return response
                
            except requests.exceptions.RequestException as e:
                logger.warning(f"Attempt {attempt + 1} failed for {url}: {str(e)}")
                
                if attempt < max_retries:
                    logger.info(f"Retrying in {retry_delay} seconds...")
                    time.sleep(retry_delay)
                else:
                    logger.error(f"All retry attempts failed for {url}")
                    
        return None
        
    def extract_news_data(self) -> List[Dict]:
        """Extract political news data from configured sources"""
        logger.info("Starting news data extraction")
        extracted_data = []
        
        news_sources = self.config['targets']['news_sources']
        
        for source_url in news_sources:
            response = self.retry_request(source_url)
            
            if response:
                # Basic data extraction (in real implementation, would parse HTML)
                data = {
                    'source': source_url,
                    'timestamp': datetime.now().isoformat(),
                    'status': 'success',
                    'content_length': len(response.content),
                    'status_code': response.status_code
                }
                extracted_data.append(data)
                logger.info(f"Extracted data from {source_url}")
            else:
                # Log failure but continue with other sources
                data = {
                    'source': source_url,
                    'timestamp': datetime.now().isoformat(),
                    'status': 'failed',
                    'error': 'All retry attempts failed'
                }
                extracted_data.append(data)
                
        return extracted_data
        
    def save_data(self, data: List[Dict]) -> bool:
        """Save extracted data to configured output location"""
        try:
            output_config = self.config['output']
            save_path = output_config['save_path']
            
            # Ensure output directory exists
            os.makedirs(save_path, exist_ok=True)
            
            # Generate filename with timestamp
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"bpl_extract_{timestamp}.json"
            filepath = os.path.join(save_path, filename)
            
            # Save data
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2)
                
            logger.info(f"Data saved successfully to {filepath}")
            
            # Create backup if enabled
            if output_config.get('backup_enabled', False):
                backup_path = os.path.join(save_path, 'backup', filename)
                os.makedirs(os.path.dirname(backup_path), exist_ok=True)
                with open(backup_path, 'w') as f:
                    json.dump(data, f, indent=2)
                logger.info(f"Backup created at {backup_path}")
                
            return True
            
        except Exception as e:
            logger.error(f"Failed to save data: {str(e)}")
            return False
            
    def run_extraction(self) -> bool:
        """Run the complete extraction process"""
        try:
            logger.info("BPL-Extract starting...")
            
            # Extract data with retry mechanisms
            extracted_data = self.extract_news_data()
            
            if not extracted_data:
                logger.warning("No data extracted")
                return False
                
            # Save data
            success = self.save_data(extracted_data)
            
            if success:
                logger.info("BPL-Extract completed successfully")
                return True
            else:
                logger.error("BPL-Extract failed to save data")
                return False
                
        except Exception as e:
            logger.error(f"BPL-Extract failed with error: {str(e)}")
            return False


def main():
    """Main entry point"""
    try:
        # Initialize extractor with default config
        extractor = RetryableExtractor()
        
        # Run extraction
        success = extractor.run_extraction()
        
        if success:
            print("✅ BPL-Extract completed successfully!")
            print("📊 Check the data directory for extracted results")
        else:
            print("❌ BPL-Extract failed. Check logs for details.")
            exit(1)
            
    except Exception as e:
        print(f"❌ Critical error: {str(e)}")
        logger.error(f"Critical error in main: {str(e)}")
        exit(1)


if __name__ == "__main__":
    main()