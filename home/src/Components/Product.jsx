import React from "react";
import { useState } from "react";
import '../styles/Product.css'
const Product = ({addToCart }) => {
    const alert = () =>{
        alert("Added");
    }
    const [product] = useState([
        {
            url: "./photo/products1.webp",
            name: 'Farali Chevda',
            price: 10
        },
        {
            url: "./photo/products2.jpg",
            name: 'Crunchem Tomato Twist',
            price: 10
        },
        {
            url: "./photo/products3.avif",
            name: 'Aloo Sev',
            price: 5
        },
        {
            url: "./photo/products4.jpg",
            name: 'Garlic Sev Murmura',
            price: 10
        },
        {
            url: "./photo/products5.webp",
            name: 'Mad Angles',
            price: 5
        },
        {
            url: "./photo/products6.jpg",
            name: 'Golden Mixture',
            price: 20
        },
        {
            url: "./photo/products7.jpg",
            name: 'Soya Chips',
            price: 10
        },
        {
            url: "./photo/products8.webp",
            name: 'Bhavnagri Gathiya',
            price: 10
        },
        {
            url: "./photo/products9.jpg",
            name: 'Tikha Papdi Gathiya',
            price: 20
        },
        {
            url: "./photo/products10.jpg",
            name: 'Chana Jor Garam',
            price: 10
        }, 
        {
            url: "./photo/products11.jpg",
            name: 'Bhakharwadi',
            price: 30
        },
        {
            url: "./photo/products12.webp",
            name: 'Banana Wafers',
            price: 10
        },
        {
            url: "./photo/products13.jpg",
            name: 'Shing Bhujiya',
            price: 20
        },
        {
            url: "./photo/products14.webp",
            name: 'Cheese Balls',
            price: 10
        },
        {
            url: "./photo/products15.jpg",
            name: 'Masala KhaKhra',
            price: 30
        },
        {
            url: "./photo/products16.png",
            name: 'Shakarpara',
            price: 45
        },


    ])
    return (
        <>
            <h1>Products</h1>
            <br /><br />
            <div >
                <div style={{ display: "flex", flexWrap: "wrap"}}>
                    {
                        product.map((productItem, productIndex) => {
                            return (
                                <div style={{ paddingLeft: "15px", }} >
                                    
                                    <div className="card">
                                        <img src={productItem.url} className="img2" />
                                         <p style={{ fontSize: "40px", fontWeight:"600px",marginBottom:"-2px" }}>{productItem.name}</p>
                                        <p style={{ fontSize: "35px", color: "black" }}>
                                            <hr />
                                            &#8377;{productItem.price}
                                        </p>
                                        <div ><button className="addcart" onClick={() =>addToCart(productItem)}> Add To Cart</button>
                                        </div>
                                    </div>
                                </div>
                            )
                            
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default Product;