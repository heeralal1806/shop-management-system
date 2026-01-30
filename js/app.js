/**
 * Shop Management System - Main Application
 * Handles all UI interactions and business logic
 */

// Global state
let currentBill = [];
let editingItemId = null;
let deletingItemId = null;
let currentCustomer = { name: '', phone: '', email: '' };
let currentPaymentMethod = 'cash';
let currentUPIId = '';

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Shop Management System initializing...');
    console.log('Protocol:', location.protocol);
    console.log('User Agent:', navigator.userAgent);
    
    showToast('Initializing Shop Management System...', 'info');
    
    // Initialize database
    const dbInitialized = await window.dbManager.initializeDatabase();
    
    if (dbInitialized) {
        console.log('Database initialized successfully');
        showToast('System ready!', 'success');
    } else {
        console.warn('Database initialization had issues');
        showToast('Warning: Database initialization incomplete', 'warning');
    }

    // Setup event listeners
    setupNavigation();
    setupForms();
    setupSalesForm();
    setupDateFilter();
    
    // Update online status
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Load initial data
    await loadDashboard();
    
    // Set today's date in report filter
    const reportDateInput = document.getElementById('report-date');
    if (reportDateInput) {
        reportDateInput.value = new Date().toISOString().split('T')[0];
    }
    
    // Generate initial report
    generateReport();
    
    console.log('Shop Management System initialization complete');
    console.log('Debug info available at window.debugInfo');
});

// ==================== NAVIGATION ====================

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navigateTo(page);
        });
    });
}

function navigateTo(page) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });
    
    // Update pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'add-item': 'Add New Item',
        'items-list': 'Stock List',
        'categories': 'Category Management',
        'sales': 'Sales Entry',
        'reports': 'Daily Sales Report',
        'settings': 'Shop Settings'
    };
    document.getElementById('page-title').textContent = titles[page] || 'Shop Manager';
    
    // Load page-specific data
    loadPageData(page);
    
    // Close sidebar on mobile
    document.getElementById('sidebar').classList.remove('active');
}

function loadPageData(page) {
    switch (page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'add-item':
            loadCategoriesForAddForm();
            break;
        case 'items-list':
            loadItemsList();
            break;
        case 'categories':
            loadCategoriesList();
            break;
        case 'sales':
            loadSalesItems();
            loadProductsGrid();
            break;
        case 'reports':
            generateReport();
            break;
        case 'settings':
            loadShopSettings();
            break;
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// ==================== DASHBOARD ====================

async function loadDashboard() {
    try {
        const stats = await window.dbManager.getDashboardStats();
        
        // Update stat cards
        animateValue('total-items', stats.totalItems);
        animateValue('today-sales', `₹${stats.todaySales.toFixed(2)}`);
        animateValue('low-stock', stats.lowStockCount);
        animateValue('total-categories', stats.totalCategories);
        
        // Update date
        document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Update low stock list
        updateLowStockList(stats.lowStockItems);
        
        // Update today's sales summary
        updateTodaySalesSummary(stats.todaySalesList);
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showToast('Error loading dashboard data', 'error');
    }
}

function updateLowStockList(items) {
    const container = document.getElementById('low-stock-list');
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">✅</div>
                <p>All items are well stocked!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = items.map(item => `
        <div class="list-item low-stock-item">
            <span class="name">${escapeHtml(item.name)}</span>
            <span class="value">${item.quantity} left</span>
        </div>
    `).join('');
}

function updateTodaySalesSummary(sales) {
    const container = document.getElementById('today-summary');
    
    if (sales.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">📊</div>
                <p>No sales today yet</p>
            </div>
        `;
        return;
    }
    
    // Group sales by item
    const grouped = {};
    sales.forEach(sale => {
        if (!grouped[sale.itemName]) {
            grouped[sale.itemName] = { qty: 0, total: 0 };
        }
        grouped[sale.itemName].qty += sale.quantitySold;
        grouped[sale.itemName].total += sale.totalPrice;
    });
    
    container.innerHTML = Object.entries(grouped).map(([name, data]) => `
        <div class="list-item">
            <span class="name">${escapeHtml(name)}</span>
            <span class="value">${data.qty} × ₹${data.total.toFixed(2)}</span>
        </div>
    `).join('');
}

function animateValue(elementId, value) {
    const element = document.getElementById(elementId);
    element.textContent = value;
}

// ==================== ADD ITEM FORM ====================

async function loadCategoriesForAddForm() {
    try {
        const categories = await window.dbManager.getAllCategories();
        const select = document.getElementById('item-category');
        const editSelect = document.getElementById('edit-item-category');
        const filterSelect = document.getElementById('filter-category');
        
        const options = '<option value="">Select Category</option>' + 
            categories.map(c => `<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)}</option>`).join('');
        
        select.innerHTML = options;
        editSelect.innerHTML = options;
        filterSelect.innerHTML = '<option value="">All Categories</option>' + 
            categories.map(c => `<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)}</option>`).join('');
        
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

function getUnitLabel(unit) {
    const units = {
        'pieces': 'pcs',
        'kg': 'kg',
        'grams': 'g',
        'liters': 'L',
        'ml': 'ml',
        'boxes': 'box',
        'packs': 'pack',
        'dozen': 'dozen'
    };
    return units[unit] || unit;
}

function setupForms() {
    // Add Item Form
    document.getElementById('add-item-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        console.log('Add Item form submitted!');
        
        const name = document.getElementById('item-name').value;
        const category = document.getElementById('item-category').value;
        const unit = document.getElementById('item-unit').value;
        const price = document.getElementById('item-price').value;
        const quantity = document.getElementById('item-quantity').value;
        const description = document.getElementById('item-description').value;
        
        console.log('Form values:', { name, category, unit, price, quantity, description });
        console.log('dbManager available:', !!window.dbManager);
        console.log('dbManager.addItemProduct available:', typeof window.dbManager?.addItemProduct === 'function');
        
        try {
            console.log('Calling dbManager.addItemProduct...');
            await window.dbManager.addItemProduct({
                name: name,
                category: category,
                price: price,
                quantity: quantity,
                unit: unit,
                description: description
            });
            console.log('Item added successfully!');
            showToast('Item added successfully!', 'success');
            e.target.reset();
            // Reset unit to default
            document.getElementById('item-unit').value = 'pieces';
            loadDashboard();
        } catch (error) {
            console.error('Error adding item:', error);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            showToast('Error adding item: ' + error.message, 'error');
        }
    });
    
    // Add Category Form
    document.getElementById('add-category-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('category-name').value;
        
        try {
            await window.dbManager.addCategory(name);
            showToast('Category added successfully!', 'success');
            e.target.reset();
            loadCategoriesList();
            loadDashboard();
        } catch (error) {
            showToast('Error adding category', 'error');
        }
    });
    
    // Edit Item Form
    document.getElementById('edit-item-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = parseInt(editingItemId);
        const name = document.getElementById('edit-item-name').value;
        const category = document.getElementById('edit-item-category').value;
        const unit = document.getElementById('edit-item-unit').value;
        const price = document.getElementById('edit-item-price').value;
        const quantity = document.getElementById('edit-item-quantity').value;
        
        try {
            const item = await window.dbManager.getItemByIdProduct(id);
            item.name = name;
            item.category = category;
            item.unit = unit;
            item.price = parseFloat(price);
            item.quantity = parseFloat(quantity);
            
            await window.dbManager.updateItemProduct(item);
            showToast('Item updated successfully!', 'success');
            closeEditModal();
            loadItemsList();
            loadDashboard();
        } catch (error) {
            showToast('Error updating item', 'error');
        }
    });
    
    // Search and filter
    document.getElementById('search-items').addEventListener('input', loadItemsList);
    document.getElementById('filter-category').addEventListener('change', loadItemsList);
    document.getElementById('filter-stock').addEventListener('change', loadItemsList);
}

// ==================== ITEMS LIST ====================

async function loadItemsList() {
    try {
        const items = await window.dbManager.getAllItemsProduct();
        const search = document.getElementById('search-items').value.toLowerCase();
        const category = document.getElementById('filter-category').value;
        const stock = document.getElementById('filter-stock').value;
        
        // Filter items
        let filtered = items.filter(item => {
            const matchSearch = item.name.toLowerCase().includes(search) ||
                item.category.toLowerCase().includes(search);
            const matchCategory = !category || item.category === category;
            
            let matchStock = true;
            if (stock === 'low') matchStock = item.quantity > 0 && item.quantity <= 10;
            else if (stock === 'out') matchStock = item.quantity === 0;
            else if (stock === 'available') matchStock = item.quantity > 10;
            
            return matchSearch && matchCategory && matchStock;
        });
        
        const tbody = document.getElementById('items-table-body');
        
        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <div class="icon">📦</div>
                        <p>No items found</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = filtered.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${escapeHtml(item.name)}</td>
                <td>${escapeHtml(item.category)}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>
                    <span class="quantity-badge ${getStockClass(item.quantity)}">
                        ${item.quantity} ${getUnitLabel(item.unit)}
                    </span>
                </td>
                <td>${getUnitLabel(item.unit)}</td>
                <td class="actions">
                    <button class="btn btn-secondary btn-small" onclick="openEditModal(${item.id})">Edit</button>
                    <button class="btn btn-danger btn-small" onclick="openDeleteModal(${item.id})">Delete</button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error loading items:', error);
        showToast('Error loading items', 'error');
    }
}

function getStockClass(quantity) {
    if (quantity === 0) return 'out';
    if (quantity <= 10) return 'low';
    return 'available';
}

// ==================== EDIT ITEM MODAL ====================

async function openEditModal(id) {
    try {
        const item = await window.dbManager.getItemByIdProduct(id);
        if (!item) {
            showToast('Item not found', 'error');
            return;
        }
        
        editingItemId = id;
        document.getElementById('edit-item-id').value = id;
        document.getElementById('edit-item-name').value = item.name;
        document.getElementById('edit-item-price').value = item.price;
        document.getElementById('edit-item-quantity').value = item.quantity;
        
        await loadCategoriesForAddForm();
        document.getElementById('edit-item-category').value = item.category;
        document.getElementById('edit-item-unit').value = item.unit || 'pieces';
        
        document.getElementById('edit-modal').classList.add('active');
        
    } catch (error) {
        console.error('Error opening edit modal:', error);
        showToast('Error loading item', 'error');
    }
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.remove('active');
    editingItemId = null;
}

// ==================== DELETE ITEM MODAL ====================

function openDeleteModal(id) {
    deletingItemId = id;
    document.getElementById('delete-modal').classList.add('active');
}

function closeDeleteModal() {
    document.getElementById('delete-modal').classList.remove('active');
    deletingItemId = null;
}

async function confirmDelete() {
    if (!deletingItemId) return;
    
    try {
        await window.dbManager.deleteItemProduct(deletingItemId);
        showToast('Item deleted successfully!', 'success');
        closeDeleteModal();
        loadItemsList();
        loadDashboard();
    } catch (error) {
        showToast('Error deleting item', 'error');
    }
}

// ==================== CATEGORIES ====================

async function loadCategoriesList() {
    try {
        const categories = await window.dbManager.getAllCategories();
        const container = document.getElementById('categories-list');
        
        if (categories.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="icon">🏷️</div>
                    <p>No categories yet</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = categories.map(cat => `
            <div class="category-item">
                <span class="name">${escapeHtml(cat.name)}</span>
                <button class="btn btn-danger btn-small" onclick="deleteCategory(${cat.id})">Delete</button>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading categories:', error);
        showToast('Error loading categories', 'error');
    }
}

