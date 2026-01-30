/**
 * Enhanced IndexedDB Database Manager for Shop Management System
 * Complete offline data storage and retrieval with advanced features
 */

const DB_NAME = 'ShopManagementDB';
const DB_VERSION = 2; // Incremented version for schema updates

// Store names
const STORES = {
    ITEMS: 'items',
    CATEGORIES: 'categories',
    SALES: 'sales',
    CUSTOMERS: 'customers',
    SUPPLIERS: 'suppliers',
    PURCHASES: 'purchases',
    EXPENSES: 'expenses',
    SETTINGS: 'settings'
};

let db = null;

/**
 * Initialize the database with all stores
 */
async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error('Database error:', event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('Database initialized successfully');
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const database = event.target.result;

            // ============ ITEMS STORE ============
            if (!database.objectStoreNames.contains(STORES.ITEMS)) {
                const itemsStore = database.createObjectStore(STORES.ITEMS, { 
                    keyPath: 'id', 
                    autoIncrement: true 
                });
                itemsStore.createIndex('name', 'name', { unique: false });
                itemsStore.createIndex('category', 'category', { unique: false });
                itemsStore.createIndex('quantity', 'quantity', { unique: false });
                itemsStore.createIndex('barcode', 'barcode', { unique: false });
                itemsStore.createIndex('supplier_id', 'supplier_id', { unique: false });
                itemsStore.createIndex('expiry_date', 'expiry_date', { unique: false });
                itemsStore.createIndex('cost_price', 'cost_price', { unique: false });
            }

            // ============ CATEGORIES STORE ============
            if (!database.objectStoreNames.contains(STORES.CATEGORIES)) {
                const categoriesStore = database.createObjectStore(STORES.CATEGORIES, { 
                    keyPath: 'id', 
                    autoIncrement: true 
                });
                categoriesStore.createIndex('name', 'name', { unique: true });
            }

            // ============ SALES STORE ============
            if (!database.objectStoreNames.contains(STORES.SALES)) {
                const salesStore = database.createObjectStore(STORES.SALES, { 
                    keyPath: 'id', 
                    autoIncrement: true 
                });
                salesStore.createIndex('date', 'date', { unique: false });
                salesStore.createIndex('itemId', 'itemId', { unique: false });
                salesStore.createIndex('transactionId', 'transactionId', { unique: false });
                salesStore.createIndex('customerId', 'customerId', { unique: false });
                salesStore.createIndex('paymentMethod', 'paymentMethod', { unique: false });
            }

            // ============ CUSTOMERS STORE ============
            if (!database.objectStoreNames.contains(STORES.CUSTOMERS)) {
                const customersStore = database.createObjectStore(STORES.CUSTOMERS, { 
                    keyPath: 'id', 
                    autoIncrement: true 
                });
                customersStore.createIndex('name', 'name', { unique: false });
                customersStore.createIndex('phone', 'phone', { unique: true });
                customersStore.createIndex('email', 'email', { unique: false });
                customersStore.createIndex('loyaltyPoints', 'loyaltyPoints', { unique: false });
            }

            // ============ SUPPLIERS STORE ============
            if (!database.objectStoreNames.contains(STORES.SUPPLIERS)) {
                const suppliersStore = database.createObjectStore(STORES.SUPPLIERS, { 
                    keyPath: 'id', 
                    autoIncrement: true 
                });
                suppliersStore.createIndex('name', 'name', { unique: false });
                suppliersStore.createIndex('phone', 'phone', { unique: false });
                suppliersStore.createIndex('email', 'email', { unique: false });
            }

            // ============ PURCHASES STORE ============
            if (!database.objectStoreNames.contains(STORES.PURCHASES)) {
                const purchasesStore = database.createObjectStore(STORES.PURCHASES, { 
                    keyPath: 'id', 
                    autoIncrement: true 
                });
                purchasesStore.createIndex('date', 'date', { unique: false });
                purchasesStore.createIndex('supplierId', 'supplierId', { unique: false });
                purchasesStore.createIndex('itemId', 'itemId', { unique: false });
            }

            // ============ EXPENSES STORE ============
            if (!database.objectStoreNames.contains(STORES.EXPENSES)) {
                const expensesStore = database.createObjectStore(STORES.EXPENSES, { 
                    keyPath: 'id', 
                    autoIncrement: true 
                });
                expensesStore.createIndex('date', 'date', { unique: false });
                expensesStore.createIndex('category', 'category', { unique: false });
            }

            // ============ SETTINGS STORE ============
            if (!database.objectStoreNames.contains(STORES.SETTINGS)) {
                database.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
            }
        };
    });
}

