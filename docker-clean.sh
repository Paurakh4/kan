#!/bin/bash

# Docker Clean Script for KAN Application
# This script completely cleans up Docker containers, images, and volumes

set -e  # Exit on any error

echo "🧹 Cleaning up KAN Docker environment..."
echo "======================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "Please start Docker and try again."
    exit 1
fi

# Stop and remove containers
echo "🛑 Stopping and removing containers..."
docker-compose down --remove-orphans --volumes 2>/dev/null || true

# Remove images
echo "🗑️  Removing Docker images..."
docker images | grep kan | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true

# Remove volumes
echo "💾 Removing Docker volumes..."
docker volume ls | grep kan | awk '{print $2}' | xargs docker volume rm 2>/dev/null || true

# Clean up system
echo "🧽 Cleaning up Docker system..."
docker system prune -f --volumes

echo "✅ Docker cleanup completed!"
echo ""
echo "All KAN-related Docker containers, images, and volumes have been removed."
echo "Run './docker-build.sh' to rebuild from scratch."
