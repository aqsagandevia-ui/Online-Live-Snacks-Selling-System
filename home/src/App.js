import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components & Pages
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import MobileBottomNav from './Components/MobileBottomNav';
import Home from './Components/Home';
import Product from './Components/Product';
import Cart from './Components/Cart';
import Checkout from './Components/Checkout';
import MyOrders from './Components/MyOrders';
import OrderTracking from './Components/OrderTracking';
import UserProfile from './Components/UserProfile';
import Wishlist from './Components/Wishlist';
import LoginSignup from './Components/LoginSignup';
import Aboutus from './Components/Aboutus';
import Contactus from './Components/Contactus';
import Chips from './Components/Chips';
import Namkeen from './Components/Namkeen';
import Corn from './Components/Corn';
import Chakli from './Components/Chakli';
import AdminPage from './Components/adminpage';

// Global Styles
import './styles/theme.css';
import './styles/App.css';

// 404 Not Found Component
const NotFound = () => (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--accent-primary)', marginBottom: '8px' }}>404</h1>
        <h2>Oops! Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '8px 0 24px' }}>
            The snack page you're looking for seems to have been munched away.
        </p>
        <Link to="/" className="btn-primary-custom">
            Return to Crunchy Home
        </Link>
    </div>
);

const App = () => {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AuthProvider>
                    <CartProvider>
                        <Router>
                            <div className="crunchy-app-root">
                                <Navbar />
                                <main className="crunchy-main-content">
                                    <Routes>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/product" element={<Product />} />
                                        <Route path="/cart" element={<Cart />} />
                                        <Route path="/checkout" element={<Checkout />} />
                                        <Route path="/orders" element={<MyOrders />} />
                                        <Route path="/track/:orderId" element={<OrderTracking />} />
                                        <Route path="/wishlist" element={<Wishlist />} />
                                        <Route path="/profile" element={<UserProfile />} />
                                        <Route path="/login" element={<LoginSignup />} />
                                        <Route path="/aboutus" element={<Aboutus />} />
                                        <Route path="/contactus" element={<Contactus />} />
                                        <Route path="/Chip" element={<Chips />} />
                                        <Route path="/Namkeen" element={<Namkeen />} />
                                        <Route path="/Corn" element={<Corn />} />
                                        <Route path="/Chakli" element={<Chakli />} />
                                        
                                        {/* Admin Routes */}
                                        <Route path="/admin" element={<AdminPage />} />
                                        <Route path="/adminpage" element={<AdminPage />} />
                                        <Route path="/ProductForm" element={<AdminPage />} />
                                        <Route path="/ProductTable" element={<AdminPage />} />

                                        {/* Fallback 404 */}
                                        <Route path="*" element={<NotFound />} />
                                    </Routes>
                                </main>
                                <Footer />
                                <MobileBottomNav />
                            </div>
                        </Router>
                    </CartProvider>
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    );
};

export default App;
