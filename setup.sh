#!/bin/bash

# BPL-Extract Development Setup Script

echo "Setting up BPL-Extract: Bengal Political Intelligence Platform"
echo "============================================================="

# Check if Python 3.8+ is installed
python_version=$(python3 --version 2>&1 | awk '{print $2}' | cut -d. -f1-2)
echo "Python version: $python_version"

if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed."
    exit 1
fi

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create necessary directories
echo "Creating data directories..."
mkdir -p data/raw data/processed data/models
touch data/raw/.gitkeep data/processed/.gitkeep

# Create logs directory
mkdir -p logs

# Copy environment file
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "Please edit .env file with your API keys and configuration"
fi

# Setup frontend (if Node.js is available)
if command -v node &> /dev/null; then
    echo "Setting up frontend..."
    cd frontend
    npm install
    cd ..
else
    echo "Node.js not found. Frontend setup skipped."
    echo "Install Node.js to setup the React frontend."
fi

# Download NLTK data
echo "Downloading NLTK data..."
python3 -c "
import nltk
try:
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
    nltk.download('vader_lexicon', quiet=True)
    print('NLTK data downloaded successfully')
except Exception as e:
    print(f'Warning: Could not download NLTK data: {e}')
"

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your API keys"
echo "2. Set up PostgreSQL database"
echo "3. Run 'source venv/bin/activate' to activate virtual environment"
echo "4. Run 'python main.py' to start the backend server"
echo "5. Run 'cd frontend && npm start' to start the frontend"
echo ""
echo "For more information, see docs/README.md"