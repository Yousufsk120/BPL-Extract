"""
Test suite for BPL-Extract application
"""

import unittest
import json
from app import app

class TestBPLExtract(unittest.TestCase):
    def setUp(self):
        """Set up test client"""
        self.app = app.test_client()
        self.app.testing = True

    def test_index_endpoint(self):
        """Test the main index endpoint"""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(data['service'], 'BPL-Extract')
        self.assertEqual(data['status'], 'active')

    def test_status_endpoint(self):
        """Test the status endpoint"""
        response = self.app.get('/api/status')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(data['status'], 'operational')

    def test_extract_endpoint_valid_format_not_found(self):
        """Test extract endpoint with valid format but resource not found"""
        resource_id = "bom1:bom1::h2bdm-1757262958008-80cc6980dac4"
        response = self.app.get(f'/api/extract/{resource_id}')
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(data['error'], 'NOT_FOUND')
        self.assertEqual(data['code'], 'NOT_FOUND')
        self.assertEqual(data['id'], resource_id)

    def test_extract_endpoint_invalid_format(self):
        """Test extract endpoint with invalid format"""
        response = self.app.get('/api/extract/invalid-format')
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(data['error'], 'INVALID_FORMAT')

    def test_extract_endpoint_malformed_id(self):
        """Test extract endpoint with malformed ID"""
        response = self.app.get('/api/extract/bom1:bom1')
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(data['error'], 'INVALID_FORMAT')

    def test_extract_endpoint_unsupported_namespace(self):
        """Test extract endpoint with unsupported namespace"""
        response = self.app.get('/api/extract/test:test::valid-1234567890-abcdef123456')
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(data['error'], 'NAMESPACE_NOT_SUPPORTED')

    def test_404_handler(self):
        """Test custom 404 error handler"""
        response = self.app.get('/nonexistent')
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(data['error'], 'NOT_FOUND')
        self.assertEqual(data['code'], 'NOT_FOUND')
        self.assertIn('documentation', data)

if __name__ == '__main__':
    unittest.main()