async function deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
        await window.dbManager.deleteCategory(id);
        showToast('Category deleted successfully!', 'success');
        loadCategoriesList();
        loadDashboard();
    } catch (error) {
        showToast('Error deleting category', 'error');
    }
}

// ==================== SALES ====================

async function loadSalesItems() {
    try {
        const items = await window.dbManager.getAllItemsProduct();
        const availableItems = items.filter(item => item.quantity > 0);
        
        const select = document.getElementById('sale-item');
        select.innerHTML = '<option value="">Select an item</option>' +
            availableItems.map(item => 
                `<option value="${item.id}">${escapeHtml(item.name)} (₹${item.price.toFixed(2)}/${getUnitLabel(item.unit)}) - Stock: ${item.quantity} ${getUnitLabel(item.unit)}</option>`
            ).join('');
        
    } catch (error) {
        console.error('Error loading sales items:', error);
    }
}

function setupSalesForm() {
    const form = document.getElementById('sales-form');
    const quantityInput = document.getElementById('sale-quantity');
    const itemSelect = document.getElementById('sale-item');
    const customerNameInput = document.getElementById('customer-name');
    const customerPhoneInput = document.getElementById('customer-phone');
    const customerEmailInput = document.getElementById('customer-email');
    const upiIdInput = document.getElementById('upi-id');
    const paymentMethodInputs = document.querySelectorAll('input[name="payment-method"]');
    
    // Track customer info changes
    customerNameInput.addEventListener('input', () => {
        currentCustomer.name = customerNameInput.value;
        updateBillHeader();
    });
    
    customerPhoneInput.addEventListener('input', () => {
        currentCustomer.phone = customerPhoneInput.value;
        updateBillHeader();
    });
    
    // Track email changes
    customerEmailInput.addEventListener('input', () => {
        currentCustomer.email = customerEmailInput.value;
    });
    
    // Track UPI ID changes
    upiIdInput.addEventListener('input', () => {
        currentUPIId = upiIdInput.value.trim();
    });
    
    // Track payment method changes
    paymentMethodInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            currentPaymentMethod = e.target.value;
            toggleUPIInput();
        });
    });
    
    itemSelect.addEventListener('change', async () => {
        const itemId = itemSelect.value;
        const detailsDiv = document.getElementById('item-details');
        
        if (!itemId) {
            detailsDiv.classList.remove('active');
            return;
        }
        
        try {
            const item = await window.dbManager.getItemByIdProduct(parseInt(itemId));
            if (item) {
                detailsDiv.innerHTML = `
                    <p><strong>Price:</strong> ₹${item.price.toFixed(2)} per ${getUnitLabel(item.unit)}</p>
                    <p><strong>Available:</strong> ${item.quantity} ${getUnitLabel(item.unit)}</p>
                    <p><strong>Total:</strong> ₹<span id="line-total">0.00</span></p>
                `;
                detailsDiv.classList.add('active');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
    
    quantityInput.addEventListener('input', async () => {
        const itemId = itemSelect.value;
        const quantity = parseFloat(quantityInput.value) || 0;
        
        if (itemId && quantity > 0) {
            try {
                const item = await window.dbManager.getItemByIdProduct(parseInt(itemId));
                if (item) {
                    const total = quantity * item.price;
                    document.getElementById('line-total').textContent = total.toFixed(2);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const itemId = parseInt(itemSelect.value);
        const quantity = parseFloat(quantityInput.value);
        
        if (!itemId || !quantity || quantity <= 0) {
            showToast('Please select an item and enter valid quantity', 'warning');
            return;
        }
        
        addToBill(itemId, quantity);
        form.reset();
        document.getElementById('item-details').classList.remove('active');
    });
}

function updateBillHeader() {
    const headerDiv = document.getElementById('bill-header');
    if (currentBill.length > 0) {
        headerDiv.style.display = 'block';
        document.getElementById('bill-customer-name').textContent = currentCustomer.name || '-';
        document.getElementById('bill-customer-phone').textContent = currentCustomer.phone || '-';
        document.getElementById('bill-date').textContent = new Date().toLocaleDateString();
    } else {
        headerDiv.style.display = 'none';
    }
}

// ==================== PRODUCTS GRID ====================

let allProducts = [];
let productQuantities = {};

async function loadProductsGrid() {
    try {
        allProducts = await window.dbManager.getAllItemsProduct();
        renderProductsGrid(allProducts);
        
        // Setup search
        document.getElementById('product-search').addEventListener('input', (e) => {
            const search = e.target.value.toLowerCase();
            const filtered = allProducts.filter(item => 
                item.name.toLowerCase().includes(search) ||
                item.category.toLowerCase().includes(search)
            );
            renderProductsGrid(filtered);
        });
        
    } catch (error) {
        console.error('Error loading products grid:', error);
    }
}

function renderProductsGrid(items) {
    const grid = document.getElementById('products-grid');
    const availableItems = items.filter(item => item.quantity > 0);
    
    if (availableItems.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="icon">📦</div>
                <p>No items available</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = availableItems.map(item => `
        <div class="product-card" onclick="quickAddToBill(${item.id})">
            <div class="product-name">${escapeHtml(item.name)}</div>
            <div class="product-price">₹${item.price.toFixed(2)}</div>
            <div class="product-stock">Stock: ${item.quantity} ${getUnitLabel(item.unit)}</div>
            <div class="product-unit">${getUnitLabel(item.unit)}</div>
            <div class="product-qty-controls">
                <button class="qty-btn" onclick="event.stopPropagation(); changeProductQty(${item.id}, -1)">-</button>
                <input type="number" class="qty-input" id="pqty-${item.id}" value="1" min="1" max="${item.quantity}" readonly>
                <button class="qty-btn" onclick="event.stopPropagation(); changeProductQty(${item.id}, 1)">+</button>
            </div>
            <div class="add-icon">➕ Add</div>
        </div>
    `).join('');
}

function changeProductQty(itemId, delta) {
    const input = document.getElementById(`pqty-${itemId}`);
    const item = allProducts.find(p => p.id === itemId);
    if (!item || !input) return;
    
    let current = parseInt(input.value) || 1;
    let newQty = current + delta;
    
    if (newQty < 1) newQty = 1;
    if (newQty > item.quantity) newQty = item.quantity;
    
    input.value = newQty;
}

async function quickAddToBill(itemId) {
    const input = document.getElementById(`pqty-${itemId}`);
    const quantity = input ? parseInt(input.value) || 1 : 1;
    
    await addToBill(itemId, quantity);
    
    // Reset quantity to 1 after adding
    if (input) {
        input.value = 1;
    }
}

async function addToBill(itemId, quantity) {
    try {
        const item = await window.dbManager.getItemByIdProduct(itemId);
        if (!item) {
            showToast('Item not found', 'error');
            return;
        }
        
        if (item.quantity < quantity) {
            showToast(`Only ${item.quantity} ${getUnitLabel(item.unit)} available`, 'warning');
            return;
        }
        
        const lineTotal = quantity * item.price;
        
        currentBill.push({
            itemId: item.id,
            name: item.name,
            price: item.price,
            unit: item.unit,
            quantity: quantity,
            total: lineTotal
        });
        
        updateBillDisplay();
        showToast(`Added ${quantity} ${getUnitLabel(item.unit)} × ${item.name} to bill`, 'success');
        
    } catch (error) {
        console.error('Error adding to bill:', error);
        showToast('Error adding item to bill', 'error');
    }
}

function updateBillDisplay() {
    const container = document.getElementById('bill-items');
    
    if (currentBill.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">🛒</div>
                <p>Bill is empty</p>
            </div>
        `;
        document.getElementById('bill-total-amount').textContent = '0.00';
        document.getElementById('bill-header').style.display = 'none';
        return;
    }
    
    container.innerHTML = currentBill.map((item, index) => `
        <div class="bill-item">
            <div class="item-info">
                <div class="item-name">${escapeHtml(item.name)}</div>
                <div class="item-qty">${item.quantity} ${getUnitLabel(item.unit)} × ₹${item.price.toFixed(2)}</div>
            </div>
            <div class="item-price">₹${item.total.toFixed(2)}</div>
            <button class="remove-item" onclick="removeFromBill(${index})">×</button>
        </div>
    `).join('');
    
    const total = currentBill.reduce((sum, item) => sum + item.total, 0);
    document.getElementById('bill-total-amount').textContent = total.toFixed(2);
    
    // Update bill header with customer info
    updateBillHeader();
}

function removeFromBill(index) {
    currentBill.splice(index, 1);
    updateBillDisplay();
}

// Toggle UPI input field based on payment method selection
function toggleUPIInput() {
    const upiContainer = document.getElementById('upi-id-container');
    if (currentPaymentMethod === 'upi') {
        upiContainer.style.display = 'block';
    } else {
        upiContainer.style.display = 'none';
        currentUPIId = '';
        document.getElementById('upi-id').value = '';
    }
}

// Get payment method display name
function getPaymentMethodLabel(method) {
    const methods = {
        'cash': '💵 Cash',
        'upi': '📱 UPI',
        'card': '💳 Card',
        'credit': '📋 Credit/Pay Later'
    };
    return methods[method] || method;
}

// Generate UPI payment link
function generateUPILink(amount) {
    const settings = getShopSettings();
    const upiId = currentUPIId || settings.shopPhone + '@upi';
    const payeeName = encodeURIComponent(settings.shopName || 'Shop');
    const amountEncoded = encodeURIComponent(amount.toFixed(2));
    const note = encodeURIComponent(`Bill Payment - ${document.getElementById('bill-number')?.textContent || ''}`);
    
    return `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amountEncoded}&tn=${note}`;
}

// Generate UPI QR code data URL
function generateUPIQRCode(amount) {
    const settings = getShopSettings();
    const upiId = currentUPIId || settings.shopPhone + '@upi';
    const payeeName = settings.shopName || 'Shop';
    
    // UPI payment string
    const upiString = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${encodeURIComponent(amount.toFixed(2))}&cu=INR`;
    
    // Generate QR code using a simple canvas-based approach
    // Using qrcode.js library format for data URL
    return generateQRCodeDataURL(upiString);
}

// Simple QR code generator using canvas
function generateQRCodeDataURL(text) {
    try {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // QR code parameters
        const size = 150;
        const margin = 10;
        const moduleSize = Math.floor((size - margin * 2) / 25);
        
        canvas.width = size;
        canvas.height = size;
        
        // Fill white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        
        // Generate simple pattern based on text hash
        ctx.fillStyle = '#000000';
        
        // Create pattern from text
        const hash = text.split('').reduce((acc, char) => {
            return ((acc << 5) - acc) + char.charCodeAt(0);
        }, 0);
        
        // Draw finder patterns (top-left, top-right, bottom-left)
        const drawFinderPattern = (x, y) => {
            // Outer square
            ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize);
            // White space
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize);
            // Inner square
            ctx.fillStyle = '#000000';
            ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize);
        };
        
        drawFinderPattern(margin, margin);
        drawFinderPattern(size - margin - 7 * moduleSize, margin);
        drawFinderPattern(margin, size - margin - 7 * moduleSize);
        
        // Draw data modules based on hash
        ctx.fillStyle = '#000000';
        for (let i = 0; i < 25; i++) {
            for (let j = 0; j < 25; j++) {
                // Skip finder pattern areas
                if ((i < 8 && j < 8) || (i < 8 && j > 16) || (i > 16 && j < 8)) continue;
                
                const bit = ((hash >> ((i * 25 + j) % 32)) & 1);
                if (bit) {
                    ctx.fillRect(margin + i * moduleSize, margin + j * moduleSize, moduleSize - 1, moduleSize - 1);
                }
            }
        }
        
        return canvas.toDataURL('image/png');
    } catch (e) {
        console.error('Error generating QR code:', e);
        return null;
    }
}

function clearBill() {
    currentBill = [];
    currentCustomer = { name: '', phone: '', email: '' };
    currentPaymentMethod = 'cash';
    currentUPIId = '';
    // Clear input fields
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-phone').value = '';
    document.getElementById('customer-email').value = '';
    document.getElementById('upi-id').value = '';
    document.getElementById('upi-id-container').style.display = 'none';
    // Reset payment method to cash
    document.querySelector('input[name="payment-method"][value="cash"]').checked = true;
    updateBillDisplay();
    showToast('Bill cleared', 'info');
}

// Store saved bill for "Same Bill" feature
let savedBill = null;
let savedCustomer = null;

function duplicateBill() {
    if (currentBill.length === 0) {
        showToast('Bill is empty', 'warning');
        return;
    }
    
    // Save the current bill and customer info
    savedBill = JSON.parse(JSON.stringify(currentBill));
    savedCustomer = { ...currentCustomer };
    
    // Clear the bill but keep customer info
    currentBill = [];
    updateBillDisplay();
    
    showToast('Bill saved! Ready for next customer', 'success');
}

// Generate bill text for printing/sharing
function generateBillText() {
    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const time = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    let billText = `╔════════════════════════════╗
║     SHOP MANAGEMENT SYSTEM    ║
╚════════════════════════════╝

Date: ${date}
Time: ${time}
Customer: ${currentCustomer.name || 'Walk-in'}
Phone: ${currentCustomer.phone || '-'}
───────────────────────────────────
ITEM                    QTY    PRICE
───────────────────────────────────\n`;
    
    currentBill.forEach(item => {
        const name = item.name.substring(0, 20).padEnd(20);
        const qty = `${item.quantity}${getUnitLabel(item.unit)}`.substring(0, 8).padEnd(8);
        const price = `₹${item.total.toFixed(2)}`;
        billText += `${name}${qty}${price}\n`;
    });
    
    const total = document.getElementById('bill-total-amount').textContent;
    billText += `───────────────────────────────────
TOTAL:                    ${total}
───────────────────────────────────

Thank you for shopping!
Visit Again!
`;
    
    return billText;
}

// Print bill using browser print
function printBill() {
    if (currentBill.length === 0) {
        showToast('Bill is empty', 'warning');
        return;
    }
    
    const billText = generateBillText();
    
    // Create a print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Print Bill</title>
            <style>
                body {
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    margin: 0;
                    padding: 20px;
                    white-space: pre-wrap;
                }
                @media print {
                    body { margin: 0; }
                }
            </style>
        </head>
        <body>${billText}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    
    showToast('Bill sent to printer', 'success');
}

// Share bill via SMS
function shareViaSMS() {
    if (currentBill.length === 0) {
        showToast('Bill is empty', 'warning');
        return;
    }
    
    const phone = currentCustomer.phone || '';
    
    if (!phone) {
        showToast('Please enter customer phone number', 'warning');
        return;
    }
    
    // Generate shortened bill text for SMS
    const date = new Date().toLocaleDateString();
    let smsText = `SHOP BILL - ${date}\n`;
    smsText += `Items: ${currentBill.length}\n`;
    
    currentBill.forEach(item => {
        smsText += `${item.name}: ${item.quantity}${getUnitLabel(item.unit)} = ₹${item.total.toFixed(2)}\n`;
    });
    
    const total = document.getElementById('bill-total-amount').textContent;
    smsText += `Total: ${total}\nThank You!`;
    
    // Encode for SMS URL
    const encodedText = encodeURIComponent(smsText);

    // Safari-compatible SMS URL handling
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    let smsUrl;
    if (isSafari) {
        smsUrl = `sms:${cleanPhone}&body=${encodedText}`;
    } else {
        smsUrl = `sms:${cleanPhone}?body=${encodedText}`;
    }
    window.open(smsUrl, '_blank');
}

async function completeSale() {
    if (currentBill.length === 0) {
        showToast('Bill is empty - add items first!', 'warning');
        return;
    }
    
    // Check if dbManager is available
    if (!window.dbManager) {
        console.error('ERROR: dbManager is not defined!');
        showToast('Error: Database not initialized!', 'error');
        return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    try {
        // Generate a single transaction ID and bill number for all items in this bill
        const transactionId = window.dbManager.generateTransactionId();
        const billNumber = window.dbManager.generateBillNumber();
        
        console.log('=== COMPLETE SALE DEBUG ===');
        console.log('Transaction ID:', transactionId);
        console.log('Bill Number:', billNumber);
        console.log('Current Bill Items:', currentBill);
        console.log('Customer:', currentCustomer);
        console.log('Date:', today);
        
        let saleCount = 0;
        for (const item of currentBill) {
            if (!item.itemId) {
                console.error('ERROR: Item has no itemId:', item);
                continue;
            }
            
            console.log(`Recording sale for item: ${item.name}, Qty: ${item.quantity}, Total: ${item.total}`);
            
            try {
                await window.dbManager.recordSale({
                    itemId: item.itemId,
                    itemName: item.name,
                    quantitySold: item.quantity,
                    pricePerUnit: item.price,
                    totalPrice: item.total,
                    unit: item.unit,
                    customerName: currentCustomer.name,
                    customerPhone: currentCustomer.phone,
                    date: today,
                    transactionId: transactionId,
                    billNumber: billNumber
                });
                console.log('✅ Sale recorded successfully for:', item.name);
                saleCount++;
            } catch (saleError) {
                console.error('❌ Error recording sale for', item.name, ':', saleError);
            }
            
            try {
                const originalItem = await window.dbManager.getItemByIdProduct(item.itemId);
                if (originalItem) {
                    const newQuantity = originalItem.quantity - item.quantity;
                    await window.dbManager.updateItemQuantity(item.itemId, newQuantity);
                    console.log('✅ Stock updated for', item.name, ':', originalItem.quantity, '->', newQuantity);
                } else {
                    console.error('❌ Item not found in database:', item.itemId);
                }
            } catch (stockError) {
                console.error('❌ Error updating stock for', item.name, ':', stockError);
            }
        }
        
        console.log('=== SALE SUMMARY ===');
        console.log('Total items in bill:', currentBill.length);
        console.log('Sales recorded:', saleCount);
        
        if (saleCount === 0) {
            showToast('Error: No sales were recorded! Check console for errors.', 'error');
            return;
        }
        
        // Check if we have a saved bill to restore
        if (savedBill && savedBill.length > 0) {
            currentBill = JSON.parse(JSON.stringify(savedBill));
            // Clear saved bill after restoring
            savedBill = null;
            savedCustomer = null;
            updateBillDisplay();
            showToast(`Sale completed! Same bill restored for next customer`, 'success');
        } else {
            clearBill();
            showToast(`Sale completed! Total: ₹${document.getElementById('bill-total-amount').textContent}`, 'success');
        }
        
        loadDashboard();
        loadSalesItems();
        
        // Refresh the sales report if user is on reports page
        const reportsPage = document.getElementById('reports-page');
        if (reportsPage && reportsPage.classList.contains('active')) {
            generateReport();
        }
        
    } catch (error) {
        console.error('Error completing sale:', error);
        showToast('Error completing sale', 'error');
    }
}

// ==================== REPORTS ====================

function setupDateFilter() {
    const dateInput = document.getElementById('report-date');
    dateInput.addEventListener('change', () => {
        generateReport();
    });
}

function setReportDate(range) {
    const dateInput = document.getElementById('report-date');
    const today = new Date();
    
    switch (range) {
        case 'today':
            dateInput.value = today.toISOString().split('T')[0];
            showToast('Showing today\'s report', 'info');
            break;
        case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            dateInput.value = yesterday.toISOString().split('T')[0];
            showToast('Showing yesterday\'s report', 'info');
            break;
        case 'last7':
            const last7 = new Date(today);
            last7.setDate(last7.getDate() - 7);
            dateInput.value = last7.toISOString().split('T')[0];
            showToast('Showing last 7 days report', 'info');
            break;
    }
    
    generateReport();
}

// Make generateReport globally accessible
window.generateReportManual = function() {
    generateReport();
};

async function generateReport() {
    const dateInput = document.getElementById('report-date');
    if (!dateInput) {
        console.error('Report date input not found');
        return;
    }
    
    const date = dateInput.value;
    if (!date) {
        showToast('Please select a date', 'warning');
        return;
    }
    
    try {
        // Check if dbManager is available
        if (!window.dbManager) {
            showToast('Database not initialized', 'error');
            return;
        }
        
        const sales = await window.dbManager.getSalesBySpecificDate(date);
        
        // Ensure sales is an array
        const salesData = Array.isArray(sales) ? sales : [];
        
        // Group sales by transactionId (items purchased together in one sale)
        const groupedTransactions = {};
        
        salesData.forEach(sale => {
            // Use transactionId as the grouping key
            const transactionKey = sale.transactionId || sale.createdAt || 'unknown';
            
            if (!groupedTransactions[transactionKey]) {
                groupedTransactions[transactionKey] = {
                    transactionId: sale.transactionId || 'N/A',
                    customerName: sale.customerName || '-',
                    customerPhone: sale.customerPhone || '-',
                    time: sale.createdAt ? new Date(sale.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    }) : 'N/A',
                    items: [],
                    totalPrice: 0,
                    totalQuantity: 0
                };
            }
            
            // Add item to transaction
            groupedTransactions[transactionKey].items.push({
                name: sale.itemName || 'Unknown',
                quantity: sale.quantitySold || 0,
                unit: sale.unit
            });
            groupedTransactions[transactionKey].totalPrice += (sale.totalPrice || 0);
            groupedTransactions[transactionKey].totalQuantity += (sale.quantitySold || 0);
        });
        
        // Convert to array and sort by time (most recent first)
        const transactions = Object.values(groupedTransactions).sort((a, b) => {
            return new Date(b.time) - new Date(a.time);
        });
        
        // Calculate summary
        const totalSales = transactions.reduce((sum, t) => sum + t.totalPrice, 0);
        const customerCount = transactions.length; // Count of unique customers/transactions
        
        document.getElementById('report-total-sales').textContent = `₹${totalSales.toFixed(2)}`;
        document.getElementById('report-total-items').textContent = customerCount;
        document.getElementById('report-total-transactions').textContent = transactions.length;
        
        // Build table with grouped transactions
        const tbody = document.getElementById('report-table-body');
        
        if (transactions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <div class="icon">📊</div>
                        <p>No sales on ${formatDate(date)}</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        let tableHtml = '';
        transactions.forEach((transaction) => {
            // Format items list - merge multiple items into one description
            const itemsSummary = transaction.items.map(item => {
                const unitLabel = getUnitLabel(item.unit);
                return `${item.quantity}${unitLabel} × ${item.name}`;
            }).join(', ');
            
            tableHtml += `
                <tr>
                    <td>${transaction.time}</td>
                    <td>${itemsSummary}</td>
                    <td>${escapeHtml(transaction.customerName)}</td>
                    <td>${escapeHtml(transaction.customerPhone)}</td>
                    <td>1</td>
                    <td>₹${transaction.totalPrice.toFixed(2)}</td>
                </tr>
            `;
        });
        
        tbody.innerHTML = tableHtml;
        
    } catch (error) {
        console.error('Error generating report:', error);
        showToast('Error loading report data', 'error');
    }
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ==================== UTILITIES ====================

function updateOnlineStatus() {
    const statusElement = document.getElementById('online-status');
    if (navigator.onLine) {
        statusElement.textContent = '● Online';
        statusElement.className = 'status-online';
    } else {
        statusElement.textContent = '○ Offline';
        statusElement.className = 'status-offline';
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast active ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== BILL LINK GENERATION ====================

/**
 * Generate a short unique ID for the bill
 */
function generateShortBillId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Generate a shareable link for the current bill
 * Uses short ID stored in localStorage for shorter URLs
 */
function generateBillLink() {
    if (currentBill.length === 0) {
        showToast('Bill is empty', 'warning');
        return null;
    }
    
    // Generate a short unique ID
    const shortId = generateShortBillId();
    
    const billData = {
        d: new Date().toLocaleDateString(),
        n: currentCustomer.name || '',
        p: currentCustomer.phone || '',
        b: generateBillNumber(),
        i: currentBill.map(item => ({
            n: item.name.substring(0, 15),
            q: item.quantity,
            u: item.unit,
            t: item.total
        })),
        tot: parseFloat(document.getElementById('bill-total-amount').textContent)
    };
    
    // Store in localStorage
    try {
        localStorage.setItem('bill_' + shortId, JSON.stringify(billData));
    } catch (e) {
        console.error('Error storing bill:', e);
    }
    
    // Get base URL
    const baseUrl = window.location.href.split('?')[0].split('#')[0];
    const billUrl = `${baseUrl}bill-viewer.html?i=${shortId}`;
    
    return billUrl;
}

/**
 * Generate a unique bill number
 */
function generateBillNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `BILL${year}${month}${day}${random}`;
}

/**
 * Show bill link in a modal and copy to clipboard
 */
function showBillLink() {
    const link = generateBillLink();
    if (!link) return;
    
    // Create or update link display
    let linkModal = document.getElementById('bill-link-modal');
    if (!linkModal) {
        linkModal = document.createElement('div');
        linkModal.id = 'bill-link-modal';
        linkModal.className = 'modal';
        linkModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>📋 Bill Link Generated</h3>
                    <button class="close-btn" onclick="closeBillLinkModal()">×</button>
                </div>
                <div class="modal-body">
                    <p>Here is your bill</p>
                    <div class="link-container">
                        <input type="text" id="bill-link-input" readonly>
                        <button class="btn btn-primary" onclick="copyBillLink()">Copy</button>
                    </div>
                    <p class="link-hint">Share this link with your customer to view the bill</p>
                </div>
            </div>
        `;
        document.body.appendChild(linkModal);
    }
    
    document.getElementById('bill-link-input').value = link;
    linkModal.classList.add('active');
    
    // Auto-copy the link
    copyBillLink();
}

/**
 * Copy bill link to clipboard
 */
async function copyBillLink() {
    const link = document.getElementById('bill-link-input').value;
    if (!link) return;
    
    try {
        await navigator.clipboard.writeText(link);
        showToast('Link copied to clipboard!', 'success');
    } catch (e) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = link;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Link copied to clipboard!', 'success');
    }
}

/**
 * Close bill link modal
 */
function closeBillLinkModal() {
    const modal = document.getElementById('bill-link-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Share bill link via WhatsApp
 */
function shareBillLinkWhatsApp() {
    const link = generateBillLink();
    if (!link) return;
    
    const message = `Here is your bill\n${link}`;
    const encodedText = encodeURIComponent(message);
    
    if (currentCustomer.phone) {
        const cleanPhone = currentCustomer.phone.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, '_blank');
    } else {
        window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    }
}

/**
 * Share bill link via SMS
 */
function shareBillLinkSMS() {
    const link = generateBillLink();
    if (!link) return;
    
    const phone = currentCustomer.phone || '';
    if (!phone) {
        showToast('Please enter customer phone number', 'warning');
        return;
    }
    
    const message = `Here is your bill\n${link}`;
    const encodedText = encodeURIComponent(message);
    // Safari-compatible SMS URL handling
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    let smsUrl;
    if (isSafari) {
        smsUrl = `sms:${cleanPhone}&body=${encodedText}`;
    } else {
        smsUrl = `sms:${cleanPhone}?body=${encodedText}`;
    }
    window.open(smsUrl, '_blank');
}

// Add CSS for bill link modal if not exists
function addBillLinkModalStyles() {
    if (document.getElementById('bill-link-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'bill-link-modal-styles';
    style.textContent = `
        #bill-link-modal .modal-content {
            max-width: 500px;
            padding: 20px;
        }
        #bill-link-modal .link-container {
            display: flex;
            gap: 10px;
            margin: 15px 0;
        }
        #bill-link-modal .link-container input {
            flex: 1;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            background: #f8f9fa;
        }
        #bill-link-modal .link-hint {
            font-size: 13px;
            color: #666;
            margin-top: 10px;
        }
    `;
    document.head.appendChild(style);
}

// Initialize modal styles
addBillLinkModalStyles();

// Make functions globally available
window.navigateTo = navigateTo;
window.toggleSidebar = toggleSidebar;
window.openEditModal = openEditModal;
window.closeEditModal = closeEditModal;
window.openDeleteModal = openDeleteModal;
window.closeDeleteModal = closeDeleteModal;
window.confirmDelete = confirmDelete;
window.deleteCategory = deleteCategory;
window.removeFromBill = removeFromBill;
window.clearBill = clearBill;
window.duplicateBill = duplicateBill;
window.printBill = printBill;
window.completeSale = completeSale;
window.generateReport = generateReport;
window.quickAddToBill = quickAddToBill;
window.changeProductQty = changeProductQty;
window.setReportDate = setReportDate;
window.generateBillLink = generateBillLink;
window.showBillLink = showBillLink;
window.copyBillLink = copyBillLink;
window.closeBillLinkModal = closeBillLinkModal;
window.loadShopSettings = loadShopSettings;
window.saveShopSettings = saveShopSettings;
window.getShopSettings = getShopSettings;
window.resetToDefaultSettings = resetToDefaultSettings;
window.showSaleCompleteModal = showSaleCompleteModal;

/**
 * Get shop settings from localStorage
 */
function getShopSettings() {
    const defaultSettings = {
        shopName: 'My Shop',
        shopAddress: '',
        shopPhone: '',
        shopGST: '',
        shopEmail: ''
    };
    
    try {
        const settings = localStorage.getItem('shopSettings');
        if (settings) {
            return { ...defaultSettings, ...JSON.parse(settings) };
        }
    } catch (e) {
        console.error('Error loading settings:', e);
    }
    
    return defaultSettings;
}

/**
 * Save shop settings to localStorage
 */
function saveShopSettings(settings) {
    try {
        localStorage.setItem('shopSettings', JSON.stringify(settings));
        return true;
    } catch (e) {
        console.error('Error saving settings:', e);
        return false;
    }
}

/**
 * Load shop settings and populate the form
 */
function loadShopSettings() {
    const settings = getShopSettings();
    
    document.getElementById('shop-name').value = settings.shopName || '';
    document.getElementById('shop-address').value = settings.shopAddress || '';
    document.getElementById('shop-phone').value = settings.shopPhone || '';
    document.getElementById('shop-gst').value = settings.shopGST || '';
    document.getElementById('shop-email').value = settings.shopEmail || '';
    
    // Update preview
    updateSettingsPreview(settings);
}

/**
 * Update the settings preview card
 */
function updateSettingsPreview(settings) {
    const previewName = document.getElementById('preview-shop-name');
    const previewAddress = document.getElementById('preview-shop-address');
    
    if (previewName) {
        previewName.textContent = settings.shopName || 'Your Shop Name';
    }
    if (previewAddress) {
        let address = settings.shopAddress || '';
        if (settings.shopPhone) {
            address = address ? `${address} | 📞 ${settings.shopPhone}` : `📞 ${settings.shopPhone}`;
        }
        previewAddress.textContent = address || 'Shop address will appear here';
    }
}

/**
 * Reset settings to default
 */
function resetToDefaultSettings() {
    const defaultSettings = {
        shopName: 'My Shop',
        shopAddress: '',
        shopPhone: '',
        shopGST: '',
        shopEmail: ''
    };
    
    saveShopSettings(defaultSettings);
    loadShopSettings();
    showToast('Settings reset to default', 'info');
}

// Setup settings form
document.addEventListener('DOMContentLoaded', () => {
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const settings = {
                shopName: document.getElementById('shop-name').value.trim(),
                shopAddress: document.getElementById('shop-address').value.trim(),
                shopPhone: document.getElementById('shop-phone').value.trim(),
                shopGST: document.getElementById('shop-gst').value.trim(),
                shopEmail: document.getElementById('shop-email').value.trim()
            };
            
            if (saveShopSettings(settings)) {
                updateSettingsPreview(settings);
                showToast('Settings saved successfully!', 'success');
            } else {
                showToast('Error saving settings', 'error');
            }
        });
    }
});

// ==================== ENHANCED BILL LINK GENERATION ====================

/**
 * Generate a very short unique ID for the bill (8 characters)
 */
function generateShortBillId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    // Use timestamp + random for uniqueness
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    result = timestamp.substring(timestamp.length - 4) + random;
    return result;
}

/**
 * Generate a unique bill number
 */
function generateBillNumber() {
    const settings = getShopSettings();
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${settings.shopName.substring(0, 3).toUpperCase()}${year}${month}${day}${random}`;
}

/**
 * Generate a compressed shareable link for the current bill
 */
function generateBillLink() {
    if (currentBill.length === 0) {
        showToast('Bill is empty', 'warning');
        return null;
    }
    
    // Generate a short unique ID
    const shortId = generateShortBillId();
    
    const billData = {
        // Use short property names to minimize URL length
        d: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
        n: currentCustomer.name || '',
        p: currentCustomer.phone || '',
        e: currentCustomer.email || '',
        b: generateBillNumber(),
        pay: currentPaymentMethod,
        upi: currentUPIId || '',
        i: currentBill.map(item => ({
            n: item.name.substring(0, 20),
            q: item.quantity,
            u: item.unit,
            t: parseFloat(item.total.toFixed(2))
        })),
        tot: parseFloat(document.getElementById('bill-total-amount').textContent),
        s: getShopSettings().shopName // Include shop name
    };
    
    // Store in localStorage with expiration (7 days)
    const storageData = {
        data: billData,
        created: Date.now(),
        expires: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    };
    
    try {
        localStorage.setItem('bill_' + shortId, JSON.stringify(storageData));
    } catch (e) {
        console.error('Error storing bill:', e);
    }
    
    // Get base URL
    const baseUrl = window.location.href.split('?')[0].split('#')[0].replace('index.html', '');
    const billUrl = `${baseUrl}bill-viewer.html?i=${shortId}`;
    
    return billUrl;
}

/**
 * Show bill link in a modal and provide sharing options
 */
function showBillLink() {
    const link = generateBillLink();
    if (!link) return;
    
    // Create or update link modal with sharing options
    let linkModal = document.getElementById('bill-link-modal');
    if (!linkModal) {
        linkModal = document.createElement('div');
        linkModal.id = 'bill-link-modal';
        linkModal.className = 'modal';
        linkModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🔗 Bill Link Generated</h3>
                    <button class="close-btn" onclick="closeBillLinkModal()">×</button>
                </div>
                <div class="modal-body">
                    <p>Share this link with your customer:</p>
                    <div class="link-container">
                        <input type="text" id="bill-link-input" readonly>
                        <button class="btn btn-primary" onclick="copyBillLink()">Copy</button>
                    </div>
                    <div class="share-buttons" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 15px;">
                        <button class="btn btn-whatsapp" onclick="shareBillLinkDirect('whatsapp')">
                            📱 WhatsApp
                        </button>
                        <button class="btn btn-sms" onclick="shareBillLinkDirect('sms')">
                            💬 SMS
                        </button>
                    </div>
                    <p class="link-hint" style="font-size: 12px; color: #666; margin-top: 15px;">
                        Link expires in 7 days. Customer can view bill without app installation.
                    </p>
                </div>
            </div>
        `;
        document.body.appendChild(linkModal);
    }
    
    document.getElementById('bill-link-input').value = link;
    linkModal.classList.add('active');
    
    // Auto-copy the link
    copyBillLink();
}

/**
 * Copy bill link to clipboard
 */
async function copyBillLink() {
    const link = document.getElementById('bill-link-input').value;
    if (!link) return;
    
    try {
        await navigator.clipboard.writeText(link);
        showToast('Link copied!', 'success');
    } catch (e) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = link;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Link copied!', 'success');
    }
}

/**
 * Close bill link modal
 */
function closeBillLinkModal() {
    const modal = document.getElementById('bill-link-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Share bill link directly via WhatsApp or SMS
 */
function shareBillLinkDirect(platform) {
    const link = document.getElementById('bill-link-input').value;
    if (!link) return;
    
    const total = document.getElementById('bill-total-amount').textContent;
    const message = `Your bill of ₹${total} is ready!\nView here: ${link}`;
    const encodedText = encodeURIComponent(message);
    
    const phone = currentCustomer.phone || '';
    
    if (platform === 'whatsapp') {
        if (phone) {
            const cleanPhone = phone.replace(/\D/g, '');
            window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, '_blank');
        } else {
            window.open(`https://wa.me/?text=${encodedText}`, '_blank');
        }
    } else if (platform === 'sms') {
        if (!phone) {
            showToast('Please enter customer phone number', 'warning');
            return;
        }
        // Safari-compatible SMS URL handling
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const cleanPhone = phone.replace(/[^\d+]/g, '');
        let smsUrl;
        if (isSafari) {
            smsUrl = `sms:${cleanPhone}&body=${encodedText}`;
        } else {
            smsUrl = `sms:${cleanPhone}?body=${encodedText}`;
        }
        window.open(smsUrl, '_blank');
    }
    
    closeBillLinkModal();
}

/**
 * Show sale complete modal with sharing options
 */
function showSaleCompleteModal(billLink) {
    const total = document.getElementById('bill-total-amount').textContent;
    
    let completeModal = document.getElementById('sale-complete-modal');
    if (!completeModal) {
        completeModal = document.createElement('div');
        completeModal.id = 'sale-complete-modal';
        completeModal.className = 'modal';
        completeModal.innerHTML = `
            <div class="modal-content" style="max-width: 450px;">
                <div class="modal-header">
                    <h3>✅ Sale Completed!</h3>
                    <button class="close-btn" onclick="closeSaleCompleteModal()">×</button>
                </div>
                <div class="modal-body">
                    <p style="text-align: center; font-size: 1.2rem; margin-bottom: 20px;">
                        Total: <strong>₹${total}</strong>
                    </p>
                    <div style="text-align: center; margin-bottom: 20px;">
                        <p style="color: #666;">Send bill to customer via:</p>
                    </div>
                    <div class="share-options" style="display: grid; gap: 10px;">
                        <button class="btn btn-whatsapp" onclick="shareBillFromComplete('whatsapp')" style="width: 100%;">
                            📱 Share on WhatsApp
                        </button>
                        <button class="btn btn-sms" onclick="shareBillFromComplete('sms')" style="width: 100%;">
                            💬 Send via SMS
                        </button>
                        <button class="btn btn-secondary" onclick="shareBillFromComplete('copy')" style="width: 100%;">
                            📋 Copy Bill Link
                        </button>
                        <button class="btn btn-info" onclick="shareBillFromComplete('print')" style="width: 100%;">
                            🖨️ Print Bill
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(completeModal);
    }
    
    completeModal.classList.add('active');
}

/**
 * Close sale complete modal
 */
function closeSaleCompleteModal() {
    const modal = document.getElementById('sale-complete-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Share bill via Email
function shareViaEmail(link) {
    const total = document.getElementById('bill-total-amount').textContent;
    const settings = getShopSettings();
    
    if (!currentCustomer.email) {
        showToast('Please enter customer email address', 'warning');
        return;
    }
    
    const subject = encodeURIComponent(`Bill from ${settings.shopName} - ₹${total}`);
    const body = encodeURIComponent(`Dear ${currentCustomer.name || 'Customer'},\n\nYour bill of ₹${total} is ready.\n\nView your bill here: ${link}\n\nThank you for shopping with us!\n\n${settings.shopName}\n${settings.shopAddress || ''}`);
    
    window.open(`mailto:${currentCustomer.email}?subject=${subject}&body=${body}`, '_blank');
}

// Share bill via Telegram
function shareViaTelegram(link) {
    const total = document.getElementById('bill-total-amount').textContent;
    const message = `Your bill of ₹${total} is ready!\n\nView here: ${link}`;
    const encodedText = encodeURIComponent(message);
    
    window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodedText}`, '_blank');
}

// Share bill link via Email
function shareBillLinkEmail() {
    const link = document.getElementById('bill-link-input').value;
    if (!link) return;
    shareViaEmail(link);
    closeBillLinkModal();
}

// Share bill link via Telegram
function shareBillLinkTelegram() {
    const link = document.getElementById('bill-link-input').value;
    if (!link) return;
    shareViaTelegram(link);
    closeBillLinkModal();
}

// Generate PDF using print dialog
function generatePDF() {
    printBill();
    showToast('Use "Save as PDF" in print dialog', 'info');
}

// Update shareBillLinkDirect to handle email and telegram
function shareBillLinkDirect(platform) {
    const link = document.getElementById('bill-link-input').value;
    if (!link) return;
    
    const total = document.getElementById('bill-total-amount').textContent;
    const message = `Your bill of ₹${total} is ready!\nView here: ${link}`;
    const encodedText = encodeURIComponent(message);
    
    const phone = currentCustomer.phone || '';
    
    if (platform === 'whatsapp') {
        if (phone) {
            const cleanPhone = phone.replace(/\D/g, '');
            window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, '_blank');
        } else {
            window.open(`https://wa.me/?text=${encodedText}`, '_blank');
        }
    } else if (platform === 'sms') {
        if (!phone) {
            showToast('Please enter customer phone number', 'warning');
            return;
        }
        // Safari-compatible SMS URL handling
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const cleanPhone = phone.replace(/[^\d+]/g, '');
        let smsUrl;
        if (isSafari) {
            smsUrl = `sms:${cleanPhone}&body=${encodedText}`;
        } else {
            smsUrl = `sms:${cleanPhone}?body=${encodedText}`;
        }
        window.open(smsUrl, '_blank');
    } else if (platform === 'email') {
        shareViaEmail(link);
    } else if (platform === 'telegram') {
        shareViaTelegram(link);
    } else if (platform === 'pdf') {
        generatePDF();
    }
    
    closeBillLinkModal();
}

// Update shareBillFromComplete to handle new methods
function shareBillFromComplete(method) {
    const link = generateBillLink();
    if (!link) return;
    
    const total = document.getElementById('bill-total-amount').textContent;
    const message = `Your bill of ₹${total} is ready!\nView here: ${link}`;
    const encodedText = encodeURIComponent(message);
    const phone = currentCustomer.phone || '';
    
    switch (method) {
        case 'whatsapp':
            if (phone) {
                const cleanPhone = phone.replace(/\D/g, '');
                window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, '_blank');
            } else {
                window.open(`https://wa.me/?text=${encodedText}`, '_blank');
            }
            break;
        case 'sms':
            if (!phone) {
                showToast('Please enter customer phone number', 'warning');
                return;
            }
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            const cleanPhone = phone.replace(/[^\d+]/g, '');
            let smsUrl;
            if (isSafari) {
                smsUrl = `sms:${cleanPhone}&body=${encodedText}`;
            } else {
                smsUrl = `sms:${cleanPhone}?body=${encodedText}`;
            }
            window.open(smsUrl, '_blank');
            break;
        case 'email':
            shareViaEmail(link);
            break;
        case 'telegram':
            shareViaTelegram(link);
            break;
        case 'copy':
            navigator.clipboard.writeText(link).then(() => {
                showToast('Link copied!', 'success');
            }).catch(() => {
                const textArea = document.createElement('textarea');
                textArea.value = link;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showToast('Link copied!', 'success');
            });
            break;
        case 'print':
            printBill();
            break;
    }
    
    closeSaleCompleteModal();
}

/**
 * Share bill from the sale complete modal
 */
function shareBillFromComplete(method) {
    const link = generateBillLink();
    if (!link) return;
    
    const total = document.getElementById('bill-total-amount').textContent;
    const message = `Your bill of ₹${total} is ready!\nView here: ${link}`;
    const encodedText = encodeURIComponent(message);
    const phone = currentCustomer.phone || '';
    
    switch (method) {
        case 'whatsapp':
            if (phone) {
                const cleanPhone = phone.replace(/\D/g, '');
                window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, '_blank');
            } else {
                window.open(`https://wa.me/?text=${encodedText}`, '_blank');
            }
            break;
        case 'sms':
            if (!phone) {
                showToast('Please enter customer phone number', 'warning');
                return;
            }
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            const cleanPhone = phone.replace(/[^\d+]/g, '');
            let smsUrl;
            if (isSafari) {
                smsUrl = `sms:${cleanPhone}&body=${encodedText}`;
            } else {
                smsUrl = `sms:${cleanPhone}?body=${encodedText}`;
            }
            window.open(smsUrl, '_blank');
            break;
        case 'copy':
            navigator.clipboard.writeText(link).then(() => {
                showToast('Link copied!', 'success');
            }).catch(() => {
                const textArea = document.createElement('textarea');
                textArea.value = link;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showToast('Link copied!', 'success');
            });
            break;
        case 'print':
            printBill();
            break;
    }
    
    closeSaleCompleteModal();
}