// ============ GENERIC OPERATIONS ============

/**
 * Generic add item function
 */
async function addItem(storeName, item) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(item);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Generic get all items function
 */
async function getAllItems(storeName) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Generic get single item by ID
 */
async function getItemById(storeName, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Generic update item function
 */
async function updateItem(storeName, item) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(item);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Generic delete item function
 */
async function deleteItem(storeName, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get items by index
 */
async function getItemsByIndex(storeName, indexName, value) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        const request = index.getAll(value);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get sales by date
 */
async function getSalesByDate(date) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.SALES], 'readonly');
        const store = transaction.objectStore(STORES.SALES);
        const index = store.index('date');
        
        const keyRange = IDBKeyRange.only(date);
        const request = index.getAll(keyRange);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Delete all items from a store
 */
async function clearStore(storeName) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}

// ============ CATEGORY OPERATIONS ============

async function addCategory(name, description = '') {
    const category = {
        name: name.trim(),
        description: description.trim(),
        createdAt: new Date().toISOString()
    };
    return addItem(STORES.CATEGORIES, category);
}

async function getAllCategories() {
    return getAllItems(STORES.CATEGORIES);
}

async function deleteCategory(id) {
    return deleteItem(STORES.CATEGORIES, id);
}

async function updateCategory(category) {
    return updateItem(STORES.CATEGORIES, category);
}

// ============ ITEM OPERATIONS ============

async function addItemProduct(data) {
    const item = {
        name: data.name.trim(),
        category: data.category.trim(),
        price: parseFloat(data.price),
        quantity: parseFloat(data.quantity) || 0,
        cost_price: parseFloat(data.cost_price) || 0,
        unit: data.unit || 'pieces',
        barcode: data.barcode || '',
        description: data.description || '',
        supplier_id: data.supplier_id || null,
        expiry_date: data.expiry_date || null,
        reorder_level: data.reorder_level || 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    return addItem(STORES.ITEMS, item);
}

async function getAllItemsProduct() {
    return getAllItems(STORES.ITEMS);
}

async function getItemByIdProduct(id) {
    return getItemById(STORES.ITEMS, id);
}

async function updateItemProduct(item) {
    item.updatedAt = new Date().toISOString();
    return updateItem(STORES.ITEMS, item);
}

async function deleteItemProduct(id) {
    return deleteItem(STORES.ITEMS, id);
}

async function getItemsByCategory(category) {
    return getItemsByIndex(STORES.ITEMS, 'category', category);
}

async function getLowStockItems(threshold = 10) {
    const items = await getAllItemsProduct();
    return items.filter(item => item.quantity <= (item.reorder_level || threshold));
}

async function getExpiringItems(days = 30) {
    const items = await getAllItemsProduct();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return items.filter(item => {
        if (!item.expiry_date) return false;
        const expiry = new Date(item.expiry_date);
        return expiry <= futureDate && expiry >= new Date();
    });
}

async function getItemsByBarcode(barcode) {
    return getItemsByIndex(STORES.ITEMS, 'barcode', barcode);
}

async function searchItems(query) {
    const items = await getAllItemsProduct();
    const searchTerm = query.toLowerCase();
    return items.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        (item.barcode && item.barcode.includes(searchTerm))
    );
}

