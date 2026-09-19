import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SnackCard from './SnackCard';
import ProductDetailModal from './ProductDetailModal';

const Wishlist = () => {
    const { wishlist } = useCart();
    const [selectedProduct, setSelectedProduct] = useState(null);

    return (
        <div className="home-section" style={{ minHeight: '80vh', paddingTop: '32px', paddingBottom: '80px' }}>
            <div className="section-header">
                <div>
                    <span className="section-eyebrow">Saved For Later</span>
                    <h1 className="section-title">My Wishlist ({wishlist.length})</h1>
                </div>
                <Link to="/product" className="btn-secondary-custom">
                    + Browse More Snacks
                </Link>
            </div>

            {wishlist.length === 0 ? (
                <div className="empty-results-box" style={{ background: 'var(--bg-card)', padding: '60px 20px' }}>
                    <div className="empty-icon">❤️</div>
                    <h3>Your Wishlist is Empty</h3>
                    <p>Save your favourite chips, namkeens and chaklis here to order them anytime with 1 click.</p>
                    <Link to="/product" className="btn-primary-custom" style={{ marginTop: '20px' }}>
                        Explore Snacks Menu
                    </Link>
                </div>
            ) : (
                <div className="snack-grid">
                    {wishlist.map((item) => (
                        <SnackCard
                            key={item._id || item.id || item.name}
                            product={item}
                            onQuickView={(p) => setSelectedProduct(p)}
                        />
                    ))}
                </div>
            )}

            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
};

export default Wishlist;
