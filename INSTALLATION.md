# Shop Management System - Installation Guide

## Quick Install Options

### Option 1: PWA (No Installation Needed) ✅ RECOMMENDED

Simply open the app in a browser and add to home screen:

**Windows/Chrome:**
1. Open `index.html` in Chrome
2. Click the **Install** icon (📥) in address bar
3. Click **Install**

**macOS/Safari:**
1. Open `index.html` in Safari
2. Click **File** → **Add to Dock**

**Android:**
1. Open in Chrome
2. Tap **Menu (⋮)** → **Add to Home Screen**

**iOS:**
1. Open in Safari
2. Tap **Share (□)** → **Add to Home Screen**

---

### Option 2: Electron Desktop App (Windows/macOS/Linux)

**Prerequisites:**
- Node.js installed (https://nodejs.org)

**Installation:**

```bash
# 1. Navigate to project folder
cd /Users/singavaramheeralalsingh/Desktop/shop-management-system

# 2. Install dependencies
npm install

# 3. Run the app
npm start
```

**To Build Installer:**

```bash
# Build for your current platform
npm run build

# Or build for specific platforms:
# Windows:
npm run build -- --win

# macOS:
npm run build -- --mac

# Linux:
npm run build -- --linux
```

---

### Option 3: Convert to APK (Android)

Use **PWABuilder** (free online tool):

1. Go to: https://pwabuilder.com
2. Enter your hosted app URL
3. Click **Package** → **Android**
4. Download the APK file
5. Transfer to Android and install

**To Host Your App (for APK creation):**

```bash
# Option A: Netlify (Free - Easiest)
# 1. Go to https://app.netlify.com
# 2. Drag & drop project folder
# 3. Get your URL
# 4. Use that URL in PWABuilder

# Option B: GitHub Pages (Free)
# 1. Upload to GitHub
# 2. Enable GitHub Pages in Settings
# 3. Use that URL in PWABuilder
```

---

### Option 4: Host Locally on Network

**On your main computer:**

```bash
# Find your IP address
# macOS:
ipconfig getifaddr en0

# Linux:
hostname -I

# Windows:
ipconfig

# Start server
python3 -m http.server 8000

# Access from other devices:
# http://YOUR_IP_ADDRESS:8000
```

---

## File Structure for Distribution

```
shop-management-system/
├── index.html
├── manifest.json
├── sw.js
├── offline.html
├── bill-viewer.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── db.js
├── icons/
│   ├── icon-72.png
│   ├── icon-192.png
│   └── icon-512.png
├── package.json
├── main.js
└── README.md
```

---

## For Non-Technical Users (Simplest)

### Create Desktop Shortcut:

**Windows:**
1. Create a text file named `shop-manager.bat`
2. Add: `python -m http.server 8000`
3. Double-click to start server
4. Open Chrome and bookmark `http://localhost:8000`

**macOS:**
1. Double-click `start-server.command` (already included)
2. Open Safari and bookmark the page

### Create Standalone App:

Use **Nativefier** (free):

```bash
# Install Nativefier
npm install -g nativefier

# Create app
nativefier "http://localhost:8000" --name "Shop Manager"
```

This creates a real `.app`/`.exe` file!

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| App won't install | Use Chrome/Edge, not Firefox |
| Icons missing | Ensure icons folder exists |
| Offline not working | Check Service Worker enabled |
| Can't access from other device | Disable firewall or use same WiFi |
| Data lost on close | Data is in browser - clear cache to lose |

---

## Recommended Distribution Method

1. **Host on Netlify** (free)
2. **Use PWABuilder** to create APK for Android
3. **Share URL** for web access
4. **Use Nativefier** for Windows/macOS desktop app

---

## Support

- Open browser DevTools (F12) for error messages
- Check `README.md` for full documentation
- All data stored locally - no cloud sync