async function updateItemQuantity(itemId, newQuantity) {
    const item = await getItemByIdProduct(itemId);
    if (item) {
        item.quantity = newQuantity;
        return updateItemProduct(item);
    }
    throw new Error('Item not found');
}

// ============ SALES OPERATIONS ============

function generateTransactionId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `TXN-${timestamp}-${random}`.toUpperCase();
}

function generateBillNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `BILL${year}${month}${day}${hours}${minutes}${random}`;
}

async function recordSale(data) {
    const sale = {
        itemId: data.itemId,
        itemName: data.itemName,
        quantitySold: parseFloat(data.quantitySold),
        unit: data.unit,
        pricePerUnit: parseFloat(data.pricePerUnit),
        costPrice: parseFloat(data.costPrice || 0),
        totalPrice: parseFloat(data.totalPrice),
        profit: parseFloat(data.totalPrice) - (parseFloat(data.costPrice || 0) * parseFloat(data.quantitySold)),
        customerId: data.customerId || null,
        customerName: data.customerName || '',
        customerPhone: data.customerPhone || '',
        paymentMethod: data.paymentMethod || 'Cash',
        discount: data.discount || 0,
        discountType: data.discountType || 'none',
        tax: data.tax || 0,
        taxRate: data.taxRate || 0,
        transactionId: data.transactionId || generateTransactionId(),
        billNumber: data.billNumber || generateBillNumber(),
        date: data.date,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date().toISOString()
    };
    return addItem(STORES.SALES, sale);
}

async function getAllSales() {
    return getAllItems(STORES.SALES);
}

async function getTodaySales() {
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local timezone
    return getSalesByDate(today);
}

async function getSalesBySpecificDate(dateString) {
    return getSalesByDate(dateString);
}

async function getSalesByDateRange(startDate, endDate) {
    const allSales = await getAllSales();
    return allSales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
    });
}

async function calculateTotalSales(dateString) {
    const sales = await getSalesBySpecificDate(dateString);
    return sales.reduce((total, sale) => total + sale.totalPrice, 0);
}

async function calculateTotalProfit(dateString) {
    const sales = await getSalesBySpecificDate(dateString);
    return sales.reduce((total, sale) => total + (sale.profit || 0), 0);
}

async function getTotalItemsSold(dateString) {
    const sales = await getSalesBySpecificDate(dateString);
    return sales.reduce((total, sale) => total + sale.quantitySold, 0);
}

async function getSalesByTransactionId(transactionId) {
    return getItemsByIndex(STORES.SALES, 'transactionId', transactionId);
}

async function getSalesByCustomer(customerId) {
    return getItemsByIndex(STORES.SALES, 'customerId', customerId);
}

// ============ CUSTOMER OPERATIONS ============

async function addCustomer(data) {
    const customer = {
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email || '',
        address: data.address || '',
        loyaltyPoints: 0,
        totalPurchases: 0,
        totalSpent: 0,
        notes: data.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    return addItem(STORES.CUSTOMERS, customer);
}

async function getAllCustomers() {
    return getAllItems(STORES.CUSTOMERS);
}

async function getCustomerById(id) {
    return getItemById(STORES.CUSTOMERS, id);
}

async function getCustomerByPhone(phone) {
    const customers = await getItemsByIndex(STORES.CUSTOMERS, 'phone', phone);
    return customers.length > 0 ? customers[0] : null;
}

async function updateCustomer(customer) {
    customer.updatedAt = new Date().toISOString();
    return updateItem(STORES.CUSTOMERS, customer);
}

async function deleteCustomer(id) {
    return deleteItem(STORES.CUSTOMERS, id);
}

async function addLoyaltyPoints(customerId, amount) {
    const customer = await getCustomerById(customerId);
    if (customer) {
        // 1 point for every ₹10 spent
        const points = Math.floor(amount / 10);
        customer.loyaltyPoints += points;
        customer.totalPurchases += 1;
        customer.totalSpent += amount;
        return updateCustomer(customer);
    }
    throw new Error('Customer not found');
}

async function getTopCustomers(limit = 10) {
    const customers = await getAllCustomers();
    return customers.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, limit);
}

