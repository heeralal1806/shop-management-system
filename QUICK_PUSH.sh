#!/bin/bash

# ============================================
#  GitHub Push Script for Shop Management System
# ============================================

echo "========================================"
echo "  Pushing to GitHub"
echo "========================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Run git init first."
    exit 1
fi

echo "✅ Git repository found"
echo ""

# Create repository on GitHub using API
echo "Creating repository on GitHub..."

# Your credentials
USERNAME="heeralal1806"
TOKEN=""  # Will prompt below
REPO_NAME="shop-management-system"
DESCRIPTION="Offline Shop Management System - A Progressive Web App for managing shop inventory and sales"

# Ask for token
echo ""
echo "IMPORTANT: GitHub requires a Personal Access Token instead of password."
echo ""
echo "1. Go to: https://github.com/settings/tokens"
echo "2. Click 'Generate new token (classic)'"
echo "3. Note: 'Shop Manager'"
echo "4. Expiration: 'No expiration'"
echo "5. Scope: Check ONLY 'repo'"
echo "6. Click Generate and COPY the token"
echo ""
read -p "Paste your Personal Access Token here: " TOKEN
echo ""

if [ -z "$TOKEN" ]; then
    echo "❌ Token is required"
    exit 1
fi

# Create repository using GitHub API
echo "Creating repository..."
curl -X POST -H "Authorization: token $TOKEN" \
    -d "{\"name\":\"$REPO_NAME\",\"description\":\"$DESCRIPTION\",\"public\":true}" \
    "https://api.github.com/user/repos" 2>/dev/null

echo ""
echo "Setting up remote and pushing..."
echo ""

# Configure git
echo "Configuring git..."
git config user.name "Heeralal Singh"
git config user.email "heeralal1806@github.com"

# Add remote
git remote remove origin 2>/dev/null
git remote add origin "https://$USERNAME:$TOKEN@github.com/$USERNAME/$REPO_NAME.git"

# Rename branch to main
git branch -M main

# Push
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "========================================"
echo "  DONE!"
echo "========================================"
echo ""
echo "Your repository URL:"
echo "https://github.com/$USERNAME/$REPO_NAME"
echo ""
echo "To enable free hosting (GitHub Pages):"
echo "1. Go to Settings → Pages"
echo "2. Select Branch: main"
echo "3. Click Save"
echo ""

