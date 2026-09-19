import React from 'react';
import { useCart } from '../context/CartContext';
import { IconHeart, IconStar, IconCart } from './Icons';

const SnackCard = ({ product, onQuickView }) => {
    const { addToCart, toggleWishlist, isInWishlist } = useCart();

    const price = product.discountPrice || product.price;
    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
    const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
    
    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 5);
    const prodId = product._id || product.id || product.name;
    const isWishlisted = isInWishlist(prodId);
    const imageSrc = product.image || product.url || '/photo/products1.webp';

    return (
        <div
            className="snack-card animate-fade-in"
            style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
        >
            {/* Top Badges & Wishlist */}
            <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg-secondary)', padding: '16px', textAlign: 'center' }}>
                {/* Discount Badge */}
                {hasDiscount && (
                    <span
                        style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            color: 'white',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            zIndex: 2,
                            boxShadow: 'var(--shadow-xs)'
                        }}
                    >
                        {discountPercent}% OFF
                    </span>
                )}

                {/* Stock Badge */}
                {isOutOfStock ? (
                    <span
                        style={{
                            position: 'absolute',
                            top: '12px',
                            right: '48px',
                            background: 'var(--danger-light)',
                            color: 'var(--danger-color)',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.72rem',
                            fontWeight: 'bold',
                            zIndex: 2
                        }}
                    >
                        Out of Stock
                    </span>
                ) : isLowStock ? (
                    <span
                        style={{
                            position: 'absolute',
                            top: '12px',
                            right: '48px',
                            background: 'var(--warning-light)',
                            color: 'var(--warning-color)',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.72rem',
                            fontWeight: 'bold',
                            zIndex: 2
                        }}
                    >
                        Only {product.stock} Left!
                    </span>
                ) : null}

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                    }}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: isWishlisted ? 'var(--danger-light)' : 'var(--bg-surface)',
                        color: isWishlisted ? 'var(--danger-color)' : 'var(--text-muted)',
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-xs)',
                        border: '1px solid var(--border-color)',
                        zIndex: 2,
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, background 0.2s ease'
                    }}
                    title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                    <IconHeart size={18} fill={isWishlisted ? '#ef4444' : 'none'} color={isWishlisted ? '#ef4444' : 'currentColor'} />
                </button>

                {/* Product Image */}
                <div
                    onClick={() => onQuickView && onQuickView(product)}
                    style={{ cursor: 'pointer', overflow: 'hidden', borderRadius: 'var(--radius-sm)' }}
                >
                    <img
                        src={imageSrc}
                        alt={product.name}
                        onError={(e) => { e.target.src = '/photo/products1.webp'; }}
                        style={{
                            width: '100%',
                            height: '180px',
                            objectFit: 'contain',
                            transition: 'transform 0.35s ease'
                        }}
                        onMouseEnter={(e) => { e.target.style.transform = 'scale(1.08)'; }}
                        onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
                    />
                </div>
            </div>

            {/* Product Info */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                    {/* Category & Rating */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {product.category}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            <IconStar size={14} />
                            <span>{product.rating ? Number(product.rating).toFixed(1) : '4.8'}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({product.reviewCount || 12})</span>
                        </div>
                    </div>

                    {/* Snack Title */}
                    <h4
                        onClick={() => onQuickView && onQuickView(product)}
                        style={{
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            marginBottom: '8px',
                            cursor: 'pointer',
                            lineHeight: 1.3,
                            color: 'var(--text-primary)',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}
                    >
                        {product.name}
                    </h4>

                    {/* Short Description */}
                    <p
                        style={{
                            fontSize: '0.82rem',
                            color: 'var(--text-muted)',
                            marginBottom: '14px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.4
                        }}
                    >
                        {product.description || 'Crispy, freshly prepared authentic snack.'}
                    </p>
                </div>

                {/* Price & Add to Cart Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                ₹{price}
                            </span>
                            {hasDiscount && (
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                                    ₹{product.price}
                                </span>
                            )}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {product.prepTime || 'Freshly Packed'}
                        </span>
                    </div>

                    <button
                        onClick={() => addToCart(product, 1)}
                        disabled={isOutOfStock}
                        style={{
                            background: isOutOfStock ? 'var(--bg-secondary)' : 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                            color: isOutOfStock ? 'var(--text-muted)' : 'white',
                            padding: '9px 16px',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: 600,
                            fontSize: '0.88rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                            boxShadow: isOutOfStock ? 'none' : 'var(--shadow-sm)',
                            transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                        }}
                    >
                        <IconCart size={16} />
                        <span>{isOutOfStock ? 'Out' : 'Add'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SnackCard;
