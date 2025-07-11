#!/bin/bash

# Docker Run Script for KAN Application
# This script starts the Docker containers for the KAN application

set -e  # Exit on any error

echo "🚀 Starting KAN Docker containers..."
echo "===================================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with the required environment variables."
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "Please start Docker and try again."
    exit 1
fi

# Check if images exist
if ! docker images | grep -q "kan-web"; then
    echo "⚠️  Warning: Docker images not found. Building them first..."
    ./docker-build.sh
fi

# Start the containers
echo "🐳 Starting containers in detached mode..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if containers are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Containers started successfully!"
    echo ""
    echo "🌐 Application is available at: http://localhost:3003"
    echo ""
    echo "📊 Container status:"
    docker-compose ps
    echo ""
    echo "📝 To view logs: docker-compose logs -f"
    echo "🛑 To stop: docker-compose down"
else
    echo "❌ Error: Some containers failed to start!"
    echo "📝 Checking logs..."
    docker-compose logs
    exit 1
fi
