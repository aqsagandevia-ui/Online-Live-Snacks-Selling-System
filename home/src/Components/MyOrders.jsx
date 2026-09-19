import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { IconTruck } from './Icons';
import '../styles/Orders.css';

const MyOrders = () => {
    const { user } = useAuth();
    const toast = useToast();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'delivered', 'cancelled'

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const query = user?.id || user?._id ? `userId=${user.id || user._id}` : (user?.email ? `email=${user.email}` : '');
            const res = await api.get(`/orders/my-orders?${query}`);
            if (res.data.success) {
                setOrders(res.data.orders);
            }
        } catch (err) {
            console.log('Orders fallback:', err);
            // Local fallback
            setOrders([
                {
                    orderId: 'CB-10021',
                    orderStatus: 'delivered',
                    createdAt: new Date(Date.now() - 3600000 * 48),
                    totalAmount: 89,
                    items: [
                        { name: 'Chilli Sprinkled Chips', quantity: 2, price: 25, image: '/photo/chips1.webp' },
                        { name: 'Royal Namkeen Mixture', quantity: 1, price: 45, image: '/photo/namkken1.webp' }
                    ]
                },
                {
                    orderId: 'CB-10022',
                    orderStatus: 'preparing',
                    createdAt: new Date(Date.now() - 3600000 * 2),
                    totalAmount: 194,
                    items: [
                        { name: 'Crispy Banana Wafers', quantity: 3, price: 45, image: '/photo/chips3.jpg' },
                        { name: 'Thai Chilli Corn Rings', quantity: 1, price: 50, image: '/photo/corn1.png' }
                    ]
                }
            ]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm(`Are you sure you want to cancel Order #${orderId}?`)) return;

        try {
            const res = await api.put(`/orders/${orderId}/cancel`);
            if (res.data.success) {
                toast.success('Order cancelled successfully');
                fetchOrders();
            }
        } catch (e) {
            toast.error(e.response?.data?.message || 'Error cancelling order');
        }
    };

    const filteredOrders = orders.filter((order) => {
        if (activeTab === 'active') {
            return ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(order.orderStatus);
        }
        if (activeTab === 'delivered') return order.orderStatus === 'delivered';
        if (activeTab === 'cancelled') return order.orderStatus === 'cancelled';
        return true;
    });

    return (
        <div className="orders-page-wrapper">
            <div className="orders-container">
                <div className="my-orders-header">
                    <div>
                        <h1>My Order History</h1>
                        <p className="subtext">View, track and reorder your favourite snacks anytime.</p>
                    </div>
                    <Link to="/product" className="btn-primary-custom">
                        + Place New Order
                    </Link>
                </div>

                {/* Filter Tabs */}
                <div className="orders-filter-tabs">
                    {[
                        { key: 'all', label: `All Orders (${orders.length})` },
                        { key: 'active', label: 'In Progress ⏳' },
                        { key: 'delivered', label: 'Delivered ✓' },
                        { key: 'cancelled', label: 'Cancelled ✕' }
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            className={`order-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Orders Content */}
                {loading ? (
                    <div className="orders-skeleton-list">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="skeleton" style={{ height: '160px', marginBottom: '16px' }}></div>
                        ))}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="no-orders-box animate-fade-in">
                        <div className="no-orders-icon">📦</div>
                        <h3>No Orders Found</h3>
                        <p>You haven't placed any orders in this category yet.</p>
                        <Link to="/product" className="btn-primary-custom" style={{ marginTop: '16px' }}>
                            Discover Snacks Menu
                        </Link>
                    </div>
                ) : (
                    <div className="orders-cards-list">
                        {filteredOrders.map((order) => {
                            const isPendingOrPreparing = ['pending', 'confirmed', 'preparing'].includes(order.orderStatus);

                            return (
                                <div key={order._id || order.orderId} className="order-history-card animate-fade-in">
                                    <div className="order-card-header">
                                        <div>
                                            <span className="order-id-label">Order #{order.orderId}</span>
                                            <span className="order-date-label">
                                                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <span className={`status-pill ${order.orderStatus}`}>
                                            {order.orderStatus.replace(/_/g, ' ').toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Item Thumbnails Preview */}
                                    <div className="order-items-preview">
                                        <div className="preview-thumbs">
                                            {order.items?.map((item, i) => (
                                                <img
                                                    key={i}
                                                    src={item.image || '/photo/products1.webp'}
                                                    alt={item.name}
                                                    title={`${item.name} (Qty: ${item.quantity})`}
                                                    className="thumb-img"
                                                />
                                            ))}
                                        </div>
                                        <div className="preview-meta">
                                            <p className="items-summary-text">
                                                {order.items?.map((item) => `${item.name} (x${item.quantity})`).join(', ')}
                                            </p>
                                            <span className="order-amount-text">Total: <strong>₹{order.totalAmount}</strong></span>
                                        </div>
                                    </div>

                                    {/* Order Actions */}
                                    <div className="order-card-footer">
                                        <Link to={`/track/${order.orderId}`} className="btn-primary-custom track-btn">
                                            <IconTruck size={16} />
                                            <span>Track Live Status</span>
                                        </Link>

                                        {isPendingOrPreparing && (
                                            <button
                                                onClick={() => handleCancelOrder(order._id || order.orderId)}
                                                className="btn-cancel-order"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
