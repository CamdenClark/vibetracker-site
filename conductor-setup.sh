#!/bin/bash

set -e  # Exit on any error

echo "🚀 Starting Vibetracker Site workspace setup..."

# Check if Hugo is installed
if ! command -v hugo &> /dev/null; then
    echo "❌ Error: Hugo is not installed."
    echo "Please install Hugo first:"
    echo "  - macOS: brew install hugo"
    echo "  - Or visit: https://gohugo.io/installation/"
    exit 1
fi

echo "✅ Hugo is installed ($(hugo version))"

# Initialize and update git submodules (for the Ananke theme)
echo "📦 Initializing Git submodules..."
if ! git submodule update --init --recursive; then
    echo "❌ Error: Failed to initialize Git submodules"
    echo "The Ananke theme requires submodules to be initialized"
    exit 1
fi

echo "✅ Git submodules initialized"

# Check if there's a .env file in the root that should be symlinked
if [ -f "$CONDUCTOR_ROOT_PATH/.env" ]; then
    echo "🔗 Symlinking .env file from repository root..."
    ln -sf "$CONDUCTOR_ROOT_PATH/.env" .env
    echo "✅ .env file symlinked"
else
    echo "ℹ️  No .env file found in repository root (this is okay if not needed)"
fi

echo ""
echo "✨ Setup complete! Your workspace is ready."
echo "You can now use the Run button to start the Hugo development server."
