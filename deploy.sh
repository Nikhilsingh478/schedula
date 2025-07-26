#!/bin/bash

echo "🚀 Schedula Deployment Setup"
echo "=============================="

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found. Please ensure the backend folder exists."
    exit 1
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo "📦 Installing frontend dependencies..."
npm install

echo "✅ Setup complete!"
echo ""
echo "🎯 Next Steps:"
echo "1. Deploy backend to Render/Railway/Heroku"
echo "2. Deploy frontend to Vercel"
echo "3. Set NEXT_PUBLIC_API_URL environment variable"
echo ""
echo "📖 See README.md for detailed deployment instructions" 