# Offline Shop Inventory & Daily Sales Management System

A browser-based offline web application for shopkeepers to manage inventory and track daily sales without internet.

## 🌟 Features

### 📦 Item Management
- Add new items with name, category, price, and quantity
- Update item details anytime
- Delete items from inventory
- Search and filter items
- Stock level indicators (Available/Low/Out)

### 🏷️ Category Management
- Pre-built categories (Grocery, Vegetables, Fruits, Stationery, Medical, Clothing, etc.)
- Add custom categories
- Organize all products by category

### 🛒 Sales Entry (Billing)
- Quick item selection from dropdown
- Real-time price calculation
- Automatic stock reduction
- Generate bills with multiple items
- Clear bill functionality

### 📈 Daily Sales Reports
- View sales by date
- Total sales calculation
- Items sold tracking
- Transaction count

### 📊 Dashboard
- Total items overview
- Today's sales summary
- Low stock alerts
- Category count

### 🔄 100% Offline Support
- IndexedDB for data storage
- Service Worker for caching
- PWA installable as app
- Works without internet forever

## 🚀 Getting Started

### ⚠️ Important: Chrome Users Must Read

Chrome has strict security policies that may affect the app. Follow these instructions:

#### Option 1: Local Server (RECOMMENDED for Chrome)
This is the **most reliable** method for Chrome:

```bash
# Open terminal and navigate to the project folder
cd /Users/singavaramheeralalsingh/Desktop/shop-management-system

# Start Python HTTP server
python3 -m http.server 8000

# Then open Chrome and go to:
# http://localhost:8000
```

**Why this works:** Chrome allows Service Workers and IndexedDB when served over HTTP.

#### Option 2: Direct File Opening (Limited Features)
1. Open the `shop-management-system` folder
2. Double-click `index.html` to open in Chrome
3. **Note:** Some features may be limited due to Chrome's security policies

**Chrome will show warnings in Console** - this is normal and expected for file:// protocol.

#### Option 3: Install as PWA
1. Open the app using Option 1 (local server)
2. Click the install icon (📥) in Chrome's address bar
3. Install as a standalone app on your computer

## 🔧 Chrome Troubleshooting

### If Links/Navigation Don't Work:

1. **Open Chrome DevTools** (Press F12 or Ctrl+Shift+I)
2. **Check Console tab** for errors
3. **Common fixes:**
   - Use local server instead of file://
   - Clear browser cache (Ctrl+Shift+Delete)
   - Disable and re-enable cache in DevTools Network tab

### Service Worker Not Registering:

Chrome blocks Service Workers on file:// protocol. Use local server:

```bash
# This command must be run in the project directory
python3 -m http.server 8000
```

Then access via: `http://localhost:8000`

### IndexedDB Not Working:

1. Make sure you're not in incognito mode
2. Check Chrome permissions: Settings → Privacy → Site Settings → IndexedDB
3. Allow the site to use IndexedDB

## 📁 Project Structure

```
shop-management-system/
├── index.html          # Main application HTML
├── offline.html        # Offline fallback page
├── manifest.json       # PWA manifest
├── sw.js              # Service Worker
├── css/
│   └── style.css      # All styles
├── js/
│   ├── db.js          # IndexedDB operations
│   └── app.js         # Application logic
├── icons/             # App icons (72x72 to 512x512)
└── README.md          # This file
```

## 🛠️ Technology Stack

- **HTML5** - Structure
- **CSS3** - Styling (responsive, modern design)
- **JavaScript (ES6+)** - Logic
- **IndexedDB** - Offline database storage
- **Service Worker** - PWA offline support
- **PWA** - Installable as app

## 📱 Browser Support

| Browser | Support Level | Notes |
|---------|---------------|-------|
| Chrome/Edge | ⭐⭐⭐ Full | Use local server for best results |
| Firefox | ⭐⭐⭐ Full | Works well with file:// |
| Safari | ⭐⭐ Full | Some PWA features may vary |
| Opera | ⭐⭐⭐ Full | Similar to Chrome |

## 📊 Database Schema

### Items Table
| Field | Type | Description |
|-------|------|-------------|
| id | Number | Auto-increment ID |
| name | Text | Item name |
| category | Text | Item category |
| price | Number | Price per unit |
| quantity | Number | Available stock |
| description | Text | Optional description |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Last update timestamp |

### Categories Table
| Field | Type | Description |
|-------|------|-------------|
| id | Number | Auto-increment ID |
| name | Text | Category name (unique) |
| createdAt | Date | Creation timestamp |

### Sales Table
| Field | Type | Description |
|-------|------|-------------|
| id | Number | Auto-increment ID |
| itemId | Number | Reference to item |
| itemName | Text | Item name at time of sale |
| quantitySold | Number | Quantity sold |
| totalPrice | Number | Total price for this line |
| date | Date | Sale date (YYYY-MM-DD) |
| createdAt | Date | Sale timestamp |

## 💾 Data Storage

All data is stored locally in your browser using **IndexedDB**. This means:
- ✅ Data persists after closing browser
- ✅ Works without internet
- ✅ No server required
- ✅ Data stays on your device

⚠️ **Note**: Clearing browser data will delete all stored information.

## 🎯 Usage Workflow

### Morning Setup
1. Open the app
2. Go to "Add Item" page
3. Add all your products with quantities

### During Sales
1. Go to "Sales Entry" page
2. Select item from dropdown
3. Enter quantity
4. Click "Add to Bill"
5. Repeat for all items
6. Click "Complete Sale" when done

### End of Day
1. Go to "Daily Reports"
2. View today's total sales
3. Check which items sold

## 🔧 Development Commands

```bash
# Navigate to project
cd /Users/singavaramheeralalsingh/Desktop/shop-management-system

# Start local server
python3 -m http.server 8000

# Open in Chrome
# Go to: http://localhost:8000

# Stop server (Ctrl+C in terminal)
```

## 🔧 Future Enhancements

- [ ] Export data to PDF/Excel
- [ ] Monthly sales reports
- [ ] Barcode scanner integration
- [ ] Multi-user login system
- [ ] Backup/restore to USB
- [ ] Data sync when online
- [ ] Inventory alerts/notifications

## 📄 License

This is an open-source project for educational and practical use.

## 👨‍💻 Developer

Built with ❤️ for shopkeepers everywhere.

---

**Note**: This system works 100% offline once loaded. All data is stored locally in your browser for privacy and offline accessibility.

## 🆘 Still Having Issues?

1. **Check Chrome Console** (F12 → Console) for error messages
2. **Clear browser cache**: Ctrl+Shift+Delete
3. **Try incognito mode** temporarily
4. **Use local server** instead of opening file directly
5. **Restart Chrome** after making changes

