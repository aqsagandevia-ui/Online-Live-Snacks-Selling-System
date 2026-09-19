import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { IconHome, IconGrid, IconCart, IconPackage, IconUser } from './Icons';

const MobileBottomNav = () => {
    const { cartCount } = useCart();
    const { isAuthenticated } = useAuth();

    return (
        <div
            className="mobile-bottom-nav"
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '62px',
                backgroundColor: 'var(--bg-surface)',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                zIndex: 900,
                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
            }}
        >
            <NavLink
                to="/"
                style={({ isActive }) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'
                })}
            >
                <IconHome size={20} />
                <span>Home</span>
            </NavLink>

            <NavLink
                to="/product"
                style={({ isActive }) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'
                })}
            >
                <IconGrid size={20} />
                <span>Menu</span>
            </NavLink>

            <NavLink
                to="/cart"
                style={({ isActive }) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    position: 'relative',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'
                })}
            >
                <div style={{ position: 'relative' }}>
                    <IconCart size={20} />
                    {cartCount > 0 && (
                        <span
                            style={{
                                position: 'absolute',
                                top: '-6px',
                                right: '-10px',
                                background: '#ef4444',
                                color: 'white',
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                width: '17px',
                                height: '17px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {cartCount}
                        </span>
                    )}
                </div>
                <span>Cart</span>
            </NavLink>

            <NavLink
                to="/orders"
                style={({ isActive }) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'
                })}
            >
                <IconPackage size={20} />
                <span>Orders</span>
            </NavLink>

            <NavLink
                to={isAuthenticated ? "/profile" : "/login"}
                style={({ isActive }) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'
                })}
            >
                <IconUser size={20} />
                <span>{isAuthenticated ? 'Profile' : 'Sign In'}</span>
            </NavLink>

            <style>{`
                @media (min-width: 769px) {
                    .mobile-bottom-nav {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default MobileBottomNav;
