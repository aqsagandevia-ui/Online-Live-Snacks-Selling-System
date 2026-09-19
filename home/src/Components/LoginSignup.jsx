import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import logo1 from '../images/logo1.png';
import '../styles/LoginSignup.css';

const LoginSignup = () => {
    const { login, register, loginAsAdminDemo, loginAsUserDemo } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    // Tab state: 'login' | 'register'
    const [isLoginTab, setIsLoginTab] = useState(true);

    // Login Form State
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    // Register Form State
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirmPassword, setRegConfirmPassword] = useState('');
    const [regLoading, setRegLoading] = useState(false);

    const from = location.state?.from?.pathname || '/';

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!loginIdentifier.trim() || !loginPassword) {
            toast.warning('Please enter username/email and password');
            return;
        }

        setLoginLoading(true);
        const result = await login(loginIdentifier, loginPassword);
        setLoginLoading(false);

        if (result.success) {
            toast.success(`Welcome back, ${result.user?.name || 'Snack Lover'}!`);
            if (result.user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate(from, { replace: true });
            }
        } else {
            toast.error(result.message || 'Login failed. Please verify credentials.');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (!regName.trim() || !regEmail.trim() || !regPassword) {
            toast.warning('Please fill in all required fields');
            return;
        }

        if (regPassword !== regConfirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (regPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setRegLoading(true);
        const result = await register(regName, regEmail, regPassword, regPhone);
        setRegLoading(false);

        if (result.success) {
            toast.success('Registration successful! Welcome to Crunchy Bite 🎉');
            navigate(from, { replace: true });
        } else {
            toast.error(result.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-card-container animate-fade-in">
                {/* Brand Header */}
                <div className="auth-header">
                    <img src={logo1} alt="Crunchy Bite" className="auth-logo" />
                    <h2>Crunchy Bite</h2>
                    <p>Order fresh, authentic snacks right to your doorstep</p>
                </div>

                {/* 1-Click Quick Demo Login Shortcuts (For MCA Viva & Testing) */}
                <div className="demo-shortcuts-box">
                    <span className="demo-shortcuts-title">⚡ Quick 1-Click Viva Demo:</span>
                    <div className="demo-shortcuts-grid">
                        <button
                            type="button"
                            onClick={async () => {
                                setLoginLoading(true);
                                const res = await loginAsUserDemo();
                                setLoginLoading(false);
                                if (res.success) {
                                    toast.success('Logged in as Customer Demo (Rahul)');
                                    navigate('/');
                                }
                            }}
                            className="btn-quick-demo customer-demo"
                        >
                            👤 Customer Demo
                        </button>

                        <button
                            type="button"
                            onClick={async () => {
                                setLoginLoading(true);
                                const res = await loginAsAdminDemo();
                                setLoginLoading(false);
                                if (res.success) {
                                    toast.success('Logged in as Admin (Aqsa)');
                                    navigate('/admin');
                                }
                            }}
                            className="btn-quick-demo admin-demo"
                        >
                            👑 Admin Demo
                        </button>
                    </div>
                </div>

                {/* Tabs: Sign In / Create Account */}
                <div className="auth-tabs">
                    <button
                        className={`auth-tab-btn ${isLoginTab ? 'active' : ''}`}
                        onClick={() => setIsLoginTab(true)}
                    >
                        Sign In
                    </button>
                    <button
                        className={`auth-tab-btn ${!isLoginTab ? 'active' : ''}`}
                        onClick={() => setIsLoginTab(false)}
                    >
                        Create Account
                    </button>
                </div>

                {/* 1. Sign In Form */}
                {isLoginTab ? (
                    <form onSubmit={handleLoginSubmit} className="auth-form animate-fade-in">
                        <div className="input-group">
                            <label>Email or Username</label>
                            <input
                                type="text"
                                placeholder="Enter email (e.g. admin@crunchybite.com)"
                                value={loginIdentifier}
                                onChange={(e) => setLoginIdentifier(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Enter password (e.g. admin123)"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                <input type="checkbox" defaultChecked /> Remember Me
                            </label>
                            <span style={{ color: 'var(--accent-primary)', cursor: 'pointer' }}>Forgot Password?</span>
                        </div>

                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="btn-primary-custom auth-submit-btn"
                        >
                            {loginLoading ? 'Signing in...' : 'Sign In'}
                        </button>

                        <p className="auth-switch-text">
                            Don't have an account yet?{' '}
                            <button type="button" onClick={() => setIsLoginTab(false)} className="switch-tab-link">
                                Create Account
                            </button>
                        </p>
                    </form>
                ) : (
                    /* 2. Create Account Form */
                    <form onSubmit={handleRegisterSubmit} className="auth-form animate-fade-in">
                        <div className="input-group">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                placeholder="e.g. Rahul Sharma"
                                value={regName}
                                onChange={(e) => setRegName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Email Address *</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={regEmail}
                                onChange={(e) => setRegEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                placeholder="10-digit mobile number"
                                value={regPhone}
                                onChange={(e) => setRegPhone(e.target.value)}
                            />
                        </div>

                        <div className="form-row-2">
                            <div className="input-group">
                                <label>Password *</label>
                                <input
                                    type="password"
                                    placeholder="Min 6 characters"
                                    value={regPassword}
                                    onChange={(e) => setRegPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Confirm *</label>
                                <input
                                    type="password"
                                    placeholder="Repeat password"
                                    value={regConfirmPassword}
                                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={regLoading}
                            className="btn-primary-custom auth-submit-btn"
                        >
                            {regLoading ? 'Creating Account...' : 'Register Account'}
                        </button>

                        <p className="auth-switch-text">
                            Already have an account?{' '}
                            <button type="button" onClick={() => setIsLoginTab(true)} className="switch-tab-link">
                                Sign In
                            </button>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginSignup;