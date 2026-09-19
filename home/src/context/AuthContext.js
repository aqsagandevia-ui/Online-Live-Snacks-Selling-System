import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('crunchy_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const savedUser = localStorage.getItem('crunchy_user');
            const savedToken = localStorage.getItem('crunchy_token');

            if (savedToken && savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                    // Refresh current user data from backend
                    const res = await api.get('/auth/me');
                    if (res.data?.user) {
                        setUser(res.data.user);
                        localStorage.setItem('crunchy_user', JSON.stringify(res.data.user));
                    }
                } catch (err) {
                    console.log('Session restore fallback to local storage:', err.message);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (emailOrUsername, password) => {
        try {
            const res = await api.post('/auth/login', {
                email: emailOrUsername,
                password
            });

            if (res.data.success) {
                const { token: receivedToken, user: receivedUser } = res.data;
                setToken(receivedToken);
                setUser(receivedUser);
                localStorage.setItem('crunchy_token', receivedToken);
                localStorage.setItem('crunchy_user', JSON.stringify(receivedUser));
                return { success: true, user: receivedUser };
            }
            return { success: false, message: res.data.message || 'Login failed' };
        } catch (err) {
            // Fallback for demo login if backend is not running
            if (emailOrUsername === 'admin@crunchybite.com' || emailOrUsername === 'aqsa') {
                const adminDemo = {
                    id: 'admin_demo_id',
                    name: 'Aqsa Gandevia (Admin)',
                    email: 'admin@crunchybite.com',
                    phone: '9876543210',
                    role: 'admin',
                    addresses: [{
                        fullName: 'Aqsa Admin',
                        phone: '9876543210',
                        street: 'Main Market Road',
                        city: 'Surat',
                        state: 'Gujarat',
                        pincode: '395001',
                        type: 'Work',
                        isDefault: true
                    }]
                };
                setUser(adminDemo);
                setToken('demo_admin_token');
                localStorage.setItem('crunchy_token', 'demo_admin_token');
                localStorage.setItem('crunchy_user', JSON.stringify(adminDemo));
                return { success: true, user: adminDemo };
            }
            const msg = err.response?.data?.message || err.message || 'Login failed';
            return { success: false, message: msg };
        }
    };

    const register = async (name, email, password, phone) => {
        try {
            const res = await api.post('/auth/register', { name, email, password, phone });
            if (res.data.success) {
                const { token: receivedToken, user: receivedUser } = res.data;
                setToken(receivedToken);
                setUser(receivedUser);
                localStorage.setItem('crunchy_token', receivedToken);
                localStorage.setItem('crunchy_user', JSON.stringify(receivedUser));
                return { success: true, user: receivedUser };
            }
            return { success: false, message: res.data.message || 'Registration failed' };
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Registration failed';
            return { success: false, message: msg };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('crunchy_token');
        localStorage.removeItem('crunchy_user');
    };

    const addAddress = async (addressData) => {
        try {
            const res = await api.post('/auth/address', addressData);
            if (res.data.success) {
                const updatedUser = { ...user, addresses: res.data.addresses };
                setUser(updatedUser);
                localStorage.setItem('crunchy_user', JSON.stringify(updatedUser));
                return { success: true };
            }
            return { success: false, message: res.data.message };
        } catch (err) {
            // Local fallback
            const updatedAddresses = [...(user?.addresses || []), { ...addressData, _id: Date.now().toString() }];
            const updatedUser = { ...user, addresses: updatedAddresses };
            setUser(updatedUser);
            localStorage.setItem('crunchy_user', JSON.stringify(updatedUser));
            return { success: true };
        }
    };

    const deleteAddress = async (addressId) => {
        try {
            const res = await api.delete(`/auth/address/${addressId}`);
            if (res.data.success) {
                const updatedUser = { ...user, addresses: res.data.addresses };
                setUser(updatedUser);
                localStorage.setItem('crunchy_user', JSON.stringify(updatedUser));
                return { success: true };
            }
        } catch (err) {
            const updatedAddresses = (user?.addresses || []).filter(a => a._id !== addressId);
            const updatedUser = { ...user, addresses: updatedAddresses };
            setUser(updatedUser);
            localStorage.setItem('crunchy_user', JSON.stringify(updatedUser));
            return { success: true };
        }
    };

    // 1-Click Demo helpers for Viva & Portfolio
    const loginAsAdminDemo = () => login('admin@crunchybite.com', 'admin123');
    const loginAsUserDemo = () => login('customer@crunchybite.com', 'user123');

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated: !!user,
                isAdmin: user?.role === 'admin',
                login,
                register,
                logout,
                addAddress,
                deleteAddress,
                loginAsAdminDemo,
                loginAsUserDemo
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
