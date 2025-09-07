# Deployment Guide

This guide covers deploying BPL-Extract to production environments.

## Prerequisites

- Ubuntu 20.04+ or CentOS 8+
- Docker and Docker Compose
- Domain name with SSL certificate
- Minimum 4GB RAM, 2 CPU cores
- PostgreSQL database
- Redis instance

## Environment Setup

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y python3.8 python3-pip nodejs npm postgresql postgresql-contrib redis-server nginx

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Database Setup

```bash
# Create database and user
sudo -u postgres psql
CREATE DATABASE bpl_extract_prod;
CREATE USER bpl_prod_user WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE bpl_extract_prod TO bpl_prod_user;
ALTER USER bpl_prod_user CREATEDB;
\q
```

### 3. Application Deployment

```bash
# Clone repository
git clone https://github.com/Yousufsk120/BPL-Extract.git
cd BPL-Extract

# Create production environment file
cp .env.example .env.production
```

Edit `.env.production`:

```bash
# Database
DATABASE_URL=postgresql://bpl_prod_user:secure_password_here@localhost/bpl_extract_prod

# Redis
REDIS_URL=redis://localhost:6379

# Application
DEBUG=False
SECRET_KEY=your_very_secure_secret_key_here
ENVIRONMENT=production

# API Keys (obtain from respective platforms)
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret

REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret

NEWS_API_KEY=your_news_api_key

# Security
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

## Docker Deployment

### 1. Create Dockerfile

```dockerfile
# Backend Dockerfile
FROM python:3.8-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Docker Compose Configuration

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://bpl_prod_user:secure_password@db:5432/bpl_extract_prod
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=https://api.your-domain.com

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=bpl_extract_prod
      - POSTGRES_USER=bpl_prod_user
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

  celery:
    build: .
    command: celery -A backend.tasks worker --loglevel=info
    depends_on:
      - db
      - redis
    environment:
      - DATABASE_URL=postgresql://bpl_prod_user:secure_password@db:5432/bpl_extract_prod
      - REDIS_URL=redis://redis:6379

volumes:
  postgres_data:
```

### 3. Deploy with Docker

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# Run database migrations
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Nginx Configuration

### 1. SSL Certificate

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 2. Nginx Configuration

```nginx
# /etc/nginx/sites-available/bpl-extract
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support
    location /ws/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # Static files
    location /static/ {
        alias /var/www/bpl-extract/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/bpl-extract /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Process Management

### 1. Systemd Services

Create service files:

```ini
# /etc/systemd/system/bpl-extract-backend.service
[Unit]
Description=BPL-Extract Backend
After=network.target

[Service]
User=bpl-extract
Group=bpl-extract
WorkingDirectory=/opt/bpl-extract
Environment=PATH=/opt/bpl-extract/venv/bin
ExecStart=/opt/bpl-extract/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```ini
# /etc/systemd/system/bpl-extract-celery.service
[Unit]
Description=BPL-Extract Celery Worker
After=network.target

[Service]
User=bpl-extract
Group=bpl-extract
WorkingDirectory=/opt/bpl-extract
Environment=PATH=/opt/bpl-extract/venv/bin
ExecStart=/opt/bpl-extract/venv/bin/celery -A backend.tasks worker --loglevel=info
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start services:

```bash
sudo systemctl daemon-reload
sudo systemctl enable bpl-extract-backend bpl-extract-celery
sudo systemctl start bpl-extract-backend bpl-extract-celery
```

## Monitoring and Logging

### 1. Application Monitoring

Install monitoring tools:

```bash
# Install Prometheus and Grafana
docker run -d --name prometheus -p 9090:9090 prom/prometheus
docker run -d --name grafana -p 3001:3000 grafana/grafana
```

### 2. Log Management

Configure log rotation:

```bash
# /etc/logrotate.d/bpl-extract
/opt/bpl-extract/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 bpl-extract bpl-extract
    postrotate
        systemctl reload bpl-extract-backend
    endscript
}
```

### 3. Health Checks

Create health check script:

```bash
#!/bin/bash
# /opt/bpl-extract/health-check.sh

# Check backend
if curl -f http://localhost:8000/api/v1/health > /dev/null 2>&1; then
    echo "Backend: OK"
else
    echo "Backend: FAILED"
    systemctl restart bpl-extract-backend
fi

# Check database
if pg_isready -h localhost -U bpl_prod_user > /dev/null 2>&1; then
    echo "Database: OK"
else
    echo "Database: FAILED"
fi
```

Add to crontab:

```bash
# Run health check every 5 minutes
*/5 * * * * /opt/bpl-extract/health-check.sh >> /var/log/bpl-extract-health.log 2>&1
```

## Security Considerations

### 1. Firewall Configuration

```bash
# Configure UFW
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

### 2. Database Security

```bash
# Secure PostgreSQL
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'secure_postgres_password';"

# Edit postgresql.conf
sudo nano /etc/postgresql/13/main/postgresql.conf
# Set: listen_addresses = 'localhost'

# Edit pg_hba.conf
sudo nano /etc/postgresql/13/main/pg_hba.conf
# Change all 'md5' to 'scram-sha-256'
```

### 3. Application Security

- Regular security updates
- Strong passwords and API keys
- Rate limiting enabled
- CORS properly configured
- HTTPS enforced
- Regular backups

## Backup Strategy

### 1. Database Backup

```bash
#!/bin/bash
# /opt/bpl-extract/backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/bpl-extract/backups"
DB_NAME="bpl_extract_prod"

mkdir -p $BACKUP_DIR

pg_dump -h localhost -U bpl_prod_user $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Keep only last 30 days of backups
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete
```

### 2. Application Backup

```bash
#!/bin/bash
# /opt/bpl-extract/backup-app.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/bpl-extract/backups"

tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz \
    --exclude='venv' \
    --exclude='__pycache__' \
    --exclude='node_modules' \
    /opt/bpl-extract/

# Keep only last 7 days of app backups
find $BACKUP_DIR -name "app_backup_*.tar.gz" -mtime +7 -delete
```

## Scaling Considerations

### 1. Load Balancing

For high traffic, deploy multiple backend instances behind a load balancer:

```nginx
upstream backend {
    server localhost:8000;
    server localhost:8001;
    server localhost:8002;
}
```

### 2. Database Scaling

- Read replicas for analytics queries
- Connection pooling with PgBouncer
- Database partitioning for large datasets

### 3. Caching

- Redis for session storage
- CDN for static assets
- Application-level caching

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Check PostgreSQL service status
   - Verify connection string
   - Check firewall rules

2. **High memory usage**
   - Monitor Celery worker memory
   - Implement memory limits
   - Regular process restarts

3. **Slow API responses**
   - Check database query performance
   - Monitor Redis memory usage
   - Implement caching

### Log Locations

- Application logs: `/opt/bpl-extract/logs/`
- Nginx logs: `/var/log/nginx/`
- PostgreSQL logs: `/var/log/postgresql/`
- System logs: `/var/log/syslog`