// ============ SUPPLIER OPERATIONS ============

async function addSupplier(data) {
    const supplier = {
        name: data.name.trim(),
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        contactPerson: data.contactPerson || '',
        notes: data.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    return addItem(STORES.SUPPLIERS, supplier);
}

async function getAllSuppliers() {
    return getAllItems(STORES.SUPPLIERS);
}

async function getSupplierById(id) {
    return getItemById(STORES.SUPPLIERS, id);
}

async function updateSupplier(supplier) {
    supplier.updatedAt = new Date().toISOString();
    return updateItem(STORES.SUPPLIERS, supplier);
}

async function deleteSupplier(id) {
    return deleteItem(STORES.SUPPLIERS, id);
}

// ============ PURCHASE OPERATIONS ============

async function addPurchase(data) {
    const purchase = {
        itemId: data.itemId,
        supplierId: data.supplierId || null,
        quantity: parseFloat(data.quantity),
        unit: data.unit,
        costPrice: parseFloat(data.costPrice),
        totalAmount: parseFloat(data.quantity) * parseFloat(data.costPrice),
        date: data.date,
        invoiceNumber: data.invoiceNumber || '',
        notes: data.notes || '',
        createdAt: new Date().toISOString()
    };
    return addItem(STORES.PURCHASES, purchase);
}

async function getAllPurchases() {
    return getAllItems(STORES.PURCHASES);
}

async function getPurchasesByDate(date) {
    return getItemsByIndex(STORES.PURCHASES, 'date', date);
}

async function getPurchasesBySupplier(supplierId) {
    return getItemsByIndex(STORES.PURCHASES, 'supplierId', supplierId);
}

// ============ EXPENSE OPERATIONS ============

async function addExpense(data) {
    const expense = {
        category: data.category.trim(),
        amount: parseFloat(data.amount),
        description: data.description || '',
        date: data.date,
        createdAt: new Date().toISOString()
    };
    return addItem(STORES.EXPENSES, expense);
}

async function getAllExpenses() {
    return getAllItems(STORES.EXPENSES);
}

async function getExpensesByDate(date) {
    return getItemsByIndex(STORES.EXPENSES, 'date', date);
}

async function getExpensesByCategory(category) {
    return getItemsByIndex(STORES.EXPENSES, 'category', category);
}

async function getExpensesByDateRange(startDate, endDate) {
    const allExpenses = await getAllExpenses();
    return allExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
    });
}

// ============ SETTINGS OPERATIONS ============

async function saveSetting(key, value) {
    const setting = { key, value: JSON.stringify(value), updatedAt: new Date().toISOString() };
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.SETTINGS], 'readwrite');
        const store = transaction.objectStore(STORES.SETTINGS);
        const request = store.put(setting);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}

async function getSetting(key, defaultValue = null) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.SETTINGS], 'readonly');
        const store = transaction.objectStore(STORES.SETTINGS);
        const request = store.get(key);
        
        request.onsuccess = () => {
            if (request.result) {
                try {
                    resolve(JSON.parse(request.result.value));
                } catch (e) {
                    resolve(request.result.value);
                }
            } else {
                resolve(defaultValue);
            }
        };
        request.onerror = () => reject(defaultValue);
    });
}

// ============ DASHBOARD STATISTICS ============

