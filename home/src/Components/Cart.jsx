import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { IconTrash, IconTag, IconCheck } from './Icons';
import '../styles/Cart.css';

const Cart = () => {
    const {
        cart,
        subtotal,
        discountAmount,
        deliveryFee,
        tax,
        total,
        appliedCoupon,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon
    } = useCart();

    const navigate = useNavigate();
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        if (!couponCodeInput.trim()) return;
        setCouponLoading(true);
        await applyCoupon(couponCodeInput);
        setCouponLoading(false);
    };

    const suggestedCoupons = [
        { code: 'SAVE10', desc: '10% OFF on orders ₹199+' },
        { code: 'CRUNCHY20', desc: '20% OFF on orders ₹499+' },
        { code: 'SNACK50', desc: 'Flat ₹50 OFF on orders ₹299+' }
    ];

    if (cart.length === 0) {
        return (
            <div className="empty-cart-page">
                <div className="empty-cart-card">
                    <div className="empty-cart-icon">🛒</div>
                    <h2>Your Cart is Empty</h2>
                    <p>Looks like you haven't added any crunchy snacks to your cart yet.</p>
                    <Link to="/product" className="btn-primary-custom start-shopping-btn">
                        Explore Delicious Snacks
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page-wrapper">
            <div className="cart-page-container">
                <div className="cart-header">
                    <h1>Your Shopping Cart</h1>
                    <span className="cart-items-count">({cart.length} unique snack{cart.length > 1 ? 's' : ''})</span>
                </div>

                <div className="cart-layout-grid">
                    {/* Left: Cart Items List */}
                    <div className="cart-items-section">
                        <div className="cart-table-header">
                            <span>Snack Item</span>
                            <span>Unit Price</span>
                            <span>Quantity</span>
                            <span>Subtotal</span>
                            <span>Action</span>
                        </div>

                        <div className="cart-items-list">
                            {cart.map((item) => {
                                const itemId = item._id || item.id || item.name;
                                const itemTotal = Number(item.price) * Number(item.quantity);
                                const itemImg = item.image || item.url || '/photo/products1.webp';

                                return (
                                    <div key={itemId} className="cart-item-row animate-fade-in">
                                        {/* Product Details */}
                                        <div className="cart-item-info">
                                            <img
                                                src={itemImg}
                                                alt={item.name}
                                                onError={(e) => { e.target.src = '/photo/products1.webp'; }}
                                                className="cart-item-thumb"
                                            />
                                            <div>
                                                <h4 className="cart-item-name">{item.name}</h4>
                                                <span className="cart-item-category">{item.category}</span>
                                            </div>
                                        </div>

                                        {/* Unit Price */}
                                        <div className="cart-item-price">
                                            ₹{item.price}
                                        </div>

                                        {/* Quantity Stepper */}
                                        <div className="cart-qty-stepper">
                                            <button
                                                onClick={() => updateQuantity(itemId, item.quantity - 1)}
                                                className="qty-btn"
                                                aria-label="Decrease quantity"
                                            >
                                                -
                                            </button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(itemId, item.quantity + 1)}
                                                disabled={item.quantity >= (item.stock || 99)}
                                                className="qty-btn"
                                                aria-label="Increase quantity"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Row Subtotal */}
                                        <div className="cart-item-subtotal">
                                            ₹{itemTotal.toFixed(0)}
                                        </div>

                                        {/* Remove Action */}
                                        <div className="cart-item-remove">
                                            <button
                                                onClick={() => removeFromCart(itemId)}
                                                className="remove-btn"
                                                title="Remove Item"
                                            >
                                                <IconTrash size={18} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Cart Actions Toolbar */}
                        <div className="cart-actions-bar">
                            <Link to="/product" className="btn-secondary-custom">
                                ← Continue Shopping
                            </Link>
                            <button onClick={clearCart} className="btn-clear-cart">
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Right: Order Summary & Coupon Box */}
                    <div className="cart-summary-section">
                        {/* Coupon Box */}
                        <div className="cart-summary-card coupon-box">
                            <h3 className="card-heading">
                                <IconTag size={18} />
                                <span>Have a Promo Coupon?</span>
                            </h3>

                            {appliedCoupon ? (
                                <div className="applied-coupon-pill">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <IconCheck size={18} color="#10b981" />
                                        <div>
                                            <strong>{appliedCoupon.code}</strong> applied
                                            <span style={{ display: 'block', fontSize: '0.78rem', color: '#10b981' }}>
                                                You saved ₹{discountAmount}!
                                            </span>
                                        </div>
                                    </div>
                                    <button onClick={removeCoupon} className="remove-coupon-btn">
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleApplyCoupon} className="coupon-form">
                                    <input
                                        type="text"
                                        placeholder="Enter coupon code (e.g. SAVE10)"
                                        value={couponCodeInput}
                                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                                    />
                                    <button type="submit" disabled={couponLoading} className="btn-apply-coupon">
                                        {couponLoading ? 'Applying...' : 'Apply'}
                                    </button>
                                </form>
                            )}

                            {/* Suggested Coupons Pills */}
                            {!appliedCoupon && (
                                <div className="suggested-coupons">
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                                        Available Offers (Click to apply):
                                    </span>
                                    <div className="coupon-tag-list">
                                        {suggestedCoupons.map((c) => (
                                            <button
                                                key={c.code}
                                                type="button"
                                                onClick={() => {
                                                    setCouponCodeInput(c.code);
                                                    applyCoupon(c.code);
                                                }}
                                                className="coupon-tag-pill"
                                            >
                                                <strong>{c.code}</strong> - {c.desc}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Summary Bill Card */}
                        <div className="cart-summary-card bill-summary-card">
                            <h3 className="card-heading">Order Summary</h3>

                            <div className="bill-row">
                                <span>Items Subtotal</span>
                                <span>₹{subtotal.toFixed(0)}</span>
                            </div>

                            {discountAmount > 0 && (
                                <div className="bill-row discount-row">
                                    <span>Coupon Discount ({appliedCoupon?.code})</span>
                                    <span>- ₹{discountAmount}</span>
                                </div>
                            )}

                            <div className="bill-row">
                                <span>Delivery Fee</span>
                                <span>
                                    {deliveryFee === 0 ? (
                                        <strong style={{ color: 'var(--success-color)' }}>FREE</strong>
                                    ) : (
                                        `₹${deliveryFee}`
                                    )}
                                </span>
                            </div>

                            {deliveryFee > 0 && (
                                <p className="free-delivery-notice">
                                    Add ₹{(199 - subtotal).toFixed(0)} more for <strong>FREE Delivery</strong>!
                                </p>
                            )}

                            <div className="bill-row">
                                <span>Taxes & GST (5%)</span>
                                <span>₹{tax.toFixed(0)}</span>
                            </div>

                            <div className="bill-divider"></div>

                            <div className="bill-row total-row">
                                <span>Total Payable</span>
                                <span className="total-amount">₹{total}</span>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="btn-primary-custom proceed-checkout-btn"
                            >
                                <span>Proceed to Checkout</span>
                                <span>→</span>
                            </button>

                            <div className="security-assurances">
                                <span>🔒 100% Secure Checkout</span>
                                <span>⚡ 30-Minute Delivery</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;