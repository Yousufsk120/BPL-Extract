# BPL-Extract
Advanced Political Intelligence Platform for Bengal - Web scraping, sentiment analysis, media extraction, social media monitoring, and election prediction system with modern UI

## Quick Start

### Installation
```bash
pip install -r requirements.txt
```

### Running the Application
```bash
python app.py
```

Or use the startup script:
```bash
./start.sh
```

The application will start on `http://localhost:5001`

## API Endpoints

### Main Endpoints
- `GET /` - Service information and available endpoints
- `GET /api/status` - API operational status
- `GET /api/extract/<resource_id>` - Extract political data by resource ID

### Resource ID Format
Resource IDs follow the format: `namespace:subnamespace::identifier-timestamp-hash`

Example: `bom1:bom1::h2bdm-1757262958008-80cc6980dac4`

### Error Handling
The API provides comprehensive error handling for:
- **404 NOT_FOUND**: Resource or endpoint not found
- **400 INVALID_FORMAT**: Malformed resource ID
- **400 MALFORMED_ID**: Resource ID doesn't match expected pattern
- **404 NAMESPACE_NOT_SUPPORTED**: Unsupported namespace in resource ID

## Testing
Run the test suite:
```bash
python test_app.py
```

## Architecture
This is a Flask-based web application designed to handle political intelligence data extraction for Bengal. The system is built with:
- RESTful API design
- Comprehensive error handling
- Structured logging
- Input validation and sanitization

## Development
The application runs in debug mode by default for development. For production deployment, disable debug mode and use a production WSGI server.
