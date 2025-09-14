#!/bin/bash

echo "🚀 Starting TNP Portal Development Environment"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   You can start it with: mongod"
    echo "   Or use Docker: docker run -d -p 27017:27017 mongo"
    echo ""
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd client && npm install && cd ..
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server && npm install && cd ..
fi

# Seed the database with sample data
echo "🌱 Seeding database with sample data..."
cd server && npm run seed && cd ..

echo ""
echo "✅ Setup complete! Starting development servers..."
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""
echo "📝 Sample login credentials:"
echo "   Admin: john@example.com / password123"
echo "   User:  jane@example.com / password123"
echo ""

# Start the development servers
npm run dev
