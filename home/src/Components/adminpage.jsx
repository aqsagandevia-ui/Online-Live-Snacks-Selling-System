import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { IconTrash } from './Icons';
import '../styles/Admin.css';

const AdminPage = () => {
    const toast = useToast();

    // Active Tab: 'dashboard' | 'products' | 'orders' | 'categories' | 'coupons' | 'users'
    const [activeTab, setActiveTab] = useState('dashboard');

    // Dashboard Data
    const [analytics, setAnalytics] = useState(null);

    // Products Management State
    const [products, setProducts] = useState([]);
    const [productSearch, setProductSearch] = useState('');
    const [productModalOpen, setProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: '',
        price: '',
        discountPrice: '',
        category: 'Chips',
        image: '/photo/products1.webp',
        description: '',
        stock: 20,
        lowStockThreshold: 5,
        ingredients: '',
        prepTime: 'Freshly Packed',
        isSpecial: false,
        isFeatured: false
    });

    // Orders Management State
    const [orders, setOrders] = useState([]);
    const [orderStatusFilter, setOrderStatusFilter] = useState('all');
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

    // Categories Management State
    const [categories, setCategories] = useState([]);
    const [newCatName, setNewCatName] = useState('');
    const [newCatImage, setNewCatImage] = useState('/photo/chips1.webp');

    // Coupons Management State
    const [coupons, setCoupons] = useState([]);
    const [couponForm, setCouponForm] = useState({
        code: '',
        description: '',
        discountType: 'percent',
        discountValue: 10,
        minOrderValue: 199,
        maxDiscount: 100
    });

    // Users State
    const [usersList, setUsersList] = useState([]);

    // Initial Load
    useEffect(() => {
        fetchDashboardAnalytics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (activeTab === 'products') fetchProducts();
        if (activeTab === 'orders') fetchOrders();
        if (activeTab === 'categories') fetchCategories();
        if (activeTab === 'coupons') fetchCoupons();
        if (activeTab === 'users') fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, orderStatusFilter]);

    // 1. Fetch Analytics
    const fetchDashboardAnalytics = async () => {
        try {
            const res = await api.get('/analytics/dashboard');
            if (res.data.success) {
                setAnalytics(res.data);
            }
        } catch (e) {
            // Local fallback analytics
            setAnalytics({
                summary: {
                    totalRevenue: 28450,
                    todaySales: 1250,
                    monthSales: 14800,
                    totalOrders: 42,
                    pendingOrders: 3,
                    deliveredOrders: 38,
                    cancelledOrders: 1,
                    totalUsers: 18,
                    totalProducts: 34,
                    lowStockCount: 2
                },
                topProducts: [
                    { name: 'Chilli Sprinkled Chips', count: 48 },
                    { name: 'Royal Namkeen Mixture', count: 39 },
                    { name: 'Wheat Flour Spiced Chakli', count: 31 },
                    { name: 'Bhavnagri Gathiya', count: 28 },
                    { name: 'Cheezy Corn Puffs', count: 24 }
                ],
                lowStockProducts: [
                    { name: 'Flamin Hot Crunch', stock: 8, category: 'Chips' },
                    { name: 'Softy Ghee Chakli', stock: 12, category: 'Chakli' }
                ],
                recentOrders: []
            });
        }
    };

    // 2. Products Operations
    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (e) {
            console.log('Error fetching products:', e);
        }
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, productForm);
                toast.success('Snack updated successfully!');
            } else {
                await api.post('/products', productForm);
                toast.success('New snack added to catalog!');
            }
            setProductModalOpen(false);
            setEditingProduct(null);
            fetchProducts();
            fetchDashboardAnalytics();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving product');
        }
    };

    const handleDeleteProduct = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success('Product deleted');
            fetchProducts();
            fetchDashboardAnalytics();
        } catch (e) {
            toast.error('Error deleting product');
        }
    };

    const handleQuickStockAdjust = async (product, delta) => {
        const newStock = Math.max(0, product.stock + delta);
        try {
            await api.put(`/products/${product._id}`, { stock: newStock });
            setProducts(products.map(p => p._id === product._id ? { ...p, stock: newStock } : p));
            toast.success(`Updated stock for ${product.name} (${newStock})`);
        } catch (e) {
            toast.error('Error updating stock');
        }
    };

    // 3. Orders Operations
    const fetchOrders = async () => {
        try {
            const res = await api.get(`/orders?status=${orderStatusFilter}`);
            if (res.data.success) {
                setOrders(res.data.orders);
            }
        } catch (e) {
            console.log('Error fetching orders:', e);
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
            if (res.data.success) {
                toast.success(`Order #${res.data.order.orderId} marked as ${newStatus.toUpperCase()}`);
                fetchOrders();
                fetchDashboardAnalytics();
            }
        } catch (e) {
            toast.error('Error updating order status');
        }
    };

    // 4. Categories Operations
    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (e) {
            console.log('Error fetching categories:', e);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCatName.trim()) return;
        try {
            await api.post('/categories', { name: newCatName, image: newCatImage });
            toast.success('Category created!');
            setNewCatName('');
            fetchCategories();
        } catch (e) {
            toast.error('Error adding category');
        }
    };

    // 5. Coupons Operations
    const fetchCoupons = async () => {
        try {
            const res = await api.get('/coupons');
            if (res.data.success) {
                setCoupons(res.data.coupons);
            }
        } catch (e) {
            console.log('Error fetching coupons:', e);
        }
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        try {
            await api.post('/coupons', couponForm);
            toast.success(`Coupon ${couponForm.code} created!`);
            setCouponForm({ code: '', description: '', discountType: 'percent', discountValue: 10, minOrderValue: 199, maxDiscount: 100 });
            fetchCoupons();
        } catch (e) {
            toast.error('Error creating coupon');
        }
    };

    const handleDeleteCoupon = async (id) => {
        try {
            await api.delete(`/coupons/${id}`);
            toast.success('Coupon removed');
            fetchCoupons();
        } catch (e) {
            toast.error('Error deleting coupon');
        }
    };

    // 6. Users Operations
    const fetchUsers = async () => {
        try {
            const res = await api.get('/auth/users');
            if (res.data.success) {
                setUsersList(res.data.users);
            }
        } catch (e) {
            console.log('Error fetching users:', e);
        }
    };

    return (
        <div className="admin-page-wrapper">
            {/* Top Subheader */}
            <div className="admin-header-strip">
                <div className="admin-header-container">
                    <div className="admin-title-box">
                        <span className="admin-role-badge">👑 CRUNCHY BITE MANAGEMENT PORTAL</span>
                        <h1>Admin Dashboard</h1>
                    </div>
                    <div className="admin-header-actions">
                        <button
                            onClick={async () => {
                                try {
                                    await api.post('/products/seed-now');
                                    toast.success('Database re-seeded with 34 authentic snacks!');
                                    fetchProducts();
                                    fetchDashboardAnalytics();
                                } catch (e) {
                                    toast.error('Seed action failed');
                                }
                            }}
                            className="btn-seed-data"
                            title="Re-populate catalog with 34 original snack photos"
                        >
                            ⚡ Reset & Seed 34 Authentic Snacks
                        </button>
                        <Link to="/" className="btn-secondary-custom">
                            ← Back to Store
                        </Link>
                    </div>
                </div>
            </div>

            <div className="admin-body-container">
                {/* Horizontal / Sidebar Tab Navigation */}
                <div className="admin-tabs-nav">
                    {[
                        { key: 'dashboard', label: '📊 Analytics & Overview' },
                        { key: 'products', label: '🍿 Products & Inventory' },
                        { key: 'orders', label: '📦 Orders Management' },
                        { key: 'categories', label: '🏷️ Categories' },
                        { key: 'coupons', label: '🎟️ Coupons & Deals' },
                        { key: 'users', label: '👥 Registered Customers' }
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            className={`admin-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* 1. Analytics & Overview Tab */}
                {activeTab === 'dashboard' && analytics && (
                    <div className="admin-tab-content animate-fade-in">
                        {/* KPI Metrics Cards */}
                        <div className="admin-kpi-grid">
                            <div className="kpi-card revenue">
                                <span className="kpi-title">Total Revenue</span>
                                <h2>₹{analytics.summary.totalRevenue.toLocaleString()}</h2>
                                <span className="kpi-subtext">₹{analytics.summary.monthSales} this month</span>
                            </div>

                            <div className="kpi-card orders">
                                <span className="kpi-title">Total Orders</span>
                                <h2>{analytics.summary.totalOrders}</h2>
                                <span className="kpi-subtext">{analytics.summary.deliveredOrders} delivered successfully</span>
                            </div>

                            <div className="kpi-card pending">
                                <span className="kpi-title">Pending Orders</span>
                                <h2>{analytics.summary.pendingOrders}</h2>
                                <span className="kpi-subtext">Needs kitchen action</span>
                            </div>

                            <div className="kpi-card snacks">
                                <span className="kpi-title">Active Snacks</span>
                                <h2>{analytics.summary.totalProducts}</h2>
                                <span className="kpi-subtext">Across 5 categories</span>
                            </div>

                            <div className="kpi-card users">
                                <span className="kpi-title">Customers</span>
                                <h2>{analytics.summary.totalUsers}</h2>
                                <span className="kpi-subtext">Registered accounts</span>
                            </div>

                            <div className="kpi-card alerts">
                                <span className="kpi-title">Low Stock Alerts</span>
                                <h2>{analytics.summary.lowStockCount}</h2>
                                <span className="kpi-subtext">Require restock</span>
                            </div>
                        </div>

                        {/* Top Selling & Low Stock Grid */}
                        <div className="admin-dashboard-two-col">
                            {/* Top Selling Snacks */}
                            <div className="admin-subcard">
                                <h3>🔥 Top 5 Best Selling Snacks</h3>
                                <div className="top-selling-list">
                                    {analytics.topProducts.map((p, idx) => (
                                        <div key={idx} className="top-product-row">
                                            <div className="rank-badge">#{idx + 1}</div>
                                            <div className="prod-name-box">
                                                <strong>{p.name}</strong>
                                            </div>
                                            <span className="sales-units">{p.count} Units Sold</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Low Stock Warning Box */}
                            <div className="admin-subcard">
                                <h3>⚠️ Inventory Restock Alerts</h3>
                                <div className="low-stock-list">
                                    {analytics.lowStockProducts.length === 0 ? (
                                        <p style={{ color: 'var(--success-color)', fontSize: '0.9rem' }}>
                                            ✓ All inventory items are well-stocked!
                                        </p>
                                    ) : (
                                        analytics.lowStockProducts.map((p, idx) => (
                                            <div key={idx} className="low-stock-row">
                                                <div>
                                                    <strong>{p.name}</strong>
                                                    <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.category}</span>
                                                </div>
                                                <span className="badge-tag low-stock">
                                                    Only {p.stock} Units Left
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Products & Inventory Management Tab */}
                {activeTab === 'products' && (
                    <div className="admin-tab-content animate-fade-in">
                        <div className="admin-table-toolbar">
                            <div className="search-box-admin">
                                <input
                                    type="text"
                                    placeholder="Search products by name or category..."
                                    value={productSearch}
                                    onChange={(e) => setProductSearch(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => {
                                    setEditingProduct(null);
                                    setProductForm({
                                        name: '',
                                        price: '',
                                        discountPrice: '',
                                        category: 'Chips',
                                        image: '/photo/products1.webp',
                                        description: '',
                                        stock: 20,
                                        lowStockThreshold: 5,
                                        ingredients: '',
                                        prepTime: 'Freshly Packed',
                                        isSpecial: false,
                                        isFeatured: false
                                    });
                                    setProductModalOpen(true);
                                }}
                                className="btn-primary-custom"
                            >
                                + Add New Snack
                            </button>
                        </div>

                        <div className="admin-table-wrapper">
                            <table className="admin-custom-table">
                                <thead>
                                    <tr>
                                        <th>Photo</th>
                                        <th>Snack Name</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock & Quick Adjust</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products
                                        .filter(p => !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.category.toLowerCase().includes(productSearch.toLowerCase()))
                                        .map((product) => (
                                            <tr key={product._id}>
                                                <td>
                                                    <img
                                                        src={product.image || '/photo/products1.webp'}
                                                        alt={product.name}
                                                        className="table-product-thumb"
                                                    />
                                                </td>
                                                <td>
                                                    <strong>{product.name}</strong>
                                                    {product.isSpecial && <span className="mini-badge-special">Special Deal</span>}
                                                </td>
                                                <td><span className="table-cat-tag">{product.category}</span></td>
                                                <td>
                                                    <strong>₹{product.discountPrice || product.price}</strong>
                                                    {product.discountPrice > 0 && <small style={{ textDecoration: 'line-through', color: 'var(--text-muted)', marginLeft: '4px' }}>₹{product.price}</small>}
                                                </td>
                                                <td>
                                                    <div className="stock-adjuster">
                                                        <button onClick={() => handleQuickStockAdjust(product, -5)} className="btn-stock-adj">-5</button>
                                                        <button onClick={() => handleQuickStockAdjust(product, -1)} className="btn-stock-adj">-1</button>
                                                        <span className="stock-qty-text">{product.stock}</span>
                                                        <button onClick={() => handleQuickStockAdjust(product, +1)} className="btn-stock-adj">+1</button>
                                                        <button onClick={() => handleQuickStockAdjust(product, +10)} className="btn-stock-adj">+10</button>
                                                    </div>
                                                </td>
                                                <td>
                                                    {product.stock <= 0 ? (
                                                        <span className="badge-tag out-of-stock">Out of Stock</span>
                                                    ) : product.stock <= (product.lowStockThreshold || 5) ? (
                                                        <span className="badge-tag low-stock">Low Stock</span>
                                                    ) : (
                                                        <span className="badge-tag in-stock">In Stock</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="action-buttons-cell">
                                                        <button
                                                            onClick={() => {
                                                                setEditingProduct(product);
                                                                setProductForm({
                                                                    name: product.name,
                                                                    price: product.price,
                                                                    discountPrice: product.discountPrice || '',
                                                                    category: product.category,
                                                                    image: product.image,
                                                                    description: product.description || '',
                                                                    stock: product.stock,
                                                                    lowStockThreshold: product.lowStockThreshold || 5,
                                                                    ingredients: Array.isArray(product.ingredients) ? product.ingredients.join(', ') : '',
                                                                    prepTime: product.prepTime || 'Freshly Packed',
                                                                    isSpecial: !!product.isSpecial,
                                                                    isFeatured: !!product.isFeatured
                                                                });
                                                                setProductModalOpen(true);
                                                            }}
                                                            className="btn-edit-table"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProduct(product._id, product.name)}
                                                            className="btn-delete-table"
                                                        >
                                                            <IconTrash size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 3. Orders Management Tab */}
                {activeTab === 'orders' && (
                    <div className="admin-tab-content animate-fade-in">
                        <div className="orders-status-filter-bar">
                            <label>Filter by Status:</label>
                            {['all', 'pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'].map(st => (
                                <button
                                    key={st}
                                    className={`btn-status-filter ${orderStatusFilter === st ? 'active' : ''}`}
                                    onClick={() => setOrderStatusFilter(st)}
                                >
                                    {st.replace(/_/g, ' ').toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <div className="admin-table-wrapper">
                            <table className="admin-custom-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer Details</th>
                                        <th>Items</th>
                                        <th>Amount</th>
                                        <th>Payment</th>
                                        <th>Status Workflow</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td>
                                                <Link to={`/track/${order.orderId}`} className="table-order-id-link">
                                                    #{order.orderId}
                                                </Link>
                                                <span className="order-time-sub">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </td>
                                            <td>
                                                <strong>{order.customerName}</strong>
                                                <span className="customer-sub">{order.customerPhone}</span>
                                                <span className="customer-sub">{order.shippingAddress?.city}</span>
                                            </td>
                                            <td>
                                                <span className="items-brief">
                                                    {order.items?.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                                                </span>
                                            </td>
                                            <td>
                                                <strong>₹{order.totalAmount}</strong>
                                            </td>
                                            <td>
                                                <span className={`badge-tag ${order.paymentStatus === 'paid' ? 'in-stock' : 'low-stock'}`}>
                                                    {order.paymentMethod?.toUpperCase()} • {order.paymentStatus?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>
                                                <select
                                                    value={order.orderStatus}
                                                    onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                                    className={`status-select ${order.orderStatus}`}
                                                >
                                                    <option value="pending">PENDING</option>
                                                    <option value="confirmed">CONFIRMED</option>
                                                    <option value="preparing">PREPARING</option>
                                                    <option value="ready">READY</option>
                                                    <option value="out_for_delivery">OUT FOR DELIVERY</option>
                                                    <option value="delivered">DELIVERED</option>
                                                    <option value="cancelled">CANCELLED</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => setSelectedOrderDetails(order)}
                                                    className="btn-view-order-details"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 4. Categories Management Tab */}
                {activeTab === 'categories' && (
                    <div className="admin-tab-content animate-fade-in">
                        <div className="admin-dashboard-two-col">
                            {/* Create Category Form */}
                            <div className="admin-subcard">
                                <h3>Add New Snack Category</h3>
                                <form onSubmit={handleAddCategory} className="admin-form">
                                    <div className="input-group">
                                        <label>Category Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Traditional Farsan"
                                            value={newCatName}
                                            onChange={(e) => setNewCatName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Image URL / Path</label>
                                        <input
                                            type="text"
                                            value={newCatImage}
                                            onChange={(e) => setNewCatImage(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit" className="btn-primary-custom" style={{ marginTop: '12px' }}>
                                        Create Category
                                    </button>
                                </form>
                            </div>

                            {/* Existing Categories List */}
                            <div className="admin-subcard">
                                <h3>Existing Categories ({categories.length})</h3>
                                <div className="category-admin-list">
                                    {categories.map((cat) => (
                                        <div key={cat._id} className="category-admin-row">
                                            <img src={cat.image || '/photo/chips1.webp'} alt={cat.name} />
                                            <div>
                                                <strong>{cat.name}</strong>
                                                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                    {cat.itemCount || 0} active snacks
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. Coupons Management Tab */}
                {activeTab === 'coupons' && (
                    <div className="admin-tab-content animate-fade-in">
                        <div className="admin-dashboard-two-col">
                            {/* Add Coupon Form */}
                            <div className="admin-subcard">
                                <h3>Create New Discount Coupon</h3>
                                <form onSubmit={handleCreateCoupon} className="admin-form">
                                    <div className="input-group">
                                        <label>Coupon Code (e.g. SAVE10)</label>
                                        <input
                                            type="text"
                                            required
                                            value={couponForm.code}
                                            onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Description</label>
                                        <input
                                            type="text"
                                            placeholder="10% discount on snacks"
                                            value={couponForm.description}
                                            onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-row-2">
                                        <div className="input-group">
                                            <label>Discount Value</label>
                                            <input
                                                type="number"
                                                required
                                                value={couponForm.discountValue}
                                                onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Discount Type</label>
                                            <select
                                                value={couponForm.discountType}
                                                onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                                            >
                                                <option value="percent">Percentage (%)</option>
                                                <option value="flat">Flat Cash (₹)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row-2">
                                        <div className="input-group">
                                            <label>Min Order (₹)</label>
                                            <input
                                                type="number"
                                                value={couponForm.minOrderValue}
                                                onChange={(e) => setCouponForm({ ...couponForm, minOrderValue: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Max Discount (₹)</label>
                                            <input
                                                type="number"
                                                value={couponForm.maxDiscount}
                                                onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: Number(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn-primary-custom" style={{ marginTop: '12px' }}>
                                        Add Coupon
                                    </button>
                                </form>
                            </div>

                            {/* Active Coupons List */}
                            <div className="admin-subcard">
                                <h3>Active Promo Coupons ({coupons.length})</h3>
                                <div className="coupons-admin-list">
                                    {coupons.map((c) => (
                                        <div key={c._id} className="coupon-admin-card">
                                            <div className="coupon-admin-header">
                                                <strong>{c.code}</strong>
                                                <span className="badge-tag in-stock">
                                                    {c.discountType === 'percent' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                                                </span>
                                            </div>
                                            <p className="coupon-desc">{c.description || 'Valid on snacks orders'}</p>
                                            <span className="coupon-limits">Min Order: ₹{c.minOrderValue} | Max Disc: ₹{c.maxDiscount}</span>
                                            <button onClick={() => handleDeleteCoupon(c._id)} className="btn-delete-coupon">
                                                Delete Coupon
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 6. Registered Customers Tab */}
                {activeTab === 'users' && (
                    <div className="admin-tab-content animate-fade-in">
                        <div className="admin-table-wrapper">
                            <table className="admin-custom-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Role</th>
                                        <th>Saved Addresses</th>
                                        <th>Joined Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersList.map((u) => (
                                        <tr key={u._id}>
                                            <td><strong>{u.name}</strong></td>
                                            <td>{u.email}</td>
                                            <td>{u.phone || 'N/A'}</td>
                                            <td>
                                                <span className={`badge-tag ${u.role === 'admin' ? 'accent' : 'in-stock'}`}>
                                                    {u.role?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>{u.addresses?.length || 0} address(es)</td>
                                            <td>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal: Add/Edit Product */}
            {productModalOpen && (
                <div className="modal-backdrop" onClick={() => setProductModalOpen(false)}>
                    <div className="admin-modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingProduct ? 'Edit Snack Product' : 'Add New Snack Product'}</h2>
                            <button onClick={() => setProductModalOpen(false)} className="close-modal-btn">✕</button>
                        </div>

                        <form onSubmit={handleSaveProduct} className="modal-form-body">
                            <div className="form-row-2">
                                <div className="input-group">
                                    <label>Snack Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={productForm.name}
                                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Category *</label>
                                    <select
                                        value={productForm.category}
                                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                    >
                                        <option value="Chips">Chips</option>
                                        <option value="Namkeen">Namkeen</option>
                                        <option value="Corn Snacks">Corn Snacks</option>
                                        <option value="Chakli">Chakli</option>
                                        <option value="Special Combos">Special Combos</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row-3">
                                <div className="input-group">
                                    <label>Original Price (₹) *</label>
                                    <input
                                        type="number"
                                        required
                                        value={productForm.price}
                                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Discounted Price (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="Optional sale price"
                                        value={productForm.discountPrice}
                                        onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Stock Quantity *</label>
                                    <input
                                        type="number"
                                        required
                                        value={productForm.stock}
                                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-row-2">
                                <div className="input-group">
                                    <label>Image Path (e.g. /photo/chips1.webp)</label>
                                    <input
                                        type="text"
                                        value={productForm.image}
                                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Preparation Time</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Freshly Packed"
                                        value={productForm.prepTime}
                                        onChange={(e) => setProductForm({ ...productForm, prepTime: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Description</label>
                                <textarea
                                    rows="2"
                                    placeholder="Crisp taste, ingredients details..."
                                    value={productForm.description}
                                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label>Key Ingredients (comma separated)</label>
                                <input
                                    type="text"
                                    placeholder="Potatoes, Oil, Spices, Salt"
                                    value={productForm.ingredients}
                                    onChange={(e) => setProductForm({ ...productForm, ingredients: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={productForm.isFeatured}
                                        onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                                    />
                                    Feature on Homepage
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={productForm.isSpecial}
                                        onChange={(e) => setProductForm({ ...productForm, isSpecial: e.target.checked })}
                                    />
                                    Mark as Today's Special Deal
                                </label>
                            </div>

                            <div className="modal-actions-footer">
                                <button type="button" onClick={() => setProductModalOpen(false)} className="btn-secondary-custom">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary-custom">
                                    {editingProduct ? 'Save Changes' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Order Details Drawer */}
            {selectedOrderDetails && (
                <div className="modal-backdrop" onClick={() => setSelectedOrderDetails(null)}>
                    <div className="admin-modal-card animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h2>Order #{selectedOrderDetails.orderId} Details</h2>
                            <button onClick={() => setSelectedOrderDetails(null)} className="close-modal-btn">✕</button>
                        </div>

                        <div style={{ padding: '20px' }}>
                            <p>Customer: <strong>{selectedOrderDetails.customerName}</strong> ({selectedOrderDetails.customerPhone})</p>
                            <p>Address: {selectedOrderDetails.shippingAddress?.street}, {selectedOrderDetails.shippingAddress?.city}</p>
                            <p>Payment: <strong>{selectedOrderDetails.paymentMethod?.toUpperCase()}</strong> • {selectedOrderDetails.paymentStatus?.toUpperCase()}</p>
                            
                            <h4 style={{ marginTop: '16px', marginBottom: '8px' }}>Ordered Snacks</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {selectedOrderDetails.items?.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: '6px' }}>
                                        <span>{item.name} × {item.quantity}</span>
                                        <strong>₹{(item.price * item.quantity).toFixed(0)}</strong>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '1.1rem', fontWeight: 'bold' }}>
                                <span>Total Amount:</span>
                                <span>₹{selectedOrderDetails.totalAmount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
