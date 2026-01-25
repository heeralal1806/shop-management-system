# ============================================
#  ONE-CLICK PUSH TO GITHUB
# ============================================
#
# Step 1: Create repository in browser (no token needed!)
#   → Go to: https://github.com/new
#   → Name: shop-management-system
#   → Description: Offline Shop Management System
#   → Public: YES
#   → DO NOT check "Add a README file"
#   → Click "Create repository"
#
# Step 2: Run this command:
#   cd /Users/singavaramheeralalsingh/Desktop/shop-management-system
#   bash PUSH_NOW.sh
#
# ============================================

#!/bin/bash

cd /Users/singavaramheeralalsingh/Desktop/shop-management-system

# Configure git
git config user.name "Heeralal Singh"
git config user.email "heeralal1806@users.noreply.github.com"

# Add remote
git remote add origin https://github.com/heeralal1806/shop-management-system.git 2>/dev/null

# Push
git branch -M main
git push -u origin main

echo ""
echo "✅ DONE! Your code is on GitHub!"
echo ""
echo "Repository URL: https://github.com/heeralal1806/shop-management-system"

