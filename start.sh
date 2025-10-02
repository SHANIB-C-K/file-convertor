#!/bin/bash

# File Converter Start Script
# Developed by SHANIB C K

echo "🔄 Starting File Converter..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the File Converter directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Dependencies not found. Installing..."
    npm install
fi

# Start the application
npm start
