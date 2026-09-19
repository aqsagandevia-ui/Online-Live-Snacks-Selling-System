import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { fallbackProducts } from '../services/api';
import SnackCard from './SnackCard';
import ProductDetailModal from './ProductDetailModal';
import { IconTruck, IconShield, IconStar, IconCart, IconCheck } from './Icons';
import '../styles/Hero.css';

// Import existing images
import header_img from '../images/header_img.jpg';
import header_img1 from '../images/header_img1.jpg';
import header_img2 from '../images/header_img2.jpg';
import header_img3 from '../images/header_img3.jpg';
import banner from '../images/banner.jpg';
import category_chips from '../images/category.jpg';
import category_namkeen from '../images/category1.png';
import category_corn from '../images/category2.png';
import product4 from '../images/product4.jpg';

const Hero = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [popularSnacks, setPopularSnacks] = useState([]);
    const [specialDeals, setSpecialDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const bannerSlides = [
        {
            image: header_img,
            title: 'Authentic Indian Snacks, Delivered Fresh',
            subtitle: 'Crispy namkeens, spicy chaklis & gourmet chips handcrafted with pure ingredients.',
            badge: '🔥 Bestseller Flavours',
            ctaText: 'Explore Menu',
            ctaLink: '/product'
        },
        {
            image: header_img1,
            title: 'Festive & Tea-Time Combos',
            subtitle: 'Celebrate every moment with crunch. Up to 20% OFF on family combo packs.',
            badge: '⚡ Special Flash Offer',
            ctaText: 'Grab Combo Deals',
            ctaLink: '/product?category=Special+Combos'
        },
        {
            image: header_img2,
            title: 'Pure Vegetarian & Hygienically Packed',
            subtitle: 'Cooked fresh in pure oils with authentic traditional recipes. 100% Taste Guaranteed.',
            badge: '🌿 100% Veg Assurance',
            ctaText: 'Order Now',
            ctaLink: '/product'
        },
        {
            image: header_img3,
            title: 'Crunchy Chakli & Roasted Corn Treats',
            subtitle: 'Handcrafted spirals and extruded corn puffs seasoned to mouthwatering perfection.',
            badge: '⭐ 4.9 Rating by 1,000+ Foodies',
            ctaText: 'View Specials',
            ctaLink: '/Chakli'
        }
    ];

    // Carousel auto-advance
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [bannerSlides.length]);

    // Load dynamic products & categories
    useEffect(() => {
        const loadHomeData = async () => {
            setLoading(true);
            try {
                const prodRes = await api.get('/products');
                if (prodRes.data?.length > 0) {
                    const all = prodRes.data;
                    setPopularSnacks(all.filter((p) => p.isFeatured || p.rating >= 4.7).slice(0, 8));
                    setSpecialDeals(all.filter((p) => p.discountPrice > 0 || p.isSpecial).slice(0, 4));
                } else {
                    setPopularSnacks(fallbackProducts.slice(0, 8));
                    setSpecialDeals(fallbackProducts.slice(0, 4));
                }
            } catch (err) {
                setPopularSnacks(fallbackProducts.slice(0, 8));
                setSpecialDeals(fallbackProducts.slice(0, 4));
            }
            setLoading(false);
        };
        loadHomeData();
    }, []);

    const categoryVisuals = [
        { name: 'Chips', image: category_chips, link: '/Chip', count: '11 Varieties' },
        { name: 'Namkeen', image: category_namkeen, link: '/Namkeen', count: '9 Varieties' },
        { name: 'Corn Snacks', image: category_corn, link: '/Corn', count: '8 Varieties' },
        { name: 'Chakli', image: product4, link: '/Chakli', count: '7 Varieties' }
    ];

    return (
        <div className="home-page-container">
            {/* 1. Hero Carousel Banner */}
            <section className="hero-banner-section">
                <div className="hero-carousel-container">
                    {bannerSlides.map((slide, idx) => (
                        <div
                            key={idx}
                            className={`hero-slide ${idx === currentSlide ? 'active' : ''}`}
                            style={{ backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.4) 60%, rgba(15, 23, 42, 0.1) 100%), url(${slide.image})` }}
                        >
                            <div className="hero-slide-content">
                                <span className="hero-badge">{slide.badge}</span>
                                <h1 className="hero-headline">{slide.title}</h1>
                                <p className="hero-subtext">{slide.subtitle}</p>
                                <div className="hero-cta-group">
                                    <Link to={slide.ctaLink} className="btn-primary-custom hero-btn-main">
                                        <IconCart size={18} />
                                        <span>{slide.ctaText}</span>
                                    </Link>
                                    <Link to="/product" className="btn-secondary-custom hero-btn-sec">
                                        Explore All Menu
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Carousel Navigation Dots */}
                    <div className="carousel-dots">
                        {bannerSlides.map((_, i) => (
                            <button
                                key={i}
                                className={`dot ${i === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(i)}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. Feature Highlights Strip */}
            <section className="highlights-bar">
                <div className="features-grid">
                    <div className="feature-item">
                        <div className="feature-icon"><IconTruck size={24} /></div>
                        <div>
                            <h4>30-Min Fast Delivery</h4>
                            <p>Hot, crisp & delivered right on time</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon"><IconShield size={24} /></div>
                        <div>
                            <h4>100% Fresh & Authentic</h4>
                            <p>Handcrafted using pure ingredients</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon"><IconStar size={24} /></div>
                        <div>
                            <h4>4.9★ Customer Rating</h4>
                            <p>Loved by over 10,000+ snack fans</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon"><IconCheck size={24} /></div>
                        <div>
                            <h4>Hygienic Packaging</h4>
                            <p>Vacuum sealed for long-lasting crunch</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Popular Categories Section */}
            <section className="home-section categories-section">
                <div className="section-header">
                    <div>
                        <span className="section-eyebrow">Mouthwatering Choices</span>
                        <h2 className="section-title">Explore Categories</h2>
                    </div>
                    <Link to="/product" className="view-all-link">View Full Menu →</Link>
                </div>

                <div className="category-cards-grid">
                    {categoryVisuals.map((cat, index) => (
                        <div
                            key={index}
                            className="category-card"
                            onClick={() => navigate(cat.link)}
                        >
                            <div className="category-img-wrapper">
                                <img src={cat.image} alt={cat.name} />
                            </div>
                            <div className="category-card-info">
                                <h3>{cat.name}</h3>
                                <span className="cat-item-count">{cat.count}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Popular Bestselling Snacks Grid */}
            <section className="home-section popular-snacks-section">
                <div className="section-header">
                    <div>
                        <span className="section-eyebrow">Customer Favourites</span>
                        <h2 className="section-title">Popular Snacks</h2>
                    </div>
                    <Link to="/product" className="view-all-link">See All ({popularSnacks.length + 20}+) →</Link>
                </div>

                {loading ? (
                    <div className="snack-grid">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="skeleton" style={{ height: '320px' }}></div>
                        ))}
                    </div>
                ) : (
                    <div className="snack-grid">
                        {popularSnacks.map((snack) => (
                            <SnackCard
                                key={snack._id || snack.name}
                                product={snack}
                                onQuickView={(p) => setSelectedProduct(p)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* 5. Special Promotional Banner with Coupon Callout */}
            <section className="promo-banner-section">
                <div className="promo-banner-card" style={{ backgroundImage: `linear-gradient(135deg, rgba(249, 115, 22, 0.92), rgba(194, 65, 12, 0.95)), url(${banner})` }}>
                    <div className="promo-content">
                        <span className="promo-tag">LIMITED TIME SPECIAL</span>
                        <h2>Get 10% Instant Discount on Your First Munch!</h2>
                        <p>Apply Coupon Code <strong className="promo-coupon-badge">SAVE10</strong> at checkout on orders above ₹199.</p>
                        <div className="promo-actions">
                            <Link to="/product" className="btn-promo-cta">Order Now & Save</Link>
                            <span className="promo-terms">*Valid on all Chips, Namkeens & Chaklis</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Today's Special Deals Grid */}
            {specialDeals.length > 0 && (
                <section className="home-section special-deals-section">
                    <div className="section-header">
                        <div>
                            <span className="section-eyebrow">Special Discounts</span>
                            <h2 className="section-title">Today's Special Deals</h2>
                        </div>
                        <Link to="/product" className="view-all-link">Explore Deals →</Link>
                    </div>

                    <div className="snack-grid">
                        {specialDeals.map((snack) => (
                            <SnackCard
                                key={snack._id || snack.name}
                                product={snack}
                                onQuickView={(p) => setSelectedProduct(p)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* 7. Why Choose Crunchy Bite Section */}
            <section className="why-choose-section">
                <div className="why-choose-inner">
                    <h2 className="why-title">Why Crunchy Bite is Gujarat's #1 Snack Choice</h2>
                    <p className="why-subtitle">We believe authentic snacks make every conversation sweeter and tea-time crunchier.</p>

                    <div className="why-grid">
                        <div className="why-card">
                            <div className="why-number">01</div>
                            <h3>Traditional Recipes</h3>
                            <p>Authentic Kathiyawadi & Gujarati snacks crafted using time-tested heirloom recipes.</p>
                        </div>
                        <div className="why-card">
                            <div className="why-number">02</div>
                            <h3>Zero Compromise on Quality</h3>
                            <p>Prepared with 100% pure groundnut and desi ghee oils, no artificial preservatives.</p>
                        </div>
                        <div className="why-card">
                            <div className="why-number">03</div>
                            <h3>Instant Dispatch</h3>
                            <p>Orders are packed fresh and dispatched directly from our kitchen to your doorstep.</p>
                        </div>
                        <div className="why-card">
                            <div className="why-number">04</div>
                            <h3>Affordable Festive Packs</h3>
                            <p>Premium food ordering experience at pocket-friendly student and family prices.</p>
                        </div>
                    </div>
                </div>
            </section>

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

export default Hero;