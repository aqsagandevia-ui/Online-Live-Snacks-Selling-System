import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { IconCheck } from './Icons';
import '../styles/Orders.css';

const OrderTracking = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const orderStages = [
        { key: 'pending', label: 'Order Placed', desc: 'Received & awaiting kitchen confirmation' },
        { key: 'confirmed', label: 'Confirmed', desc: 'Order accepted by chef' },
        { key: 'preparing', label: 'Preparing', desc: 'Snacks being freshly fried & packaged' },
        { key: 'ready', label: 'Ready for Pickup', desc: 'Packed & handed over to delivery partner' },
        { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider is on the way to your door' },
        { key: 'delivered', label: 'Delivered', desc: 'Delivered safely at your doorstep' }
    ];

    const getStageIndex = (status) => {
        if (status === 'cancelled') return -1;
        const idx = orderStages.findIndex((s) => s.key === status);
        return idx !== -1 ? idx : 0;
    };

    const fetchOrder = async () => {
        try {
            const res = await api.get(`/orders/${orderId}`);
            if (res.data.success && res.data.order) {
                setOrder(res.data.order);
            }
        } catch (err) {
            // Local fallback simulation if server is offline
            setOrder({
                orderId: orderId || 'CB-10021',
                customerName: 'Rahul Sharma',
                customerPhone: '9898989898',
                orderStatus: 'preparing',
                totalAmount: 194,
                items: [
                    { name: 'Crispy Banana Wafers', price: 45, quantity: 3, image: '/photo/chips3.jpg' },
                    { name: 'Thai Chilli Corn Rings', price: 50, quantity: 1, image: '/photo/corn1.png' }
                ],
                shippingAddress: {
                    fullName: 'Rahul Sharma',
                    street: 'Flat 402, Shivalik Heights, VIP Road',
                    city: 'Surat',
                    pincode: '395007'
                },
                paymentMethod: 'online_demo',
                paymentStatus: 'paid',
                createdAt: new Date(Date.now() - 3600000)
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrder();
        // Polling interval for live status update
        const interval = setInterval(fetchOrder, 8000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    if (loading) {
        return (
            <div className="orders-page-wrapper">
                <div className="orders-container">
                    <div className="skeleton" style={{ height: '400px', borderRadius: '16px' }}></div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="orders-page-wrapper">
                <div className="orders-container text-center">
                    <h2>Order Not Found</h2>
                    <p>We couldn't find order details for #{orderId}.</p>
                    <Link to="/orders" className="btn-primary-custom" style={{ marginTop: '16px' }}>
                        View My Orders
                    </Link>
                </div>
            </div>
        );
    }

    const currentStageIdx = getStageIndex(order.orderStatus);
    const isCancelled = order.orderStatus === 'cancelled';

    return (
        <div className="orders-page-wrapper">
            <div className="orders-container">
                {/* Header Card */}
                <div className="tracking-header-card animate-fade-in">
                    <div className="tracking-header-left">
                        <span className="tracking-badge">⚡ LIVE ORDER STATUS</span>
                        <h1>Order #{order.orderId}</h1>
                        <p className="order-date-text">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>

                    <div className="tracking-header-right">
                        <span className={`status-pill ${order.orderStatus}`}>
                            {order.orderStatus.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        <p className="est-delivery-text">
                            Estimated Delivery: <strong>{isCancelled ? 'Order Cancelled' : order.orderStatus === 'delivered' ? 'Delivered' : '20-25 Mins'}</strong>
                        </p>
                    </div>
                </div>

                {/* Visual Progress Timeline */}
                <div className="timeline-card animate-fade-in">
                    <h3 className="section-subtitle">Live Delivery Progress</h3>

                    {isCancelled ? (
                        <div className="cancelled-banner">
                            <span style={{ fontSize: '1.5rem' }}>✕</span>
                            <div>
                                <h4>Order Was Cancelled</h4>
                                <p>This order has been cancelled and any refund or inventory has been restored.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="progress-timeline-wrapper">
                            {orderStages.map((stage, idx) => {
                                const isCompleted = idx <= currentStageIdx;
                                const isCurrent = idx === currentStageIdx;

                                return (
                                    <div
                                        key={stage.key}
                                        className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                                    >
                                        <div className="timeline-icon-box">
                                            {isCompleted ? <IconCheck size={16} /> : idx + 1}
                                        </div>
                                        <div className="timeline-text">
                                            <h4>{stage.label}</h4>
                                            <p>{stage.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Item Details & Delivery Address Grid */}
                <div className="tracking-details-grid animate-fade-in">
                    {/* Ordered Items List */}
                    <div className="tracking-subcard">
                        <h3 className="section-subtitle">Items in Order ({order.items?.length || 0})</h3>
                        <div className="ordered-items-list">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="ordered-item-row">
                                    <img src={item.image || '/photo/products1.webp'} alt={item.name} />
                                    <div className="ordered-item-info">
                                        <h4>{item.name}</h4>
                                        <span className="qty-price-pill">Qty: {item.quantity} × ₹{item.price}</span>
                                    </div>
                                    <span className="ordered-item-total">₹{(item.price * item.quantity).toFixed(0)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Bill Breakdown */}
                        <div className="ordered-bill-summary">
                            <div className="bill-line">
                                <span>Subtotal:</span>
                                <span>₹{order.subtotal || order.totalAmount}</span>
                            </div>
                            {order.discountAmount > 0 && (
                                <div className="bill-line text-success">
                                    <span>Discount ({order.couponCode || 'Coupon'}):</span>
                                    <span>- ₹{order.discountAmount}</span>
                                </div>
                            )}
                            <div className="bill-line">
                                <span>Delivery:</span>
                                <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
                            </div>
                            <div className="bill-line total">
                                <span>Grand Total:</span>
                                <span className="total-highlight">₹{order.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery & Payment Info */}
                    <div className="tracking-subcard">
                        <h3 className="section-subtitle">Delivery & Payment Details</h3>

                        <div className="delivery-info-box">
                            <h4>Delivery Address</h4>
                            <p className="customer-name"><strong>{order.customerName}</strong></p>
                            <p>{order.shippingAddress?.street}</p>
                            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state || 'Gujarat'} - {order.shippingAddress?.pincode}</p>
                            <p>📞 {order.customerPhone}</p>
                        </div>

                        <div className="payment-info-box" style={{ marginTop: '20px' }}>
                            <h4>Payment Method</h4>
                            <p>
                                <strong>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Instant Online / UPI'}</strong>
                                <span className={`badge-tag ${order.paymentStatus === 'paid' ? 'in-stock' : 'low-stock'}`} style={{ marginLeft: '10px' }}>
                                    {order.paymentStatus?.toUpperCase()}
                                </span>
                            </p>
                        </div>

                        <div className="tracking-actions-bar" style={{ marginTop: '24px' }}>
                            <Link to="/orders" className="btn-secondary-custom">
                                View All Orders
                            </Link>
                            <Link to="/product" className="btn-primary-custom">
                                Order More Snacks
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
