import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import '../styles/Contactus.css';

const Contactus = () => {
    const toast = useToast();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            toast.warning('Please fill in all required fields');
            return;
        }

        setSubmitting(true);
        setTimeout(() => {
            toast.success('Thank you! Your message has been sent to the Crunchy Bite team.');
            setFormData({ name: '', email: '', phone: '', message: '' });
            setSubmitting(false);
        }, 600);
    };

    return (
        <div className="contact-page-wrapper">
            <div className="contact-hero-strip">
                <span className="contact-tag">Get in Touch</span>
                <h1>Contact Crunchy Bite</h1>
                <p>Have questions about our snacks, bulk catering, or delivery? We'd love to help!</p>
            </div>

            <div className="contact-container">
                <div className="contact-layout-grid">
                    {/* Left: Contact Info Cards */}
                    <div className="contact-info-cards">
                        <div className="contact-card">
                            <span className="contact-card-icon">📍</span>
                            <h3>Kitchen & Head Office</h3>
                            <p>Main Market Road, Near City Mall, Surat, Gujarat - 395001</p>
                        </div>

                        <div className="contact-card">
                            <span className="contact-card-icon">📞</span>
                            <h3>Customer Support Hotline</h3>
                            <p>+91 98765 43210 / +91 98989 89898</p>
                            <span className="contact-sub">Available daily: 9:00 AM – 10:00 PM</span>
                        </div>

                        <div className="contact-card">
                            <span className="contact-card-icon">✉️</span>
                            <h3>Email Us</h3>
                            <p>support@crunchybite.com</p>
                            <span className="contact-sub">Average response time: &lt; 2 hours</span>
                        </div>
                    </div>

                    {/* Right: Message Form */}
                    <div className="contact-form-card">
                        <h2>Send Us a Message</h2>
                        <p className="form-subtext">Fill out the form below and our customer team will get back to you promptly.</p>

                        <form onSubmit={handleSubmit} className="contact-form-inner">
                            <div className="form-group">
                                <label>Your Full Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Rahul Sharma"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="form-row-2">
                                <div className="form-group">
                                    <label>Email Address *</label>
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="10-digit mobile"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Your Message / Query *</label>
                                <textarea
                                    rows="4"
                                    placeholder="How can we assist you today? (Orders, bulk packs, feedback)"
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <button type="submit" disabled={submitting} className="btn-primary-custom" style={{ width: '100%', padding: '14px' }}>
                                {submitting ? 'Sending Message...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contactus;