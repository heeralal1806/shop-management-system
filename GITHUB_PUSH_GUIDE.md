# Push to GitHub - Step by Step Guide

## Prerequisites

1. **Create a GitHub Account** at https://github.com
2. **Install Git** from https://git-scm.com/downloads

---

## Step 1: Initialize Git Repository

Open Terminal and run:

```bash
cd /Users/singavaramheeralalsingh/Desktop/shop-management-system

# Initialize git
git init

# Configure your name and email
git config user.name "Your Name"
git config user.email "your@email.com"

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Shop Management System with PWA support"
```

---

## Step 2: Create GitHub Repository

1. Go to: https://github.com/new
2. **Repository name**: `shop-management-system`
3. **Description**: `Offline Shop Management System - A Progressive Web App for managing shop inventory and sales`
4. **Public**: ✅ Select "Public"
5. **README**: ❌ DO NOT check "Add a README file"
6. Click **"Create repository"**

---

## Step 3: Push Your Code

After creating the repository, run these commands:

```bash
# Rename current branch to main
git branch -M main

# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/shop-management-system.git

# Push to GitHub
git push -u origin main
```

**When prompted for username and password:**
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (not your password!)

---

## Step 4: Create Personal Access Token

Since GitHub removed password authentication:

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. **Note**: `Shop Manager Push`
4. **Expiration**: Select "No expiration"
5. **Scopes**: Check ✅ `repo`
6. Click **"Generate token"**
7. **Copy** the token (starts with `ghp_...`)

Use this token as your password when pushing!

---

## Step 5: Verify Upload

1. Go to: https://github.com/YOUR_USERNAME/shop-management-system
2. You should see all your files:
   - index.html
   - manifest.json
   - sw.js
   - css/style.css
   - js/app.js
   - js/db.js
   - icons/
   - etc.

---

## Quick Commands Summary

```bash
cd /Users/singavaramheeralalsingh/Desktop/shop-management-system
git init
git config user.name "Your Name"
git config user.email "your@email.com"
git add .
git commit -m "Initial commit: Shop Management System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shop-management-system.git
git push -u origin main
# Enter username and token as password
```

---

## After Push - Enable Free Hosting (GitHub Pages)

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Branch**: Select `main`
4. Click **Save**
5. Your app will be live at: `https://YOUR_USERNAME.github.io/shop-management-system`

---

## Update Code Later

To push changes after editing files:

```bash
git add .
git commit -m "Describe your changes"
git push
```

---

## Need Help?

- **Git documentation**: https://docs.github.com
- **GitHub Pages**: https://pages.github.com
- **Creating a token**: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

