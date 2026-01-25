#!/usr/bin/env python3
"""
Generate PDF Report for Shop Management System
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT

# Create the PDF
doc = SimpleDocTemplate(
    "/Users/singavaramheeralalsingh/Desktop/shop-management-system/SHOP_MANAGEMENT_REPORT.pdf",
    pagesize=LETTER,
    rightMargin=72, leftMargin=72,
    topMargin=72, bottomMargin=72
)

# Get styles
styles = getSampleStyleSheet()
title_style = ParagraphStyle(
    'Title',
    parent=styles['Heading1'],
    fontSize=24,
    spaceAfter=30,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#2c3e50')
)
heading_style = ParagraphStyle(
    'Heading',
    parent=styles['Heading2'],
    fontSize=16,
    spaceBefore=20,
    spaceAfter=15,
    textColor=colors.HexColor('#2c3e50'),
    borderPadding=5,
    borderWidth=1,
    borderColor=colors.HexColor('#3498db')
)
subheading_style = ParagraphStyle(
    'Subheading',
    parent=styles['Heading3'],
    fontSize=13,
    spaceBefore=15,
    spaceAfter=10,
    textColor=colors.HexColor('#3498db')
)
normal_style = ParagraphStyle(
    'Normal',
    parent=styles['Normal'],
    fontSize=10,
    spaceBefore=6,
    spaceAfter=6
)
code_style = ParagraphStyle(
    'Code',
    parent=styles['Normal'],
    fontSize=8,
    fontName='Courier',
    spaceBefore=6,
    spaceAfter=6,
    leftIndent=20,
    rightIndent=20,
    backColor=colors.HexColor('#f5f5f5')
)

# Build the document
elements = []

# Title
elements.append(Paragraph("🛒 Shop Management System", title_style))
elements.append(Paragraph("Project Report - Version 1.0 | January 2025", 
                           ParagraphStyle('Subtitle', parent=styles['Normal'], 
                                         fontSize=12, alignment=TA_CENTER, spaceAfter=30)))
elements.append(Spacer(1, 20))

# Section 1: Project Overview
elements.append(Paragraph("1. PROJECT OVERVIEW", heading_style))
elements.append(Paragraph("A <b>100% Offline Progressive Web App (PWA)</b> for shopkeepers to manage inventory and track daily sales without internet connectivity.", normal_style))
elements.append(Spacer(1, 10))
elements.append(Paragraph("<b>Type:</b> Offline-First Web Application | <b>Architecture:</b> Single Page Application (SPA) | <b>Platform:</b> Cross-platform", normal_style))
elements.append(Spacer(1, 10))
elements.append(Paragraph("<b>Key Highlights:</b>", normal_style))
elements.append(Paragraph("• ✅ Works 100% offline", normal_style))
elements.append(Paragraph("• ✅ Installable as desktop/mobile app", normal_style))
elements.append(Paragraph("• ✅ No server required", normal_style))
elements.append(Paragraph("• ✅ Data stored locally in browser", normal_style))
elements.append(Paragraph("• ✅ Customer-wise sales grouping", normal_style))
elements.append(Paragraph("• ✅ Print, WhatsApp, SMS sharing", normal_style))

# Section 2: Technology Stack
elements.append(Paragraph("2. TECHNOLOGY STACK", heading_style))

elements.append(Paragraph("<b>Frontend</b>", subheading_style))
tech_data = [
    ['Technology', 'Purpose'],
    ['HTML5', 'Structure and layout'],
    ['CSS3', 'Styling, responsive design'],
    ['JavaScript (ES6+)', 'Business logic and interactivity'],
    ['Service Worker', 'Offline caching'],
    ['PWA Manifest', 'Installable web app configuration']
]
t = Table(tech_data, colWidths=[2*inch, 3.5*inch])
t.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c3e50')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
    ('TOPPADDING', (0, 0), (-1, 0), 10),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
elements.append(t)

elements.append(Spacer(1, 15))
elements.append(Paragraph("<b>Backend</b>", subheading_style))
backend_data = [
    ['Component', 'Technology'],
    ['Server', 'Python HTTP Server (built-in)'],
    ['Command', 'python3 -m http.server 8000'],
    ['Port', '8000']
]
t2 = Table(backend_data, colWidths=[2*inch, 3.5*inch])
t2.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c3e50')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
    ('TOPPADDING', (0, 0), (-1, 0), 10),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
elements.append(t2)
elements.append(Paragraph("<i>Note: This is a client-side application with no traditional backend.</i>", normal_style))

elements.append(Paragraph("<b>Database</b>", subheading_style))
db_data = [
    ['Type', 'Technology'],
    ['Local Storage', 'IndexedDB (Browser-based)'],
    ['DB Engine', 'IndexedDB API'],
    ['Data Persistence', 'Browser Local Storage']
]
t3 = Table(db_data, colWidths=[2*inch, 3.5*inch])
t3.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c3e50')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
    ('TOPPADDING', (0, 0), (-1, 0), 10),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
elements.append(t3)

# Section 3: Project Structure
elements.append(Paragraph("3. PROJECT STRUCTURE", heading_style))
elements.append(Paragraph("""
shop-management-system/
├── index.html              # Main application (Single Page App)
├── offline.html            # Fallback page when offline
├── manifest.json           # PWA configuration file
├── sw.js                   # Service Worker for offline support
├── start-server.command    # macOS launcher script
├── README.md               # Project documentation
├── css/
│   └── style.css           # All styling (1000+ lines)
├── js/
│   ├── db.js               # IndexedDB operations (450+ lines)
│   └── app.js              # Application logic (1200+ lines)
└── icons/
    ├── icon-72.png
    ├── icon-192.png
    └── icon-512.png
