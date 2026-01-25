#!/bin/bash

# Shop Management System - Server Startup Script
# Double-click this file to start the local server

echo "🚀 Starting Shop Management System Server..."
echo "============================================"

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Kill any existing Python servers on ports 8000 and 3000
lsof -ti:8000 2>/dev/null | xargs kill -9 2>/dev/null || true
lsof -ti:3000 2>/dev/null | xargs kill -9 2>/dev/null || true

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 found"
    echo ""
    echo "📂 Working directory: $SCRIPT_DIR"
    echo ""
    echo "🌐 Starting server at: http://localhost:3000"
    echo ""
    echo "📱 ACCESS FROM MOBILE:"
    echo "   1. Make sure your phone is on the same WiFi network"
    echo "   2. Open your phone's browser and go to:"
    echo "      http://192.168.0.101:3000"
    echo ""
    echo "💻 ACCESS FROM COMPUTER:"
    echo "   http://localhost:3000"
    echo ""
    echo "🛑 To stop the server: Press Ctrl+C in this terminal"
    echo ""
    echo "============================================"
    echo ""
    
    # Start the server on port 3000, bound to all interfaces
    python3 -m http.server 3000 --bind 0.0.0.0
    
elif command -v python &> /dev/null; then
    echo "✅ Python found (trying python -m http.server)"

