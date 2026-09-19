import React from 'react';
import { Link } from 'react-router-dom';
import logo1 from '../images/logo1.png';
import instagram_icon from '../images/instagram_icon.png';
import pintester_icon from '../images/pintester_icon.png';
import whatsapp_icon from '../images/whatsapp_icon.png';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="crunchy-footer-root">
      <div className="footer-main-container">
        <div className="footer-grid">
          {/* Column 1: Brand Info */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <img src={logo1} alt="Crunchy Bite" />
              <div className="footer-brand-text">
                <h2>CRUNCHY BITE</h2>
                <span>Fresh & Crisp Indian Snacks</span>
              </div>
            </div>
            <p className="footer-about-summary">
              Gujarat's favourite destination for authentic namkeens, freshly fried potato chips, spiced chaklis, and celebratory snack combos. Delivered fresh in 30 minutes!
            </p>
            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                <img src={instagram_icon} alt="Instagram" />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                <img src={pintester_icon} alt="Pinterest" />
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                <img src={whatsapp_icon} alt="WhatsApp" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-links-col">
            <h4>Quick Navigation</h4>
            <ul>
              <li><Link to="/">Home Page</Link></li>
              <li><Link to="/product">All Snacks Menu</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><Link to="/orders">My Orders & Live Tracking</Link></li>
              <li><Link to="/wishlist">Saved Wishlist</Link></li>
              <li><Link to="/aboutus">Our Story (About Us)</Link></li>
              <li><Link to="/contactus">Help & Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="footer-links-col">
            <h4>Top Categories</h4>
            <ul>
              <li><Link to="/Chip">Potato & Banana Chips</Link></li>
              <li><Link to="/Namkeen">Authentic Namkeens</Link></li>
              <li><Link to="/Corn">Roasted Corn Snacks</Link></li>
              <li><Link to="/Chakli">Spiced Chakli & Murukku</Link></li>
              <li><Link to="/product?category=Special+Combos">Festive & Party Combos</Link></li>
            </ul>
          </div>

          {/* Column 4: Kitchen Info & Delivery Hours */}
          <div className="footer-info-col">
            <h4>Delivery & Kitchen</h4>
            <p><strong>📍 Kitchen Location:</strong> Halar Road, Valsad, Gujarat - 396001</p>
            <p><strong>⏱ Delivery Hours:</strong> 9:00 AM – 11:00 PM (Mon – Sun)</p>
            <p><strong>⚡ Express Service:</strong> 30-Minute Guaranteed Delivery</p>
            <div className="footer-badges">
              <span className="badge-tag in-stock">100% Pure Veg</span>
              <span className="badge-tag accent">Daily Fresh</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} Crunchy Bite — Online Live Snacks Selling System. All Rights Reserved.</p>
          {/* <div className="footer-meta-links">
            <span>MCA Project Demonstration Edition</span>
            <span>•</span>
            <Link to="/admin">Admin Portal</Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;