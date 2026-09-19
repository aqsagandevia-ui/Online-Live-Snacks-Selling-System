import React from 'react';
import h1_img from '../images/h1_img.png';
import '../styles/Aboutus.css';

const Aboutus = () => {
    return (
        <div className="about-page-wrapper">
            <div className="about-hero-strip">
                <span className="about-tag">Our Story</span>
                <h1>Welcome to Crunchy Bite</h1>
                <p>Delivering authentic, crunchy Indian snacks and savories across Gujarat & beyond.</p>
            </div>

            <div className="about-container">
                <div className="about-story-grid">
                    <div className="about-text-content">
                        <h2>Handcrafted Tradition with Modern Crunch</h2>
                        <p>
                            At <strong>Crunchy Bite</strong>, we specialize in celebrating the rich heritage of Indian farsan, namkeens, chaklis, and gourmet potato crisps. Every batch is crafted in hygienic kitchens using pure ingredients, traditional recipes, and authentic spices that evoke festive memories.
                        </p>
                        <p>
                            From classic <em>Bhavnagri Gathiya</em> and <em>Spiced Chakli</em> to zesty <em>Peri Peri Chips</em> and <em>Cheezy Corn Puffs</em>, we cater to every sweet, spicy, and savoury craving. Order online and get freshly packed delicacies delivered directly to your door in 30 minutes!
                        </p>

                        <div className="about-values-grid">
                            <div className="val-card">
                                <span className="val-icon">🌿</span>
                                <h4>100% Vegetarian</h4>
                                <p>Strictly pure vegetarian snacks made with genuine ingredients.</p>
                            </div>
                            <div className="val-card">
                                <span className="val-icon">🔥</span>
                                <h4>Fresh Daily Frying</h4>
                                <p>Prepared daily so you experience maximum crunch in every bite.</p>
                            </div>
                        </div>
                    </div>

                    <div className="about-visual-box">
                        <img src={h1_img} alt="Crunchy Bite Snacks" className="about-main-img" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Aboutus;