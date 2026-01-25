#!/bin/bash
# Quick push script - prompts for token

echo "IMPORTANT: You need a Personal Access Token (not your password)"
echo "Get it here: https://github.com/settings/tokens"
echo ""
read -p "Paste your Personal Access Token: " TOKEN

if [ -z "$TOKEN" ]; then
    echo "Token is required!"
    exit 1
fi

# Create repo
echo "Creating repository..."
curl -X POST -H "Authorization: token $TOKEN" \
    -d '{"name":"shop-management-system","description":"Offline Shop Management System - A Progressive Web App","public":true}' \
    "https://api.github.com/user/repos" 2>/dev/null

# Configure git
git config user.name "Heeralal Singh"
git config user.email "heeralal1806@users.noreply.github.com"

# Push
git remote remove origin 2>/dev/null
git remote add origin "https://heeralal1806:$TOKEN@github.com/heeralal1806/shop-management-system.git"
git branch -M main
echo "Pushing..."
git push -u origin main