async function getDashboardStats() {
    const [items, categories, todaySales, customers, suppliers] = await Promise.all([
        getAllItemsProduct(),
        getAllCategories(),
        getTodaySales(),
        getAllCustomers(),
        getAllSuppliers()
    ]);

    const todayTotal = todaySales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const todayProfit = todaySales.reduce((sum, sale) => sum + (sale.profit || 0), 0);
    const lowStockItems = items.filter(item => item.quantity <= (item.reorder_level || 10));
    const expiringItems = await getExpiringItems(30);

    // Calculate monthly stats
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthSales = await getSalesByDateRange(
        monthStart.toISOString().split('T')[0],
        now.toISOString().split('T')[0]
    );
    const monthTotal = monthSales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const monthProfit = monthSales.reduce((sum, sale) => sum + (sale.profit || 0), 0);

    return {
        totalItems: items.length,
        totalCategories: categories.length,
        totalCustomers: customers.length,
        totalSuppliers: suppliers.length,
        todaySales: todayTotal,
        todayProfit: todayProfit,
        todayTransactions: [...new Set(todaySales.map(s => s.transactionId))].length,
        monthSales: monthTotal,
        monthProfit: monthProfit,
        lowStockCount: lowStockItems.length,
        lowStockItems: lowStockItems,
        expiringItems: expiringItems,
        todaySalesList: todaySales
    };
}

// ============ REPORTS ============

async function getSalesReport(startDate, endDate) {
    const sales = await getSalesByDateRange(startDate, endDate);
    
    // Group by transaction
    const transactions = {};
    sales.forEach(sale => {
        if (!transactions[sale.transactionId]) {
            transactions[sale.transactionId] = {
                transactionId: sale.transactionId,
                billNumber: sale.billNumber,
                customerName: sale.customerName,
                customerPhone: sale.customerPhone,
                paymentMethod: sale.paymentMethod,
                date: sale.date,
                time: sale.time,
                items: [],
                subtotal: 0,
                discount: 0,
                tax: 0,
                total: 0,
                profit: 0
            };
        }
        transactions[sale.transactionId].items.push({
            name: sale.itemName,
            quantity: sale.quantitySold,
            unit: sale.unit,
            price: sale.pricePerUnit,
            total: sale.totalPrice
        });
        transactions[sale.transactionId].subtotal += sale.totalPrice;
        transactions[sale.transactionId].discount += sale.discount || 0;
        transactions[sale.transactionId].tax += sale.tax || 0;
        transactions[sale.transactionId].total += sale.totalPrice;
        transactions[sale.transactionId].profit += sale.profit || 0;
    });

    return {
        transactions: Object.values(transactions),
        totalSales: sales.reduce((sum, s) => sum + s.totalPrice, 0),
        totalProfit: sales.reduce((sum, s) => sum + (s.profit || 0), 0),
        totalTransactions: Object.keys(transactions).length,
        totalItems: sales.reduce((sum, s) => sum + s.quantitySold, 0)
    };
}

async function getInventoryReport() {
    const items = await getAllItemsProduct();
    const categories = await getAllCategories();
    
    const categoryStats = {};
    categories.forEach(cat => {
        categoryStats[cat.name] = { count: 0, quantity: 0, value: 0 };
    });
    
    items.forEach(item => {
        if (!categoryStats[item.category]) {
            categoryStats[item.category] = { count: 0, quantity: 0, value: 0 };
        }
        categoryStats[item.category].count++;
        categoryStats[item.category].quantity += item.quantity;
        categoryStats[item.category].value += item.quantity * item.price;
    });
    
    return {
        items: items,
        categories: categories,
        categoryStats: categoryStats,
        totalValue: items.reduce((sum, i) => sum + (i.quantity * i.price), 0),
        totalCost: items.reduce((sum, i) => sum + (i.quantity * (i.cost_price || 0)), 0),
        lowStock: items.filter(i => i.quantity <= (i.reorder_level || 10)),
        outOfStock: items.filter(i => i.quantity === 0)
    };
}

// ============ DATA EXPORT/IMPORT ============

