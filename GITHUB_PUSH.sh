#!/bin/bash

# ============================================
#  GitHub Push Script - Run this to push!
# ============================================

echo "========================================"
echo "  GitHub Push - Shop Management System"
echo "========================================"
echo ""

# Check if token provided
if [ -z "$1" ]; then
    echo "❌ You need to provide your Personal Access Token"
    echo ""
    echo "How to get token (2 minutes):"
    echo "1. Go to: https://github.com/settings/tokens"
    echo "2. Click 'Generate new token (classic)'"
    echo "3. Note: 'Shop Manager'"
    echo "4. Expiration: 'No expiration'"
    echo "5. Scope: Check ONLY 'repo'"
    echo "6. Click Generate and COPY the token"
    echo ""
    echo "Usage: ./GITHUB_PUSH.sh YOUR_TOKEN_HERE"
    echo ""
    exit 1
fi

TOKEN="$1"
USERNAME="heeralal1806"
REPO_NAME="shop-management-system"

echo "✅ Token provided"
echo "Creating repository..."
echo ""

# Create repository using GitHub API
RESPONSE=$(curl -s -X POST -H "Authorization: token $TOKEN" \
    -d "{\"name\":\"$REPO_NAME\",\"description\":\"Offline Shop Management System - A Progressive Web App for managing shop inventory and sales\",\"public\":true}" \
    "https://api.github.com/user/repos")

echo "Response: $RESPONSE"
echo ""

# Configure git
echo "Configuring git..."
git config user.name "Heeralal Singh"
git config user.email "heeralal1806@users.noreply.github.com"

# Set remote with token
echo "Setting up remote..."
git remote remove origin 2>/dev/null
git remote add origin "https://$USERNAME:$TOKEN@github.com/$USERNAME/$REPO_NAME.git"

# Rename branch to main
echo "Ensuring branch is 'main'..."
git branch -M main

# Push
echo ""
echo "🚀 Pushing to GitHub..."
echo ""
git push -u origin main

echo ""
echo "========================================"
echo "  ✅ DONE!"
echo "========================================"
echo ""
echo "Your repository:"
echo "https://github.com/$USERNAME/$REPO_NAME"
echo ""
echo "Enable free hosting (GitHub Pages):"
echo "Settings → Pages → Branch: main → Save"
echo ""

