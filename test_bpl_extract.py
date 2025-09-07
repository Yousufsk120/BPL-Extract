#!/usr/bin/env python3
"""
Test script for BPL-Extract application
Tests retry mechanisms and default configuration functionality
"""

import unittest
import json
import os
import tempfile
import shutil
from unittest.mock import patch, Mock
from bpl_extract import RetryableExtractor


class TestBPLExtract(unittest.TestCase):
    """Test cases for BPL-Extract functionality"""
    
    def setUp(self):
        """Set up test environment"""
        self.test_dir = tempfile.mkdtemp()
        self.config_path = os.path.join(self.test_dir, "test_config.json")
        
        # Create test configuration
        test_config = {
            "scraping": {
                "max_retries": 2,
                "retry_delay": 0.1,
                "timeout": 5,
                "user_agent": "Test-BPL-Extract/1.0"
            },
            "targets": {
                "news_sources": ["https://httpbin.org/status/200"]
            },
            "output": {
                "format": "json",
                "save_path": os.path.join(self.test_dir, "data"),
                "backup_enabled": True
            }
        }
        
        with open(self.config_path, 'w') as f:
            json.dump(test_config, f)
            
    def tearDown(self):
        """Clean up test environment"""
        shutil.rmtree(self.test_dir)
        
    def test_config_loading(self):
        """Test configuration file loading"""
        extractor = RetryableExtractor(self.config_path)
        self.assertEqual(extractor.config['scraping']['max_retries'], 2)
        self.assertEqual(extractor.config['scraping']['user_agent'], "Test-BPL-Extract/1.0")
        
    def test_config_loading_missing_file(self):
        """Test handling of missing configuration file"""
        with self.assertRaises(FileNotFoundError):
            RetryableExtractor("nonexistent_config.json")
            
    @patch('requests.Session.get')
    def test_retry_success_on_first_attempt(self, mock_get):
        """Test successful request on first attempt"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.content = b"test content"
        mock_response.raise_for_status.return_value = None  # Success case
        mock_get.return_value = mock_response
        
        extractor = RetryableExtractor(self.config_path)
        response = extractor.retry_request("https://test.com")
        
        self.assertIsNotNone(response)
        self.assertEqual(mock_get.call_count, 1)
        
    @patch('requests.Session.get')
    @patch('time.sleep')  # Mock sleep to speed up tests
    def test_retry_mechanism(self, mock_sleep, mock_get):
        """Test retry mechanism on failure"""
        # First call fails, second succeeds
        import requests
        
        mock_response_fail = Mock()
        mock_response_fail.raise_for_status.side_effect = requests.exceptions.RequestException("Connection error")
        
        mock_response_success = Mock()
        mock_response_success.status_code = 200
        mock_response_success.content = b"test content"
        mock_response_success.raise_for_status.return_value = None  # Success case
        
        mock_get.side_effect = [mock_response_fail, mock_response_success]
        
        extractor = RetryableExtractor(self.config_path)
        response = extractor.retry_request("https://test.com")
        
        self.assertIsNotNone(response)
        self.assertEqual(mock_get.call_count, 2)
        self.assertEqual(mock_sleep.call_count, 1)  # Should sleep once between retries
        
    def test_data_saving(self):
        """Test data saving functionality"""
        extractor = RetryableExtractor(self.config_path)
        
        test_data = [
            {
                'source': 'test_source',
                'timestamp': '2024-01-01T00:00:00',
                'status': 'success'
            }
        ]
        
        success = extractor.save_data(test_data)
        self.assertTrue(success)
        
        # Check if data directory was created
        data_dir = os.path.join(self.test_dir, "data")
        self.assertTrue(os.path.exists(data_dir))
        
        # Check if backup directory was created
        backup_dir = os.path.join(data_dir, "backup")
        self.assertTrue(os.path.exists(backup_dir))


def run_manual_test():
    """Run a manual test of the application"""
    print("🧪 Running manual test of BPL-Extract...")
    
    try:
        # Test with default config
        if os.path.exists("config.json"):
            extractor = RetryableExtractor()
            print("✅ Successfully loaded default configuration")
            
            # Test a simple request with retry
            print("🔄 Testing retry mechanism...")
            response = extractor.retry_request("https://httpbin.org/status/200")
            
            if response:
                print("✅ Retry mechanism working correctly")
            else:
                print("❌ Retry mechanism failed")
                
            print("🎯 Manual test completed")
        else:
            print("❌ Default config.json not found")
            
    except Exception as e:
        print(f"❌ Manual test failed: {str(e)}")


if __name__ == "__main__":
    print("BPL-Extract Test Suite")
    print("=" * 50)
    
    # Run unit tests
    print("\n📋 Running unit tests...")
    unittest.main(verbosity=2, exit=False)
    
    # Run manual test
    print("\n" + "=" * 50)
    run_manual_test()