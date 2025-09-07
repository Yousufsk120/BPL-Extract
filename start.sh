#!/bin/bash

# BPL-Extract startup script
echo "Starting BPL-Extract application..."

# Install dependencies
pip install -r requirements.txt

# Start the Flask application
python app.py