async function exportAllData() {
    const data = {};
    
    for (const storeName of Object.values(STORES)) {
        data[storeName] = await getAllItems(storeName);
    }
    
    // Add export timestamp
    data._exportedAt = new Date().toISOString();
    data._version = DB_VERSION;
    
    return data;
}

async function importData(data, clearExisting = false) {
    if (clearExisting) {
        for (const storeName of Object.values(STORES)) {
            if (storeName !== STORES.SETTINGS) {
                await clearStore(storeName);
            }
        }
    }
    
    // Import each store (skip metadata keys)
    for (const storeName of Object.values(STORES)) {
        if (data[storeName] && Array.isArray(data[storeName])) {
            for (const item of data[storeName]) {
                // Remove auto-generated IDs to allow new ones
                const { id, createdAt, updatedAt, ...importItem } = item;
                await addItem(storeName, importItem);
            }
        }
    }
    
    return true;
}

// ============ INITIALIZATION ============

async function initializeDatabase() {
    try {
        console.log('Starting database initialization...');
        const database = await initDB();
        console.log('Database object received:', !!database);
        
        // Check if db global variable is set
        console.log('Global db variable set:', !!db);
        
        // Add default categories if none exist
        console.log('Checking for existing categories...');
        const categories = await getAllCategories();
        console.log('Existing categories count:', categories.length);
        
        if (categories.length === 0) {
            console.log('Adding default categories...');
            const defaultCategories = [
                'Grocery',
                'Vegetables',
                'Fruits',
                'Dairy',
                'Bakery',
                'Beverages',
                'Snacks',
                'Stationery',
                'Medical',
                'Household',
                'Electronics',
                'Clothing',
                'Other'
            ];
            
            for (const cat of defaultCategories) {
                await addCategory(cat);
            }
            console.log('Default categories added');
        }
        
        // Add default expense categories
        const settings = await getSetting('expenseCategories');
        if (!settings) {
            await saveSetting('expenseCategories', [
                'Rent',
                'Electricity',
                'Water',
                'Salaries',
                'Transportation',
                'Maintenance',
                'Marketing',
                'Other'
            ]);
        }
        
        console.log('Database initialization completed successfully');
        return true;
    } catch (error) {
        console.error('Database initialization failed:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        return false;
    }
}

// ============ EXPORT FOR USE ============

window.dbManager = {
    // Core
    initializeDatabase,
    
    // Categories
    addCategory,
    getAllCategories,
    deleteCategory,
    updateCategory,
    
    // Items
    addItemProduct,
    getAllItemsProduct,
    getItemByIdProduct,
    updateItemProduct,
    deleteItemProduct,
    getItemsByCategory,
    getLowStockItems,
    getExpiringItems,
    getItemsByBarcode,
    searchItems,
    updateItemQuantity,
    
    // Sales
    recordSale,
    getAllSales,
    getTodaySales,
    getSalesBySpecificDate,
    getSalesByDateRange,
    getSalesByTransactionId,
    getSalesByCustomer,
    calculateTotalSales,
    calculateTotalProfit,
    getTotalItemsSold,
    generateTransactionId,
    generateBillNumber,
    
    // Customers
    addCustomer,
    getAllCustomers,
    getCustomerById,
    getCustomerByPhone,
    updateCustomer,
    deleteCustomer,
    addLoyaltyPoints,
    getTopCustomers,
    
    // Suppliers
    addSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
    
    // Purchases
    addPurchase,
    getAllPurchases,
    getPurchasesByDate,
    getPurchasesBySupplier,
    
    // Expenses
    addExpense,
    getAllExpenses,
    getExpensesByDate,
    getExpensesByCategory,
    getExpensesByDateRange,
    
    // Settings
    saveSetting,
    getSetting,
    
    // Reports & Analytics
    getDashboardStats,
    getSalesReport,
    getInventoryReport,
    
    // Data Management
    exportAllData,
    importData,
    clearStore
};

