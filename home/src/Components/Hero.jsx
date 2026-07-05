import React from 'react';
import '../styles/Hero.css';
import { Link } from 'react-router-dom';
import header_img from '../images/header_img.jpg';
import header_img1 from '../images/header_img1.jpg';
import header_img2 from '../images/header_img2.jpg';
import header_img3 from '../images/header_img3.jpg';
import product1 from '../images/product1.jpg';
import product5 from '../images/product5.webp';
import product3 from '../images/product3.jpg';
import product4 from '../images/product4.jpg';
import banner from '../images/banner.jpg';
import category from '../images/category.jpg';
import category1 from '../images/category1.png';
import category2 from '../images/category2.png';

const Hero = () => {

    return (
        <>
            {/*<div id="carouselExample" class="carousel slide">
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img src={header_img} class="d-block w-100" alt="..." />
                    </div>
                    <div class="carousel-item">
                        <img src={header_img1} class="d-block w-100" alt="..." />
                    </div>
                    <div class="carousel-item">
                        <img src={header_img2} class="d-block w-100" alt="..." />
                    </div>
                    <div class="carousel-item">
                        <img src={header_img3} class="d-block w-100" alt="..." />
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>*/}
                <div id="carouselExample" class="carousel slide">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img src={header_img} class="d-block w-100" alt="..."/>
                        </div>
                        <div class="carousel-item">
                            <img src={header_img1} class="d-block w-100" alt="..."/>
                        </div>
                        <div class="carousel-item">
                            <img src={header_img2} class="d-block w-100" alt="..."/>
                        </div>
                        <div class="carousel-item">
                            <img src={header_img3} class="d-block w-100" alt="..."/>
                        </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            

            <div className="content">
                <h1> Best Product</h1>
                <div className="highlighted-products">
                    <div className="product">
                        <img src={product1} alt="aloo bhujiya" />
                        <div className='card-content'>
                            <h3>Aloo Bhujiya</h3>
                        </div>
                    </div>
                    <div className="product">
                        <img src={product5} alt="combo" />
                        <h3>Namkeen Combo</h3>
                    </div>
                    <div className="product">
                        <img src={product3} alt="Chips" />
                        <h3>Potato Chips</h3>
                    </div>
                    <div className="product">
                        <img src={product4} alt="Chakli" />
                        <h3>Chakli</h3>
                    </div>
                </div>
            </div>
            <div className='banner'>
                <img src={banner} alt="banner" />
            </div>
            <div className="category-content">
                <h1>Category</h1>
                <div className="highlighted-category">
                    <div className="category">
                        <Link to="/Chip"><img src={category} alt="chips" /></Link>
                        <div className='card-content'>
                            <h3>Chips</h3>
                        </div>
                    </div>
                    <div className="category">
                        <Link to="/Namkeen"><img src={category1} alt="combo" /></Link>
                        <h3>Namkeen</h3>
                    </div>
                    <div className="category">
                        <Link to='/Corn'><img src={category2} alt="Cornsnack" /></Link>
                        <h3>Corn Snacks</h3>
                    </div>
                    <div className="category">
                        <Link to='/Chakli'><img src={product4} alt="Chakli" /></Link>
                        <h3>Chakli</h3>
                    </div>
                </div>
            </div>

        </>
    );
}

export default Hero;