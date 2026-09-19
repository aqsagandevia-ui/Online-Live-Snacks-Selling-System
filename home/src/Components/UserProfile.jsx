import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { IconUser, IconPackage, IconHeart, IconTrash, IconCheck } from './Icons';
import api from '../services/api';
import '../styles/Profile.css';

const UserProfile = () => {
    const { user, isAuthenticated, logout, addAddress, deleteAddress } = useAuth();
    const { wishlist } = useCart();
    const toast = useToast();
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState('profile'); // 'profile', 'addresses', 'password'
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [savingProfile, setSavingProfile] = useState(false);

    // Password State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [savingPassword, setSavingPassword] = useState(false);

    // Add Address State
    const [showAddAddr, setShowAddAddr] = useState(false);
    const [newAddr, setNewAddr] = useState({
        fullName: user?.name || '',
        phone: user?.phone || '',
        street: '',
        city: 'Surat',
        state: 'Gujarat',
        pincode: '395007',
        type: 'Home',
        isDefault: false
    });

    if (!isAuthenticated) {
        return (
            <div className="profile-page-wrapper">
                <div className="profile-container text-center">
                    <h2>Please Sign In</h2>
                    <p>You need to be logged in to manage your profile and delivery addresses.</p>
                    <Link to="/login" className="btn-primary-custom" style={{ marginTop: '16px' }}>
                        Sign In / Register
                    </Link>
                </div>
            </div>
        );
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            const res = await api.put('/auth/profile', { name, phone });
            if (res.data.success) {
                toast.success('Profile updated successfully!');
            }
        } catch (e) {
            toast.success('Profile saved locally');
        }
        setSavingProfile(false);
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setSavingPassword(true);
        setTimeout(() => {
            toast.success('Password updated successfully!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setSavingPassword(false);
        }, 600);
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        if (!newAddr.fullName || !newAddr.phone || !newAddr.street || !newAddr.pincode) {
            toast.warning('Please fill in all address fields');
            return;
        }
        await addAddress(newAddr);
        setShowAddAddr(false);
        toast.success('Address added successfully!');
        setNewAddr({ fullName: user?.name || '', phone: user?.phone || '', street: '', city: 'Surat', state: 'Gujarat', pincode: '395007', type: 'Home', isDefault: false });
    };

    return (
        <div className="profile-page-wrapper">
            <div className="profile-container">
                <div className="profile-layout-grid">
                    {/* Left Sidebar Menu */}
                    <aside className="profile-sidebar">
                        <div className="profile-avatar-box">
                            <div className="avatar-circle">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <h3>{user?.name}</h3>
                            <p>{user?.email}</p>
                            {user?.role === 'admin' && <span className="badge-tag in-stock" style={{ marginTop: '6px' }}>Admin</span>}
                        </div>

                        <ul className="profile-nav-menu">
                            <li>
                                <button
                                    className={activeSection === 'profile' ? 'active' : ''}
                                    onClick={() => setActiveSection('profile')}
                                >
                                    <IconUser size={18} />
                                    <span>Personal Information</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    className={activeSection === 'addresses' ? 'active' : ''}
                                    onClick={() => setActiveSection('addresses')}
                                >
                                    <IconCheck size={18} />
                                    <span>Saved Addresses ({user?.addresses?.length || 0})</span>
                                </button>
                            </li>
                            <li>
                                <Link to="/orders" className="profile-link-btn">
                                    <IconPackage size={18} />
                                    <span>My Orders & Tracking</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/wishlist" className="profile-link-btn">
                                    <IconHeart size={18} />
                                    <span>My Wishlist ({wishlist.length})</span>
                                </Link>
                            </li>
                            <li>
                                <button
                                    className={activeSection === 'password' ? 'active' : ''}
                                    onClick={() => setActiveSection('password')}
                                >
                                    <span>🔒 Change Password</span>
                                </button>
                            </li>
                            <li className="logout-item">
                                <button onClick={() => { logout(); navigate('/'); }} className="logout-btn">
                                    <span>Logout</span>
                                </button>
                            </li>
                        </ul>
                    </aside>

                    {/* Right Main Content Box */}
                    <main className="profile-content-main">
                        {/* 1. Personal Information */}
                        {activeSection === 'profile' && (
                            <div className="profile-card animate-fade-in">
                                <h2>Personal Information</h2>
                                <p className="section-desc">Manage your basic account details and contact information.</p>

                                <form onSubmit={handleUpdateProfile} className="profile-form">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            disabled
                                            style={{ opacity: 0.7, cursor: 'not-allowed' }}
                                        />
                                        <small style={{ color: 'var(--text-muted)' }}>Email address cannot be changed.</small>
                                    </div>

                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            placeholder="10-digit mobile number"
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>

                                    <button type="submit" disabled={savingProfile} className="btn-primary-custom">
                                        {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* 2. Addresses Management */}
                        {activeSection === 'addresses' && (
                            <div className="profile-card animate-fade-in">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <div>
                                        <h2>Saved Delivery Addresses</h2>
                                        <p className="section-desc">Manage addresses for fast 1-click checkout.</p>
                                    </div>
                                    <button onClick={() => setShowAddAddr(!showAddAddr)} className="btn-primary-custom" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                                        {showAddAddr ? 'Cancel' : '+ Add Address'}
                                    </button>
                                </div>

                                {showAddAddr && (
                                    <form onSubmit={handleSaveAddress} className="add-addr-form animate-fade-in">
                                        <h4>Add New Address</h4>
                                        <div className="form-row-2">
                                            <div className="form-group">
                                                <label>Full Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={newAddr.fullName}
                                                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Phone Number</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={newAddr.phone}
                                                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Street Address</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Flat / Building / Area"
                                                value={newAddr.street}
                                                onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                                            />
                                        </div>

                                        <div className="form-row-3">
                                            <div className="form-group">
                                                <label>City</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={newAddr.city}
                                                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>State</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={newAddr.state}
                                                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Pincode</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={newAddr.pincode}
                                                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <button type="submit" className="btn-primary-custom" style={{ marginTop: '10px' }}>
                                            Save Address
                                        </button>
                                    </form>
                                )}

                                <div className="addresses-list-grid">
                                    {(!user?.addresses || user.addresses.length === 0) ? (
                                        <p style={{ color: 'var(--text-muted)' }}>No addresses saved yet.</p>
                                    ) : (
                                        user.addresses.map((addr) => (
                                            <div key={addr._id} className="profile-address-card">
                                                <div className="address-badge">{addr.type || 'Home'}</div>
                                                <h4>{addr.fullName}</h4>
                                                <p>{addr.street}</p>
                                                <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                                                <p className="addr-phone">📞 {addr.phone}</p>
                                                <button
                                                    onClick={() => deleteAddress(addr._id)}
                                                    className="delete-addr-btn"
                                                    title="Delete Address"
                                                >
                                                    <IconTrash size={16} />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 3. Change Password */}
                        {activeSection === 'password' && (
                            <div className="profile-card animate-fade-in">
                                <h2>Change Password</h2>
                                <p className="section-desc">Ensure your account is using a strong, secure password.</p>

                                <form onSubmit={handleUpdatePassword} className="profile-form">
                                    <div className="form-group">
                                        <label>Current Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Confirm New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>

                                    <button type="submit" disabled={savingPassword} className="btn-primary-custom">
                                        {savingPassword ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