""", code_style))

stats_data = [
    ['Total Files', '12+'],
    ['Lines of Code', '3000+'],
    ['Features', '20+'],
    ['Offline', '100%']
]
t4 = Table(stats_data, colWidths=[3*inch, 2*inch])
t4.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3498db')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTSIZE', (0, 0), (-1, -1), 12),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
elements.append(Spacer(1, 15))
elements.append(t4)

# Section 4: Features
elements.append(Paragraph("4. FEATURES IMPLEMENTED", heading_style))

features_data = [
    ['Category', 'Features'],
    ['Dashboard', 'Total items, Today\'s sales, Low stock alerts, Categories count'],
    ['Item Mgmt', 'Add/Edit/Delete items, Search, Filter by category/stock'],
    ['Categories', 'Pre-built categories, Add/Delete custom categories'],
    ['Sales & Billing', 'Quick add, Real-time calculation, Print, WhatsApp, SMS'],
    ['Reports', 'Date filtering, Customer-wise grouping, Transaction count']
]
t5 = Table(features_data, colWidths=[1.5*inch, 4*inch])
t5.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c3e50')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
    ('TOPPADDING', (0, 0), (-1, 0), 10),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
]))
elements.append(t5)

# Section 5: Database Schema
elements.append(Paragraph("5. DATABASE SCHEMA (INDEXEDDB)", heading_style))
elements.append(Paragraph("<b>Items Store</b>", subheading_style))
items_schema = [
    ['Field', 'Type', 'Description'],
    ['id', 'integer', 'Auto-increment primary key'],
    ['name', 'text', 'Item name'],
    ['category', 'text', 'Category name'],
    ['price', 'number', 'Price per unit'],
    ['quantity', 'number', 'Available stock quantity'],
    ['unit', 'text', 'Unit type (kg, pcs, g, L, ml, box, pack, dozen)'],
    ['transactionId', 'text', 'Groups items from same bill'],
    ['createdAt', 'datetime', 'Creation timestamp']
]
t6 = Table(items_schema, colWidths=[1.2*inch, 0.8*inch, 2.5*inch])
t6.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c3e50')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTSIZE', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
    ('TOPPADDING', (0, 0), (-1, 0), 8),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
elements.append(t6)

elements.append(Paragraph("<b>Categories Store</b>", subheading_style))
cat_schema = [
    ['Field', 'Type', 'Description'],
    ['id', 'integer', 'Auto-increment primary key'],
    ['name', 'text', 'Unique category name'],
    ['createdAt', 'datetime', 'Creation timestamp']
]
t7 = Table(cat_schema, colWidths=[1.2*inch, 0.8*inch, 2.5*inch])
t7.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c3e50')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTSIZE', (0, 0), (-1, -1), 8),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
elements.append(t7)

elements.append(Paragraph("<b>Sales Store</b>", subheading_style))
sales_schema = [
    ['Field', 'Type', 'Description'],
    ['id', 'integer', 'Auto-increment primary key'],
    ['itemId', 'integer', 'Reference to item'],
    ['itemName', 'text', 'Item name at sale time'],
    ['quantitySold', 'number', 'Quantity sold'],
    ['customerName', 'text', 'Customer name (optional)'],
    ['customerPhone', 'text', 'Phone number (optional)'],
    ['totalPrice', 'number', 'Line item total'],
    ['date', 'text', 'Sale date (YYYY-MM-DD)'],
    ['transactionId', 'text', 'Groups items from same bill']
]
t8 = Table(sales_schema, colWidths=[1.2*inch, 0.8*inch, 2.5*inch])
t8.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c3e50')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTSIZE', (0, 0), (-1, -1), 8),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
elements.append(t8)

# Section 6: UI Components
elements.append(Paragraph("6. UI COMPONENTS", heading_style))
elements.append(Paragraph("<b>Navigation Sidebar</b>", subheading_style))
nav_data = [
    ['Icon', 'Name', 'Page ID', 'Description'],
    ['📊', 'Dashboard', 'dashboard', 'Overview statistics'],
    ['➕', 'Add New Item', 'add-item', 'Add products'],
    ['📦', 'Stock List', 'items-list', 'View/edit inventory'],
    ['🏷️', 'Category Mgmt', 'categories', 'Manage categories'],
    ['🛒', 'Sales Entry', 'sales', 'Create bills'],
    ['📈', 'Daily Reports', 'reports', 'View sales reports']
]
t9 = Table(nav_data, colWidths=[0.5*inch, 1.3*inch, 1.2*inch, 2*inch])
t9.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c3e50')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTSIZE', (0, 0), (-1, -1), 8),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
elements.append(t9)

elements.append(Paragraph("<b>Buttons</b>", subheading_style))
btn_data = [
    ['Button', 'Class', 'Color', 'Action'],
    ['Add Item', '.btn-primary', 'Blue', 'Submit form'],
    ['Clear Bill', '.btn-secondary', 'Gray', 'Clear current bill'],
    ['🖨️ Print', '.btn-warning', 'Orange', 'Open print dialog'],
    ['Complete Sale', '.btn-success', 'Green', 'Save transaction'],
    ['📱 WhatsApp', '.btn-whatsapp', 'Green #25D366', 'Share via WhatsApp'],
    ['💬 SMS', '.btn-sms', 'Purple #6c5ce7', 'Share via SMS']
]
t10 = Table(btn_data, colWidths=[1.2*inch, 1.3*inch, 1*inch, 2*inch])
t10.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c3e50')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTSIZE', (0, 0), (-1, -1), 8),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
elements.append(t10)

# Section 7: How to Run
elements.append(Paragraph("7. HOW TO RUN", heading_style))
elements.append(Paragraph("<b>Method 1: Using Python (Recommended)</b>", normal_style))
elements.append(Paragraph("""
cd /Users/singavaramheeralalsingh/Desktop/shop-management-system
python3 -m http.server 8000
Then open: http://localhost:8000
""", code_style))

elements.append(Paragraph("<b>Method 2: Using Start Script (macOS)</b>", normal_style))
elements.append(Paragraph("Double-click: start-server.command", normal_style))

# Section 8: Browser Support
elements.append(Paragraph("8. BROWSER SUPPORT", heading_style))
browser_data = [
    ['Browser', 'Support', 'Notes'],
    ['Chrome', '✅ Full', 'Recommended for PWA features'],
    ['Firefox', '✅ Full', 'Works well'],
    ['Safari', '⚠️ Partial', 'Some PWA features may vary'],
    ['Edge', '✅ Full', 'Similar to Chrome'],
    ['Opera', '✅ Full', 'Similar to Chrome']
]
t11 = Table(browser_data, colWidths=[1.5*inch, 1*inch, 2.5*inch])
t11.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c3e50')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
elements.append(t11)

# Section 9: Recent Updates
elements.append(Paragraph("9. RECENT UPDATES", heading_style))
update_data = [
    ['Date', 'Feature', 'Description'],
    ['Jan 2025', 'Customer-wise Grouping', 'Multiple items merged into 1 row per customer'],
    ['Jan 2025', 'Transaction ID', 'Each sale gets unique ID for grouping'],
    ['Jan 2025', '🖨️ Print Bill', 'Formatted receipt printing'],
    ['Jan 2025', '📱 WhatsApp Share', 'Direct bill sharing via WhatsApp'],
    ['Jan 2025', '💬 SMS Share', 'Bill sharing via text message'],
    ['Jan 2025', 'Same Bill Feature', 'Save bill for quick duplication']
]
t12 = Table(update_data, colWidths=[0.8*inch, 1.5*inch, 3.2*inch])
t12.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c3e50')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTSIZE', (0, 0), (-1, -1), 8),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
elements.append(t12)

# Section 10: Sample Bill
elements.append(Paragraph("10. SAMPLE BILL FORMAT", heading_style))
elements.append(Paragraph("""
╔════════════════════════════╗
║     SHOP MANAGEMENT SYSTEM    ║
╚════════════════════════════╝

