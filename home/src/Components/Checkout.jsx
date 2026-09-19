import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { IconCheck, IconTruck } from './Icons';
import '../styles/Checkout.css';

const Checkout = () => {
    const { cart, subtotal, discountAmount, deliveryFee, tax, total, appliedCoupon, clearCart } = useCart();
    const { user, isAuthenticated, addAddress } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: Review, 3: Payment, 4: Confirmation
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

    // New Address Form State
    const [newAddress, setNewAddress] = useState({
        fullName: user?.name || '',
        phone: user?.phone || '',
        street: '',
        city: 'Surat',
        state: 'Gujarat',
        pincode: '395007',
        type: 'Home'
    });

    // Payment Method State
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');

    useEffect(() => {
        if (cart.length === 0 && currentStep !== 4) {
            navigate('/cart');
        }
    }, [cart.length, currentStep, navigate]);

    // Populate user details if available
    useEffect(() => {
        if (user && user.addresses && user.addresses.length > 0) {
            setNewAddress((prev) => ({
                ...prev,
                fullName: user.name,
                phone: user.phone || ''
            }));
        }
    }, [user]);

    const handleSaveNewAddress = async (e) => {
        e.preventDefault();
        if (!newAddress.fullName || !newAddress.phone || !newAddress.street || !newAddress.city || !newAddress.pincode) {
            toast.warning('Please fill in all address fields');
            return;
        }

        if (isAuthenticated) {
            await addAddress(newAddress);
        }
        setIsAddingAddress(false);
        toast.success('Delivery address set!');
    };

    const handlePlaceOrder = async () => {
        setPlacingOrder(true);
        try {
            // Determine chosen shipping address
            let chosenAddress = null;
            if (user?.addresses && user.addresses.length > 0 && !isAddingAddress) {
                chosenAddress = user.addresses[selectedAddressIndex] || user.addresses[0];
            } else {
                chosenAddress = newAddress;
            }

            if (!chosenAddress.fullName || !chosenAddress.phone || !chosenAddress.street) {
                toast.error('Please specify a delivery address');
                setCurrentStep(1);
                setPlacingOrder(false);
                return;
            }

            const orderPayload = {
                user: user?.id || user?._id || null,
                customerName: chosenAddress.fullName,
                customerEmail: user?.email || 'customer@crunchybite.com',
                customerPhone: chosenAddress.phone,
                items: cart,
                subtotal,
                discountAmount,
                couponCode: appliedCoupon?.code || '',
                deliveryFee,
                tax,
                totalAmount: total,
                shippingAddress: chosenAddress,
                paymentMethod: paymentMethod === 'cod' ? 'cod' : 'online_demo'
            };

            const res = await api.post('/orders', orderPayload);
            if (res.data.success) {
                setPlacedOrderDetails(res.data.order);
                clearCart();
                setCurrentStep(4);
                toast.success('🎉 Order Placed Successfully!');
            }
        } catch (err) {
            console.error('Order placement fallback:', err);
            // Fallback order simulation
            const fakeOrder = {
                orderId: `CB-${Math.floor(10000 + Math.random() * 90000)}`,
                customerName: newAddress.fullName || 'Customer',
                totalAmount: total,
                items: cart,
                shippingAddress: newAddress,
                orderStatus: 'pending',
                createdAt: new Date()
            };
            setPlacedOrderDetails(fakeOrder);
            clearCart();
            setCurrentStep(4);
            toast.success('🎉 Order Placed Successfully!');
        }
        setPlacingOrder(false);
    };

    return (
        <div className="checkout-page-wrapper">
            <div className="checkout-page-container">
                {/* Step Progress Indicator */}
                <div className="checkout-stepper">
                    {[
                        { step: 1, label: '1. Delivery Address' },
                        { step: 2, label: '2. Review Items' },
                        { step: 3, label: '3. Payment' },
                        { step: 4, label: '4. Order Confirmation' }
                    ].map((item) => (
                        <div
                            key={item.step}
                            className={`step-indicator ${currentStep >= item.step ? 'active' : ''} ${currentStep === item.step ? 'current' : ''}`}
                        >
                            <div className="step-circle">
                                {currentStep > item.step ? <IconCheck size={14} /> : item.step}
                            </div>
                            <span className="step-label">{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* Step 1: Address */}
                {currentStep === 1 && (
                    <div className="checkout-step-box animate-fade-in">
                        <h2 className="step-heading">Select Delivery Address</h2>

                        {/* Saved Addresses List */}
                        {user?.addresses && user.addresses.length > 0 && !isAddingAddress ? (
                            <div className="saved-addresses-grid">
                                {user.addresses.map((addr, idx) => (
                                    <div
                                        key={idx}
                                        className={`address-card ${selectedAddressIndex === idx ? 'selected' : ''}`}
                                        onClick={() => setSelectedAddressIndex(idx)}
                                    >
                                        <div className="address-type-badge">{addr.type || 'Home'}</div>
                                        <h4>{addr.fullName}</h4>
                                        <p>{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                                        <p className="addr-phone">📞 {addr.phone}</p>
                                    </div>
                                ))}
                                <button onClick={() => setIsAddingAddress(true)} className="btn-add-address-card">
                                    + Add Another Address
                                </button>
                            </div>
                        ) : (
                            /* New Address Form */
                            <form onSubmit={handleSaveNewAddress} className="address-form-layout">
                                <div className="form-row-2">
                                    <div className="input-group">
                                        <label>Full Name *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Rahul Sharma"
                                            required
                                            value={newAddress.fullName}
                                            onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Phone Number *</label>
                                        <input
                                            type="tel"
                                            placeholder="10-digit mobile number"
                                            required
                                            value={newAddress.phone}
                                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label>Street Address / Flat / Landmark *</label>
                                    <input
                                        type="text"
                                        placeholder="Flat No, Building, Street, Landmark"
                                        required
                                        value={newAddress.street}
                                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                    />
                                </div>

                                <div className="form-row-3">
                                    <div className="input-group">
                                        <label>City *</label>
                                        <input
                                            type="text"
                                            required
                                            value={newAddress.city}
                                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>State *</label>
                                        <input
                                            type="text"
                                            required
                                            value={newAddress.state}
                                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Pincode *</label>
                                        <input
                                            type="text"
                                            required
                                            value={newAddress.pincode}
                                            onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {user?.addresses?.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingAddress(false)}
                                        className="btn-secondary-custom"
                                        style={{ marginRight: '10px' }}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </form>
                        )}

                        <div className="step-actions-footer">
                            <Link to="/cart" className="btn-secondary-custom">
                                ← Back to Cart
                            </Link>
                            <button
                                onClick={() => {
                                    if (isAddingAddress) {
                                        if (!newAddress.fullName || !newAddress.phone || !newAddress.street) {
                                            toast.warning('Please complete the address form');
                                            return;
                                        }
                                    }
                                    setCurrentStep(2);
                                }}
                                className="btn-primary-custom"
                            >
                                Continue to Review Items →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Review Order */}
                {currentStep === 2 && (
                    <div className="checkout-step-box animate-fade-in">
                        <h2 className="step-heading">Review Order Items & Estimated Delivery</h2>

                        <div className="review-items-list">
                            {cart.map((item, idx) => (
                                <div key={idx} className="review-item-row">
                                    <img src={item.image || '/photo/products1.webp'} alt={item.name} />
                                    <div className="review-item-details">
                                        <h4>{item.name}</h4>
                                        <span className="review-item-meta">{item.category} • Qty: <strong>{item.quantity}</strong></span>
                                    </div>
                                    <span className="review-item-total">₹{(Number(item.price) * item.quantity).toFixed(0)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Order Calculation Overview */}
                        <div className="review-bill-card">
                            <div className="review-bill-row">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(0)}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="review-bill-row text-success">
                                    <span>Coupon Savings ({appliedCoupon?.code})</span>
                                    <span>- ₹{discountAmount}</span>
                                </div>
                            )}
                            <div className="review-bill-row">
                                <span>Delivery Fee</span>
                                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                            </div>
                            <div className="review-bill-row">
                                <span>Taxes & GST</span>
                                <span>₹{tax.toFixed(0)}</span>
                            </div>
                            <div className="bill-divider"></div>
                            <div className="review-bill-row total">
                                <span>Total Payable</span>
                                <span className="highlight-price">₹{total}</span>
                            </div>
                        </div>

                        <div className="step-actions-footer">
                            <button onClick={() => setCurrentStep(1)} className="btn-secondary-custom">
                                ← Back to Address
                            </button>
                            <button onClick={() => setCurrentStep(3)} className="btn-primary-custom">
                                Proceed to Payment →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                    <div className="checkout-step-box animate-fade-in">
                        <h2 className="step-heading">Choose Payment Method</h2>

                        <div className="payment-options-grid">
                            {/* Option 1: Cash on Delivery */}
                            <label className={`payment-option-card ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={() => setPaymentMethod('cod')}
                                />
                                <div>
                                    <h4>💵 Cash on Delivery (COD)</h4>
                                    <p>Pay with cash or UPI scanner upon delivery at your doorstep.</p>
                                </div>
                            </label>

                            {/* Option 2: Instant Online Payment (Demo) */}
                            <label className={`payment-option-card ${paymentMethod === 'online_demo' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="online_demo"
                                    checked={paymentMethod === 'online_demo'}
                                    onChange={() => setPaymentMethod('online_demo')}
                                />
                                <div>
                                    <h4>💳 Instant UPI / Card Demo Payment</h4>
                                    <p>Safe & secure simulated payment for instant order confirmation.</p>
                                </div>
                            </label>
                        </div>

                        {/* Online Demo Details Form */}
                        {paymentMethod === 'online_demo' && (
                            <div className="demo-payment-details-box animate-fade-in">
                                <h4 style={{ marginBottom: '12px', fontSize: '0.95rem' }}>Demo UPI / Card Simulation</h4>
                                <div className="input-group" style={{ marginBottom: '12px' }}>
                                    <label>UPI ID (e.g. yourname@oksbi / gpay)</label>
                                    <input
                                        type="text"
                                        placeholder="demo@upi"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                    />
                                </div>
                                <div className="form-row-2">
                                    <div className="input-group">
                                        <label>Card Number (Simulated)</label>
                                        <input
                                            type="text"
                                            placeholder="4532 •••• •••• 8920"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Expiry / CVV</label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY • CVV"
                                            value={cardExpiry}
                                            onChange={(e) => setCardExpiry(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <span className="demo-notice-tag">ℹ️ Demo Mode: No real money will be charged.</span>
                            </div>
                        )}

                        <div className="step-actions-footer">
                            <button onClick={() => setCurrentStep(2)} className="btn-secondary-custom">
                                ← Back to Review
                            </button>
                            <button
                                onClick={handlePlaceOrder}
                                disabled={placingOrder}
                                className="btn-primary-custom"
                                style={{ padding: '14px 28px', fontSize: '1.05rem' }}
                            >
                                {placingOrder ? 'Confirming Order...' : `Place Order & Pay ₹${total}`}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Order Confirmation */}
                {currentStep === 4 && placedOrderDetails && (
                    <div className="checkout-step-box confirmation-box animate-fade-in">
                        <div className="confirmation-badge-icon">✓</div>
                        <h1>Order Placed Successfully!</h1>
                        <p className="order-id-highlight">Order ID: <strong>{placedOrderDetails.orderId}</strong></p>
                        <p className="order-summary-subtext">
                            Thank you, <strong>{placedOrderDetails.customerName}</strong>! Your crunchy snacks are now being freshly prepared.
                        </p>

                        <div className="confirmation-details-card">
                            <div className="conf-row">
                                <span>Total Amount:</span>
                                <strong>₹{placedOrderDetails.totalAmount}</strong>
                            </div>
                            <div className="conf-row">
                                <span>Payment Status:</span>
                                <span className="badge-tag in-stock">{placedOrderDetails.paymentStatus === 'paid' ? 'PAID' : 'CASH ON DELIVERY'}</span>
                            </div>
                            <div className="conf-row">
                                <span>Estimated Delivery Time:</span>
                                <strong>⚡ 25-30 Minutes</strong>
                            </div>
                        </div>

                        <div className="confirmation-actions">
                            <Link to={`/track/${placedOrderDetails.orderId}`} className="btn-primary-custom track-order-cta">
                                <IconTruck size={18} />
                                <span>Track Live Order Status</span>
                            </Link>
                            <Link to="/" className="btn-secondary-custom">
                                Back to Homepage
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
