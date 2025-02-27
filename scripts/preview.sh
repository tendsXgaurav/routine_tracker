#!/bin/bash

# Make script executable with: chmod +x scripts/preview.sh

echo "🚀 Routine Tracker App - Local Preview 🚀"
echo "----------------------------------------"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root directory."
    echo "Try running: cd /home/backspace/App"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if install was successful
if [ $? -ne 0 ]; then
    echo "❌ Error installing dependencies. Please check the error messages above."
    exit 1
fi

# Choose preview mode
echo ""
echo "Choose preview mode:"
echo "1) Development server (with hot reload)"
echo "2) Production build preview"
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo "🔧 Starting development server..."
    echo "🌐 Your app will be available at http://localhost:3000"
    npm start
elif [ "$choice" = "2" ]; then
    echo "🔨 Creating production build..."
    npm run build
    
    # Check if build was successful
    if [ $? -ne 0 ]; then
        echo "❌ Error building the app. Please check the error messages above."
        exit 1
    fi
    
    # Check if serve is installed
    if ! command -v serve &> /dev/null; then
        echo "📦 Installing serve..."
        npm install -g serve
    fi
    
    echo "🚀 Serving production build..."
    echo "🌐 Your app will be available at http://localhost:5000"
    serve -s build
else
    echo "❌ Invalid choice. Please run the script again and select 1 or 2."
    exit 1
fi
