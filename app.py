"""
BPL-Extract: Advanced Political Intelligence Platform for Bengal
Main Flask application handling web scraping, sentiment analysis, and election prediction
"""

from flask import Flask, jsonify, request
import re
import logging

app = Flask(__name__)
app.config['DEBUG'] = True

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/')
def index():
    """Main landing page for BPL-Extract platform"""
    return jsonify({
        "service": "BPL-Extract",
        "description": "Advanced Political Intelligence Platform for Bengal",
        "version": "1.0.0",
        "status": "active",
        "endpoints": [
            "/",
            "/api/extract/<resource_id>",
            "/api/status"
        ]
    })

@app.route('/api/status')
def status():
    """API status endpoint"""
    return jsonify({
        "status": "operational",
        "service": "BPL-Extract API",
        "version": "1.0.0"
    })

@app.route('/api/extract/<path:resource_id>')
def extract_resource(resource_id):
    """
    Handle resource extraction requests with hierarchical IDs
    Format: bom1:bom1::h2bdm-<timestamp>-<hash>
    """
    logger.info(f"Request for resource: {resource_id}")
    
    # Validate resource ID format
    pattern = r'^[a-zA-Z0-9]+:[a-zA-Z0-9]+::[a-zA-Z0-9]+-\d+-[a-f0-9]+$'
    
    if not re.match(pattern, resource_id):
        return jsonify({
            "error": "INVALID_FORMAT",
            "message": "Resource ID format is invalid",
            "expected_format": "namespace:subnamespace::identifier-timestamp-hash",
            "provided": resource_id
        }), 400
    
    # Parse resource ID components
    try:
        namespace_part, identifier_part = resource_id.split('::')
        namespace, subnamespace = namespace_part.split(':')
        
        # For this example, we'll simulate resource lookup
        # In a real implementation, this would query a database or external service
        if namespace == "bom1" and subnamespace == "bom1":
            # Simulate resource not found (as per the original error)
            return jsonify({
                "error": "NOT_FOUND",
                "code": "NOT_FOUND",
                "id": resource_id,
                "message": f"Resource with ID '{resource_id}' was not found",
                "suggestion": "Please check the resource ID and try again, or contact support if you believe this is an error"
            }), 404
        else:
            return jsonify({
                "error": "NAMESPACE_NOT_SUPPORTED",
                "message": f"Namespace '{namespace}:{subnamespace}' is not supported",
                "supported_namespaces": ["bom1:bom1"]
            }), 404
            
    except ValueError:
        return jsonify({
            "error": "MALFORMED_ID",
            "message": "Resource ID is malformed",
            "provided": resource_id
        }), 400

@app.errorhandler(404)
def not_found(error):
    """Custom 404 error handler"""
    return jsonify({
        "error": "NOT_FOUND",
        "code": "NOT_FOUND",
        "message": "The requested resource was not found",
        "documentation": "Read our documentation to learn more about this error."
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """Custom 500 error handler"""
    return jsonify({
        "error": "INTERNAL_ERROR",
        "code": "INTERNAL_ERROR",
        "message": "An internal server error occurred"
    }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)