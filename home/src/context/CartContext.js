import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const toast = useToast();

    // 1. Load Cart from LocalStorage
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem('crunchy_cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (e) {
            return [];
        }
    });

    // 2. Load Wishlist from LocalStorage
    const [wishlist, setWishlist] = useState(() => {
        try {
            const savedWishlist = localStorage.getItem('crunchy_wishlist');
            return savedWishlist ? JSON.parse(savedWishlist) : [];
        } catch (e) {
            return [];
        }
    });

    // 3. Coupon State
    const [appliedCoupon, setAppliedCoupon] = useState(() => {
        try {
            const savedCoupon = localStorage.getItem('crunchy_coupon');
            return savedCoupon ? JSON.parse(savedCoupon) : null;
        } catch (e) {
            return null;
        }
    });

    // Sync Cart to LocalStorage
    useEffect(() => {
        localStorage.setItem('crunchy_cart', JSON.stringify(cart));
    }, [cart]);

    // Sync Wishlist to LocalStorage
    useEffect(() => {
        localStorage.setItem('crunchy_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    // Sync Coupon to LocalStorage
    useEffect(() => {
        if (appliedCoupon) {
            localStorage.setItem('crunchy_coupon', JSON.stringify(appliedCoupon));
        } else {
            localStorage.removeItem('crunchy_coupon');
        }
    }, [appliedCoupon]);

    // Add item to cart
    const addToCart = (product, quantity = 1) => {
        const prodId = product._id || product.id || product.name;
        const price = product.discountPrice || product.price || 0;
        const image = product.image || product.url || '/photo/products1.webp';
        const maxStock = product.stock !== undefined ? product.stock : 99;

        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex((item) => (item._id || item.id || item.name) === prodId);

            if (existingIndex > -1) {
                const currentQty = prevCart[existingIndex].quantity;
                const newQty = Math.min(currentQty + quantity, maxStock);
                if (newQty === currentQty && maxStock <= currentQty) {
                    toast.warning(`Maximum available stock reached for ${product.name}`);
                    return prevCart;
                }
                const updated = [...prevCart];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: newQty
                };
                toast.success(`Updated quantity of ${product.name} (${newQty})`);
                return updated;
            } else {
                toast.success(`Added ${product.name} to cart!`);
                return [
                    ...prevCart,
                    {
                        _id: prodId,
                        id: prodId,
                        name: product.name,
                        price: price,
                        originalPrice: product.price,
                        image: image,
                        url: image,
                        category: product.category || 'Snacks',
                        quantity: Math.min(quantity, maxStock),
                        stock: maxStock
                    }
                ];
            }
        });
    };

    // Update quantity
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) => {
                if ((item._id || item.id || item.name) === productId) {
                    const maxStock = item.stock || 99;
                    return { ...item, quantity: Math.min(newQuantity, maxStock) };
                }
                return item;
            })
        );
    };

    // Remove single item
    const removeFromCart = (productId) => {
        setCart((prevCart) => {
            const item = prevCart.find((i) => (i._id || i.id || i.name) === productId);
            if (item) {
                toast.info(`Removed ${item.name} from cart`);
            }
            return prevCart.filter((i) => (i._id || i.id || i.name) !== productId);
        });
    };

    // Clear entire cart
    const clearCart = () => {
        setCart([]);
        setAppliedCoupon(null);
    };

    // Wishlist toggle
    const toggleWishlist = (product) => {
        const prodId = product._id || product.id || product.name;
        const exists = wishlist.some((item) => (item._id || item.id || item.name) === prodId);

        if (exists) {
            setWishlist((prev) => prev.filter((item) => (item._id || item.id || item.name) !== prodId));
            toast.info(`Removed ${product.name} from Wishlist`);
        } else {
            setWishlist((prev) => [...prev, product]);
            toast.success(`Added ${product.name} to Wishlist ❤️`);
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some((item) => (item._id || item.id || item.name) === productId);
    };

    // Financial calculations
    const subtotal = useMemo(() => {
        return cart.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
    }, [cart]);

    const discountAmount = useMemo(() => {
        if (!appliedCoupon) return 0;
        let disc = 0;
        if (appliedCoupon.discountType === 'percent') {
            disc = (subtotal * appliedCoupon.discountValue) / 100;
            if (appliedCoupon.maxDiscount && disc > appliedCoupon.maxDiscount) {
                disc = appliedCoupon.maxDiscount;
            }
        } else {
            disc = appliedCoupon.discountValue;
        }
        return Math.min(Math.round(disc), subtotal);
    }, [appliedCoupon, subtotal]);

    // Free delivery above ₹199, otherwise ₹30
    const deliveryFee = useMemo(() => {
        if (cart.length === 0) return 0;
        return subtotal >= 199 ? 0 : 30;
    }, [cart.length, subtotal]);

    // GST/Tax (5%)
    const tax = useMemo(() => {
        if (cart.length === 0) return 0;
        return Math.round((subtotal - discountAmount) * 0.05 * 100) / 100;
    }, [cart.length, subtotal, discountAmount]);

    // Final total
    const total = useMemo(() => {
        if (cart.length === 0) return 0;
        return Math.max(0, Math.round(subtotal - discountAmount + deliveryFee + tax));
    }, [cart.length, subtotal, discountAmount, deliveryFee, tax]);

    // Apply coupon
    const applyCoupon = async (code) => {
        if (!code || code.trim() === '') {
            toast.error('Please enter a coupon code');
            return false;
        }

        try {
            const res = await api.post('/coupons/apply', { code, subtotal });
            if (res.data.success) {
                setAppliedCoupon(res.data.coupon);
                toast.success(res.data.message);
                return true;
            } else {
                toast.error(res.data.message || 'Invalid coupon');
                return false;
            }
        } catch (err) {
            // Local fallback validation for demo
            const upper = code.toUpperCase().trim();
            if (upper === 'SAVE10' && subtotal >= 199) {
                const c = { code: 'SAVE10', discountType: 'percent', discountValue: 10, maxDiscount: 100 };
                setAppliedCoupon(c);
                toast.success("Coupon 'SAVE10' applied (10% OFF)");
                return true;
            } else if (upper === 'CRUNCHY20' && subtotal >= 499) {
                const c = { code: 'CRUNCHY20', discountType: 'percent', discountValue: 20, maxDiscount: 200 };
                setAppliedCoupon(c);
                toast.success("Coupon 'CRUNCHY20' applied (20% OFF)");
                return true;
            } else if (upper === 'SNACK50' && subtotal >= 299) {
                const c = { code: 'SNACK50', discountType: 'flat', discountValue: 50 };
                setAppliedCoupon(c);
                toast.success("Coupon 'SNACK50' applied (₹50 OFF)");
                return true;
            }
            const msg = err.response?.data?.message || 'Invalid or expired coupon code';
            toast.error(msg);
            return false;
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        toast.info('Coupon removed');
    };

    const cartCount = useMemo(() => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    }, [cart]);

    return (
        <CartContext.Provider
            value={{
                cart,
                cartCount,
                subtotal,
                discountAmount,
                deliveryFee,
                tax,
                total,
                appliedCoupon,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                applyCoupon,
                removeCoupon,
                wishlist,
                toggleWishlist,
                isInWishlist
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
