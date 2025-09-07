# BPL-Extract
Advanced Political Intelligence Platform for Bengal - Web scraping, sentiment analysis, media extraction, social media monitoring, and election prediction system with modern UI

## Features

- ✅ **Retry Mechanism**: Robust HTTP request handling with configurable retry logic
- ✅ **Default Configuration**: Works perfectly out of the box with sensible defaults
- 🔄 **Web Scraping**: Extract political news and social media data
- 📊 **Data Analysis**: Sentiment analysis and trend detection
- 💾 **Data Storage**: Automated saving with backup functionality
- 📝 **Comprehensive Logging**: Detailed logging for monitoring and debugging

## Quick Start

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run with Default Configuration**:
   ```bash
   python bpl_extract.py
   ```

The application will use the default `config.json` file and work perfectly out of the box!

## Configuration

The default configuration file (`config.json`) includes:

- **Retry Settings**: 3 max retries, 1-second delay between retries
- **Target Sources**: Example news sources and social media keywords
- **Output Settings**: JSON format with automatic backup
- **Scraping Parameters**: Timeout, user agent, and other HTTP settings

## Testing

Run the test suite to verify retry mechanisms and default configuration:

```bash
python test_bpl_extract.py
```

## Usage Examples

### Basic Usage
```python
from bpl_extract import RetryableExtractor

# Initialize with default config
extractor = RetryableExtractor()

# Run extraction process
success = extractor.run_extraction()
```

### Custom Configuration
```python
# Use custom config file
extractor = RetryableExtractor("my_config.json")
```

## Output

Extracted data is saved to the `./data/` directory in JSON format with timestamps. Backups are automatically created in `./data/backup/`.

## Architecture

- **RetryableExtractor**: Main class handling extraction with retry logic
- **Configuration Management**: JSON-based configuration with validation
- **Error Handling**: Comprehensive error handling and logging
- **Data Pipeline**: Extract → Process → Save → Backup