Date: January 15, 2025
Time: 10:30 AM
Customer: John Doe
Phone: 9876543210
───────────────────────────────────
ITEM                    QTY    PRICE
───────────────────────────────────
Apple                   2kg    ₹100.00
Banana                  5pcs   ₹50.00
Orange                  3kg    ₹120.00
───────────────────────────────────
TOTAL:                  ₹270.00
───────────────────────────────────

Thank you for shopping!
Visit Again!
""", code_style))

# Section 11: Default Categories
elements.append(Paragraph("11. DEFAULT CATEGORIES", heading_style))
cat_list = ['1. Grocery', '2. Vegetables', '3. Fruits', '4. Stationery', '5. Medical', 
            '6. Clothing', '7. Electronics', '8. Household', '9. Other']
elements.append(Paragraph('  •  '.join(cat_list), normal_style))

# Section 12: Unit Types
elements.append(Paragraph("12. UNIT TYPES", heading_style))
unit_data = [
    ['Code', 'Full Name', 'Abbreviation'],
    ['pieces', 'Pieces', 'pcs'],
    ['kg', 'Kilograms', 'kg'],
    ['grams', 'Grams', 'g'],
    ['liters', 'Liters', 'L'],
    ['ml', 'Milliliters', 'ml'],
    ['boxes', 'Boxes', 'box'],
    ['packs', 'Packs', 'pack'],
    ['dozen', 'Dozen', 'dozen']
]
t13 = Table(unit_data, colWidths=[1.2*inch, 2*inch, 1.3*inch])
t13.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c3e50')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
elements.append(t13)

# Project Status
elements.append(Paragraph("13. PROJECT STATUS", heading_style))
elements.append(Paragraph("✅ Completed | ✅ Production Ready | ✅ Offline Tested | ✅ All Features Working", 
                           ParagraphStyle('Status', parent=styles['Normal'], 
                                         fontSize=14, alignment=TA_CENTER, spaceBefore=20)))

# Footer
elements.append(Spacer(1, 30))
elements.append(Paragraph("Shop Management System - Project Report | January 2025", 
                           ParagraphStyle('Footer', parent=styles['Normal'], 
                                         fontSize=10, alignment=TA_CENTER, textColor=colors.grey)))

# Build PDF
doc.build(elements)
print("PDF created successfully!")

