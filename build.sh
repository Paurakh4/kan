#!/bin/bash
set -e

echo "🔧 Installing dependencies with pnpm..."
pnpm install --frozen-lockfile

echo "🏗️ Building the web application..."
cd apps/web
pnpm build

echo "✅ Build completed successfully!"
