#!/bin/bash

# Shop Management System - GitHub Push Script
# Run this script to push your project to GitHub

echo "========================================"
echo "  Shop Management System - GitHub Push"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Git is installed
echo "Checking Git installation..."
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}Git is not installed. Installing Git...${NC}"
    
    # Detect OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install git
        else
            echo -e "${YELLOW}Please install Homebrew first: https://brew.sh${NC}"
            echo "Then run: brew install git"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update && sudo apt-get install -y git
    else
        echo -e "${YELLOW}Please install Git from https://git-scm.com/${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✓ Git is installed${NC}"
echo ""

# Check if GitHub CLI is installed
echo "Checking GitHub CLI (gh)..."
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}GitHub CLI not found. Installing...${NC}"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install gh
        else
            echo -e "${YELLOW}Please install Homebrew first, then run: brew install gh${NC}"
            echo ""
            echo "Alternative: Install GitHub CLI manually from https://cli.github.com/"
            read -p "Press Enter to continue with manual setup..."
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Download and install GitHub CLI
        type -p curl >/dev/null || (sudo apt-get update && sudo apt-get install -y curl)
        curl -fsSL https://cli.github.com/packages/github_cli.deb.sh | sudo bash
        sudo apt-get install gh
    else
        echo "Please install GitHub CLI from https://cli.github.com/"
        exit 1
    fi
fi

if command -v gh &> /dev/null; then
    echo -e "${GREEN}✓ GitHub CLI is installed${NC}"
else
    echo -e "${YELLOW}GitHub CLI installation skipped. Will use Git directly.${NC}"
fi
echo ""

# Get project directory
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "Project directory: $PROJECT_DIR"
echo ""

# Initialize Git if not already initialized
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Shop Management System with offline PWA support"
    echo -e "${GREEN}✓ Git repository initialized${NC}"
else
    echo -e "${GREEN}✓ Git repository already exists${NC}"
fi
echo ""

# Configure Git user if not set
if [ -z "$(git config user.email)" ]; then
    echo "Configure Git user info:"
    read -p "Enter your name: " USER_NAME
    read -p "Enter your email: " USER_EMAIL
    git config user.name "$USER_NAME"
    git config user.email "$USER_EMAIL"
    echo -e "${GREEN}✓ Git configured${NC}"
else
    echo -e "${GREEN}✓ Git user configured: $(git config user.email)${NC}"
fi
echo ""

# Ask for GitHub username and repo name
echo "========================================"
echo "  GitHub Repository Setup"
echo "========================================"
echo ""

# Check if GitHub CLI is available
if command -v gh &> /dev/null; then
    # Check if authenticated
    if ! gh auth status &> /dev/null; then
        echo "Authenticating with GitHub..."
        gh auth login
    fi
    
    read -p "Enter repository name (default: shop-management-system): " REPO_NAME
    REPO_NAME=${REPO_NAME:-shop-management-system}
    
    echo ""
    echo "Creating GitHub repository '$REPO_NAME'..."
    gh repo create "$REPO_NAME" --public --description "Offline Shop Management System - A Progressive Web App for managing shop inventory and sales"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "Adding remote origin..."
        git remote add origin "https://github.com/$(gh api user --jq .login)/$REPO_NAME.git"
        
        echo ""
        echo "Pushing to GitHub..."
        git push -u origin main || git push -u origin master
        echo ""
        echo -e "${GREEN}========================================"
        echo "  SUCCESS!"
        echo "========================================"
        echo -e "${GREEN}Your project is now on GitHub!${NC}"
        echo ""
        echo "Repository URL:"
        echo "https://github.com/$(gh api user --jq .login)/$REPO_NAME"
        echo ""
    fi
else
    echo "GitHub CLI not available. Using manual push method."
    echo ""
    read -p "Enter your GitHub username: " GH_USERNAME
    read -p "Enter repository name (default: shop-management-system): " REPO_NAME
    REPO_NAME=${REPO_NAME:-shop-management-system}
    
    echo ""
    echo "Creating GitHub repository..."
    echo "1. Go to: https://github.com/new"
    echo "2. Repository name: $REPO_NAME"
    echo "3. Select: Public"
    echo "4. DO NOT check 'Add a README file'"
    echo "5. Click 'Create repository'"
    echo ""
    read -p "Press Enter after creating the repository..."
    
    echo ""
    echo "Adding remote and pushing..."
    git remote add origin "https://github.com/$GH_USERNAME/$REPO_NAME.git"
    git branch -M main
    git push -u origin main
    
    echo ""
    echo -e "${GREEN}========================================"
    echo "  SUCCESS!"
    echo "========================================"
    echo -e "${GREEN}Your project is now on GitHub!${NC}"
    echo ""
    echo "Repository URL:"
    echo "https://github.com/$GH_USERNAME/$REPO_NAME"
    echo ""
fi

echo "========================================"
echo "  Next Steps"
echo "========================================"
echo ""
echo "1. Add a description at: https://github.com/$GH_USERNAME/$REPO_NAME"
echo "2. Upload icons to the icons/ folder"
echo "3. Enable GitHub Pages for free hosting (Settings → Pages → main)"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"

