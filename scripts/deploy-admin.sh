#!/bin/bash

# Real Estate MVP - Deploy Admin Panel
echo "🏠 Real Estate MVP - Deploying Admin Panel..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ This script should be run from the project root directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing admin panel dependencies..."
cd admin-panel
npm install

# Build the admin panel
echo "🔨 Building admin panel..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Go back to root and deploy
cd ..

# Deploy to Firebase Hosting
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo "✅ Admin panel deployed successfully!"
    echo "🌐 Your admin panel should be available at your Firebase Hosting URL"
else
    echo "❌ Deployment failed!"
    exit 1
fi
