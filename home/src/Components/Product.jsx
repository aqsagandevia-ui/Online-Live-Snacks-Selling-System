import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { fallbackProducts } from '../services/api';
import SnackCard from './SnackCard';
import ProductDetailModal from './ProductDetailModal';
import { IconSearch, IconClose } from './Icons';
import '../styles/Product.css';

const Product = ({ initialCategory = 'All' }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const querySearch = searchParams.get('search') || '';
    const queryCategory = searchParams.get('category') || initialCategory;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(queryCategory);
    const [searchQuery, setSearchQuery] = useState(querySearch);
    const [priceRange, setPriceRange] = useState(250);
    const [ratingFilter, setRatingFilter] = useState(0);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sortBy, setSortBy] = useState('popular');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const categoriesList = ['All', 'Chips', 'Namkeen', 'Corn Snacks', 'Chakli', 'Special Combos'];

    // Update state if URL query changes
    useEffect(() => {
        if (queryCategory && queryCategory !== selectedCategory) {
            setSelectedCategory(queryCategory);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryCategory]);

    useEffect(() => {
        if (querySearch !== searchQuery) {
            setSearchQuery(querySearch);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [querySearch]);

    // Fetch Products from Backend API
    useEffect(() => {
        const fetchAllProducts = async () => {
            setLoading(true);
            try {
                let url = '/products?';
                if (selectedCategory && selectedCategory !== 'All') {
                    url += `category=${encodeURIComponent(selectedCategory)}&`;
                }
                if (searchQuery.trim()) {
                    url += `search=${encodeURIComponent(searchQuery.trim())}&`;
                }
                if (inStockOnly) {
                    url += `inStock=true&`;
                }
                if (ratingFilter > 0) {
                    url += `rating=${ratingFilter}&`;
                }

                const res = await api.get(url);
                if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                    setProducts(res.data);
                } else if (res.data && Array.isArray(res.data) && res.data.length === 0) {
                    setProducts([]);
                } else {
                    setProducts(fallbackProducts);
                }
            } catch (err) {
                console.log('Product fetch fallback:', err.message);
                // Filter fallback local data
                let local = [...fallbackProducts];
                if (selectedCategory !== 'All') {
                    local = local.filter((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));
                }
                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase();
                    local = local.filter((p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
                }
                setProducts(local);
            }
            setLoading(false);
        };

        const timer = setTimeout(() => {
            fetchAllProducts();
        }, 150);

        return () => clearTimeout(timer);
    }, [selectedCategory, searchQuery, inStockOnly, ratingFilter]);

    // Filter & Sort Products Client-side for instant responsive responsiveness
    const filteredProducts = useMemo(() => {
        let result = products.filter((p) => {
            const price = p.discountPrice || p.price;
            if (price > priceRange) return false;
            return true;
        });

        // Sorting
        result.sort((a, b) => {
            const priceA = a.discountPrice || a.price;
            const priceB = b.discountPrice || b.price;

            if (sortBy === 'price_asc') return priceA - priceB;
            if (sortBy === 'price_desc') return priceB - priceA;
            if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
            if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            // Default: popular
            return (b.reviewCount || 0) - (a.reviewCount || 0);
        });

        return result;
    }, [products, priceRange, sortBy]);

    const resetFilters = () => {
        setSelectedCategory('All');
        setSearchQuery('');
        setPriceRange(250);
        setRatingFilter(0);
        setInStockOnly(false);
        setSortBy('popular');
        setSearchParams({});
    };

    return (
        <div className="product-catalog-page">
            {/* Catalog Page Header */}
            <div className="catalog-header-banner">
                <div className="catalog-header-inner">
                    <span className="eyebrow-tag">Crunchy Bite Fresh Menu</span>
                    <h1>
                        {selectedCategory === 'All' ? 'Explore All Snacks' : `${selectedCategory}`}
                    </h1>
                    <p>
                        Discover hand-roasted, crispy Gujarati & Indian snacks packed with authentic spices.
                    </p>
                </div>
            </div>

            <div className="catalog-main-container">
                {/* Mobile Filter Trigger Button */}
                <div className="mobile-filter-bar">
                    <button
                        onClick={() => setMobileFilterOpen(true)}
                        className="mobile-filter-toggle-btn"
                    >
                        <span>⚙ Filters & Categories</span>
                        <span className="filter-count-badge">
                            {(selectedCategory !== 'All' ? 1 : 0) + (inStockOnly ? 1 : 0) + (ratingFilter > 0 ? 1 : 0)}
                        </span>
                    </button>

                    <div className="sort-select-wrapper">
                        <label>Sort by:</label>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="popular">Popularity</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="rating">Top Rated (★)</option>
                            <option value="newest">Newest Added</option>
                        </select>
                    </div>
                </div>

                <div className="catalog-layout-grid">
                    {/* Left Filter Sidebar */}
                    <aside className={`filter-sidebar ${mobileFilterOpen ? 'mobile-open' : ''}`}>
                        <div className="sidebar-header">
                            <h3>Filters</h3>
                            {mobileFilterOpen && (
                                <button onClick={() => setMobileFilterOpen(false)} className="close-filter-btn">
                                    <IconClose size={20} />
                                </button>
                            )}
                        </div>

                        {/* Search Input */}
                        <div className="filter-block">
                            <label className="filter-title">Search Snacks</label>
                            <div className="sidebar-search-box">
                                <IconSearch size={16} />
                                <input
                                    type="text"
                                    placeholder="Filter by keyword..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="clear-filter-btn">×</button>
                                )}
                            </div>
                        </div>

                        {/* Categories List */}
                        <div className="filter-block">
                            <label className="filter-title">Categories</label>
                            <div className="category-pill-list">
                                {categoriesList.map((cat) => (
                                    <button
                                        key={cat}
                                        className={`cat-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                                        onClick={() => {
                                            setSelectedCategory(cat);
                                            setSearchParams(cat === 'All' ? {} : { category: cat });
                                        }}
                                    >
                                        <span>{cat}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Slider */}
                        <div className="filter-block">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <label className="filter-title">Max Price</label>
                                <span className="price-tag-display">₹{priceRange}</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="250"
                                step="5"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="price-slider-input"
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                <span>₹10</span>
                                <span>₹250+</span>
                            </div>
                        </div>

                        {/* Ratings Filter */}
                        <div className="filter-block">
                            <label className="filter-title">Minimum Rating</label>
                            <div className="rating-filter-options">
                                {[
                                    { label: 'All Ratings', value: 0 },
                                    { label: '4.5★ & Above', value: 4.5 },
                                    { label: '4.0★ & Above', value: 4.0 }
                                ].map((opt) => (
                                    <label key={opt.value} className="radio-label">
                                        <input
                                            type="radio"
                                            name="rating"
                                            checked={ratingFilter === opt.value}
                                            onChange={() => setRatingFilter(opt.value)}
                                        />
                                        <span>{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Availability Filter */}
                        <div className="filter-block">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={inStockOnly}
                                    onChange={(e) => setInStockOnly(e.target.checked)}
                                />
                                <span>In Stock Only</span>
                            </label>
                        </div>

                        {/* Reset Filter Button */}
                        <button onClick={resetFilters} className="btn-secondary-custom reset-btn">
                            Reset All Filters
                        </button>
                    </aside>

                    {/* Right Product Grid Section */}
                    <main className="product-results-main">
                        {/* Results Summary & Desktop Sort */}
                        <div className="results-toolbar">
                            <p className="results-count-text">
                                Showing <strong>{filteredProducts.length}</strong> delicious snack{filteredProducts.length !== 1 ? 's' : ''}
                            </p>

                            <div className="desktop-sort-box">
                                <label>Sort By:</label>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="popular">Most Popular</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="rating">Top Rated (★)</option>
                                    <option value="newest">Newest Added</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {loading ? (
                            <div className="snack-grid">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                    <div key={n} className="skeleton" style={{ height: '340px' }}></div>
                                ))}
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="empty-results-box">
                                <div className="empty-icon">🔍</div>
                                <h3>No Snacks Found</h3>
                                <p>We couldn't find any snacks matching your selected filters or search term.</p>
                                <button onClick={resetFilters} className="btn-primary-custom" style={{ marginTop: '16px' }}>
                                    Clear Filters & View All
                                </button>
                            </div>
                        ) : (
                            <div className="snack-grid">
                                {filteredProducts.map((product) => (
                                    <SnackCard
                                        key={product._id || product.name}
                                        product={product}
                                        onQuickView={(p) => setSelectedProduct(p)}
                                    />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Product Quick View Modal */}
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
};

export default Product;