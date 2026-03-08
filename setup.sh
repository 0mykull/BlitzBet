#!/bin/bash
set -e

echo "=== BlitzBet Setup & Start Script ==="

# Function to check command existence
check_cmd() {
    if ! command -v "$1" &> /dev/null; then
        echo "Error: $1 is not installed."
        echo "Please install $1 and try again."
        exit 1
    fi
}

# 1. Check Prerequisites
echo "[1/4] Checking prerequisites..."
check_cmd rustc
check_cmd solana
check_cmd bolt
check_cmd bun

echo "All prerequisites met."

# 2. Build Backend (Bolt Programs)
echo "[2/4] Building Bolt programs..."
# Ensure we are in the root
if [ -f "Anchor.toml" ]; then
    bolt build
else
    echo "Error: Anchor.toml not found. Are you in the project root?"
    exit 1
fi

# 3. Setup Frontend
echo "[3/4] Installing frontend dependencies..."
cd frontend
bun install

# 4. Environment Setup
if [ ! -f ".env" ]; then
    echo "Creating default .env file..."
    echo "VITE_HELIUS_API_KEY=your_helius_api_key_here" > .env
    echo "⚠️  Note: Update frontend/.env with your valid Helius API Key for live data."
fi

# 5. Start Application
echo "[4/4] Starting application..."
echo "Starting frontend dev server..."
bun dev
