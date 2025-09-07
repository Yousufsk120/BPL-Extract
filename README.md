# BPL-Extract: Bengal Political Intelligence Platform

Advanced Political Intelligence Platform for Bengal featuring web scraping, sentiment analysis, media extraction, social media monitoring, and election prediction system with a modern React UI.

## 🎯 Features

- **Web Scraping**: Automated scraping of Bengali political news from major sources
- **Sentiment Analysis**: Bengali and English text sentiment analysis with custom political lexicon
- **Social Media Monitoring**: Real-time monitoring of Twitter, Reddit, and other platforms
- **Election Predictions**: Machine learning-based election outcome predictions
- **Media Extraction**: Automated extraction and analysis of political media content
- **Modern Dashboard**: React-based responsive web interface with real-time analytics

## 🏗️ Architecture

### Backend (Python/FastAPI)
- **API Layer**: RESTful APIs for all platform features
- **Data Models**: SQLAlchemy models for structured data storage
- **Services**: Modular services for scraping, analysis, and predictions
- **Background Tasks**: Celery for scheduled scraping and analysis

### Frontend (React)
- **Dashboard**: Real-time political intelligence overview
- **News Analytics**: News scraping and sentiment analysis interface
- **Social Media**: Social media monitoring and trend analysis
- **Predictions**: Election prediction visualization and analytics

### Data Pipeline
- **Raw Data**: Scraped articles, social media posts, poll data
- **Processed Data**: Cleaned, analyzed, and enriched datasets
- **Models**: Trained ML models for sentiment and election prediction

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- PostgreSQL
- Redis (for background tasks)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yousufsk120/BPL-Extract.git
   cd BPL-Extract
   ```

2. **Run setup script**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and database settings
   ```

4. **Start the services**
   ```bash
   # Backend
   source venv/bin/activate
   python main.py

   # Frontend (in new terminal)
   cd frontend
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - API Documentation: http://localhost:8000/docs

## 📖 Documentation

### API Endpoints

#### News Scraping
- `POST /api/v1/scraping/news` - Scrape news articles
- `GET /api/v1/scraping/sources` - Get available news sources

#### Sentiment Analysis
- `POST /api/v1/sentiment/analyze` - Analyze text sentiment
- `POST /api/v1/sentiment/batch` - Batch sentiment analysis

#### Social Media
- `GET /api/v1/social/twitter/trends` - Get Twitter trends
- `GET /api/v1/social/reddit/posts` - Get Reddit posts
- `POST /api/v1/social/monitor` - Setup monitoring

#### Predictions
- `GET /api/v1/predictions/election` - Get election predictions
- `GET /api/v1/predictions/polls` - Get polling data

### Configuration

#### Database Setup
```sql
CREATE DATABASE bpl_extract;
CREATE USER bpl_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE bpl_extract TO bpl_user;
```

#### API Keys Required
- Twitter API (for social media monitoring)
- Reddit API (for Reddit post analysis)
- News API (for additional news sources)

### Development

#### Running Tests
```bash
# Backend tests
pytest

# Frontend tests
cd frontend && npm test
```

#### Code Style
```bash
# Python formatting
black backend/
flake8 backend/

# Frontend formatting
cd frontend && npm run lint
```

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **Celery**: Distributed task queue
- **BeautifulSoup**: Web scraping
- **Selenium**: Dynamic content scraping
- **NLTK/TextBlob**: Natural language processing
- **Scikit-learn**: Machine learning

### Frontend
- **React**: UI library
- **Material-UI**: Component library
- **Recharts**: Data visualization
- **React Query**: Data fetching
- **React Router**: Navigation

### Infrastructure
- **PostgreSQL**: Primary database
- **Redis**: Caching and task queue
- **Docker**: Containerization (optional)

## 📊 Data Sources

### News Sources
- Anandabazar Patrika
- Ei Samay
- Bartaman Patrika
- The Telegraph (Kolkata)
- Times of India (Bengal edition)

### Social Media
- Twitter (hashtags, mentions)
- Reddit (political subreddits)
- Facebook (public pages)

### Polling Data
- Election Commission data
- Poll aggregation from various sources
- Historical election results

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔒 Privacy & Ethics

This platform is designed for academic and research purposes. All data collection follows ethical guidelines and respects privacy:

- Only public data sources are used
- No personal information is collected
- Rate limiting prevents server overload
- Sentiment analysis is objective and unbiased

## 📞 Support

For support, email support@bpl-extract.com or join our Slack community.

---

**Note**: This platform is for educational and research purposes. Use responsibly and in accordance with all applicable laws and terms of service of data sources.
