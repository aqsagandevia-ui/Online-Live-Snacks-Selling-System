import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import logo1 from '../images/logo1.png';
import {
  IconSearch,
  IconCart,
  IconHeart,
  IconUser,
  IconSun,
  IconMoon,
  IconMenu,
  IconClose
} from './Icons';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout, loginAsAdminDemo, loginAsUserDemo } = useAuth();
  const { cartCount, wishlist } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSuggestions(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Handle Search Input & Suggestions
  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const delayDebounce = setTimeout(async () => {
        try {
          const res = await api.get(`/products?search=${encodeURIComponent(searchTerm)}`);
          setSuggestions(res.data.slice(0, 5));
          setShowSuggestions(true);
        } catch (e) {
          setSuggestions([]);
        }
      }, 250);
      return () => clearTimeout(delayDebounce);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  // Click outside to close search suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (prod) => {
    setSearchTerm('');
    setShowSuggestions(false);
    navigate(`/product?search=${encodeURIComponent(prod.name)}`);
  };

  return (
    <header className="crunchy-navbar-wrapper">
      {/* Top Banner Notice */}
      <div className="navbar-top-announcement">
        <div className="announcement-content">
          <span>⚡ <strong>30-Min Fast Delivery</strong> in Surat & Gujarat! Use Code <strong>SAVE10</strong> for 10% OFF</span>
          <div className="demo-quick-links">
            {!isAuthenticated ? (
              <>
                <button onClick={loginAsUserDemo} className="demo-btn user-demo">👤 1-Click User Demo</button>
                <button onClick={loginAsAdminDemo} className="demo-btn admin-demo">👑 1-Click Admin Demo</button>
              </>
            ) : (
              <span className="logged-in-tag">Logged in as <strong>{user?.name}</strong> ({user?.role})</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="crunchy-main-navbar">
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="brand-logo">
            <img src={logo1} alt="Crunchy Bite Logo" className="logo-img" />
            <div className="brand-text">
              <span className="brand-title">CRUNCHY BITE</span>
              <span className="brand-tagline">Fresh & Crisp Snacks</span>
            </div>
          </Link>

          {/* Search Bar with Autocomplete Suggestions */}
          <div className="nav-search-box" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="search-form">
              <IconSearch size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search chips, chakli, sev, namkeen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
              />
              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm('')} className="clear-search-btn">
                  ×
                </button>
              )}
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions-dropdown">
                {suggestions.map((item) => (
                  <div
                    key={item._id}
                    className="suggestion-item"
                    onClick={() => handleSelectSuggestion(item)}
                  >
                    <img src={item.image || '/photo/products1.webp'} alt={item.name} />
                    <div className="suggestion-info">
                      <p className="suggestion-name">{item.name}</p>
                      <span className="suggestion-price">₹{item.discountPrice || item.price} • <span className="cat-pill">{item.category}</span></span>
                    </div>
                  </div>
                ))}
                <div className="suggestion-footer" onClick={handleSearchSubmit}>
                  Search all results for "<strong>{searchTerm}</strong>" →
                </div>
              </div>
            )}
          </div>

          {/* Desktop Nav Links */}
          <ul className="desktop-nav-links">
            <li>
              <Link to="/" className={location.pathname === '/' ? 'active-link' : ''}>Home</Link>
            </li>
            <li className="dropdown-link-container">
              <Link to="/product" className={location.pathname.startsWith('/product') ? 'active-link' : ''}>
                All Snacks ▾
              </Link>
              <div className="dropdown-menu-custom">
                <Link to="/product">All Categories</Link>
                <Link to="/Chip">Potato & Veggie Chips</Link>
                <Link to="/Namkeen">Authentic Namkeens</Link>
                <Link to="/Corn">Roasted Corn Snacks</Link>
                <Link to="/Chakli">Crispy Chakli & Murukku</Link>
              </div>
            </li>
            <li>
              <Link to="/aboutus" className={location.pathname === '/aboutus' ? 'active-link' : ''}>About Us</Link>
            </li>
            <li>
              <Link to="/contactus" className={location.pathname === '/contactus' ? 'active-link' : ''}>Contact</Link>
            </li>
            {isAdmin && (
              <li>
                <Link to="/admin" className="admin-badge-link">Admin Dashboard</Link>
              </li>
            )}
          </ul>

          {/* Right Action Icons */}
          <div className="nav-actions">
            {/* Dark / Light Mode Toggle */}
            <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Dark/Light Mode">
              {theme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
            </button>

            {/* Wishlist Icon */}
            <Link to="/wishlist" className="action-icon-link" title="My Wishlist">
              <IconHeart size={22} color="var(--text-primary)" />
              {wishlist.length > 0 && <span className="badge-count wishlist-count">{wishlist.length}</span>}
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="action-icon-link cart-action-btn" title="Shopping Cart">
              <IconCart size={22} />
              {cartCount > 0 && <span className="badge-count cart-count">{cartCount}</span>}
            </Link>

            {/* User Profile / Auth */}
            {isAuthenticated ? (
              <div className="user-profile-menu">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="user-profile-btn"
                >
                  <IconUser size={18} />
                  <span className="user-name-text">{user?.name?.split(' ')[0]}</span>
                </button>

                {userDropdownOpen && (
                  <div className="user-dropdown-popover">
                    <div className="user-dropdown-header">
                      <p className="user-full-name">{user?.name}</p>
                      <p className="user-email-text">{user?.email}</p>
                      {isAdmin && <span className="admin-pill">Administrator</span>}
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/profile" onClick={() => setUserDropdownOpen(false)}>My Profile</Link>
                    <Link to="/orders" onClick={() => setUserDropdownOpen(false)}>My Orders</Link>
                    <Link to="/wishlist" onClick={() => setUserDropdownOpen(false)}>Saved Wishlist</Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserDropdownOpen(false)} className="admin-link">
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="dropdown-divider"></div>
                    <button onClick={() => { logout(); setUserDropdownOpen(false); }} className="logout-action-btn">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons-group">
                <Link to="/login" className="btn-login-outline">Login</Link>
                <Link to="/login" className="btn-signup-primary">Register</Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hamburger-btn"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <IconClose size={26} /> : <IconMenu size={26} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="brand-logo">
                <img src={logo1} alt="Crunchy Bite" className="logo-img" />
                <span className="brand-title">CRUNCHY BITE</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="drawer-close-btn">
                <IconClose size={24} />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mobile-search-form">
              <IconSearch size={18} />
              <input
                type="text"
                placeholder="Search all snacks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>

            <ul className="mobile-nav-list">
              <li>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>🏠 Home</Link>
              </li>
              <li>
                <Link to="/product" onClick={() => setMobileMenuOpen(false)}>🍿 All Snacks Catalog</Link>
              </li>
              <li>
                <Link to="/Chip" onClick={() => setMobileMenuOpen(false)}>🥔 Chips & Crisps</Link>
              </li>
              <li>
                <Link to="/Namkeen" onClick={() => setMobileMenuOpen(false)}>🥜 Authentic Namkeens</Link>
              </li>
              <li>
                <Link to="/Corn" onClick={() => setMobileMenuOpen(false)}>🌽 Roasted Corn Snacks</Link>
              </li>
              <li>
                <Link to="/Chakli" onClick={() => setMobileMenuOpen(false)}>🌀 Spiced Chakli & Murukku</Link>
              </li>
              <li>
                <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>🛒 Shopping Cart ({cartCount})</Link>
              </li>
              <li>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>📦 My Orders & Tracking</Link>
              </li>
              <li>
                <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>❤️ My Wishlist ({wishlist.length})</Link>
              </li>
              <li>
                <Link to="/aboutus" onClick={() => setMobileMenuOpen(false)}>ℹ️ About Us</Link>
              </li>
              <li>
                <Link to="/contactus" onClick={() => setMobileMenuOpen(false)}>📞 Contact Us</Link>
              </li>
              {isAdmin && (
                <li>
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="mobile-admin-link">
                    ⚙️ Admin Dashboard
                  </Link>
                </li>
              )}
            </ul>

            <div className="mobile-drawer-footer">
              {!isAuthenticated ? (
                <div className="mobile-auth-btns">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-login-outline">Sign In</Link>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-signup-primary">Register</Link>
                </div>
              ) : (
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="mobile-logout-btn">
                  Logout ({user?.name})
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;