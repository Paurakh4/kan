#!/bin/bash

# Docker Build Script for KAN Application
# This script builds the Docker containers for the KAN application

set -e  # Exit on any error

echo "🐳 Building KAN Docker containers..."
echo "=================================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with the required environment variables."
    echo "You can copy from .env.example if available."
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "Please start Docker and try again."
    exit 1
fi

# Clean up any existing containers and images (optional)
echo "🧹 Cleaning up existing containers and images..."
docker-compose down --remove-orphans 2>/dev/null || true
docker system prune -f --volumes 2>/dev/null || true

# Build the containers
echo "🔨 Building Docker containers..."
docker-compose build --no-cache

echo "✅ Docker build completed successfully!"
echo ""
echo "Next steps:"
echo "1. Run './docker-run.sh' to start the containers"
echo "2. Access the application at http://localhost:3003"
echo ""
echo "Useful commands:"
echo "- View logs: docker-compose logs -f"
echo "- Stop containers: docker-compose down"
echo "- Restart containers: docker-compose restart"
