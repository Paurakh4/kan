#!/bin/bash
set -e

echo "🔧 Current working directory: $(pwd)"
echo "🔧 Listing directory contents:"
ls -la

echo "🔧 Installing dependencies with pnpm..."
pnpm install --frozen-lockfile

echo "🔧 Checking apps/web directory:"
ls -la apps/web/

echo "🏗️ Building the web application..."
cd apps/web
echo "🔧 Now in directory: $(pwd)"
NEXT_PUBLIC_USE_STANDALONE_OUTPUT=false pnpm build

echo "🔧 Checking build output:"
ls -la .next/

echo "✅ Build completed successfully!"
