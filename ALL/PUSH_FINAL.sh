#!/bin/bash

# ============================================
# FINAL PUSH SCRIPT
# ============================================

echo "========================================"
echo "  Pushing to GitHub..."
echo "========================================"
echo ""

cd /Users/singavaramheeralalsingh/Desktop/shop-management-system

# Configure git
git config user.name "Heeralal Singh"
git config user.email "heeralal1806@users.noreply.github.com"

# Create repo first (API requires token, so manual creation needed)
echo "1. Create repository at: https://github.com/new"
echo "   - Name: shop-management-system"
echo "   - Public: YES"
echo "   - NO README"
echo ""
read -p "Press Enter AFTER creating the repository..."

# Add remote
git remote remove origin 2>/dev/null
git remote add origin https://github.com/heeralal1806/shop-management-system.git

# Push
echo ""
echo "2. Pushing code..."
git branch -M main
git push -u origin main

echo ""
echo "========================================"
echo "  ✅ SUCCESS!"
echo "========================================"
echo ""
echo "Your repo: https://github.com/heeralal1806/shop-management-system"

