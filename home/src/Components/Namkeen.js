import React from "react";
import { useState } from "react";
import '../styles/Namkeen.css'
const Namkeen = ({addToCart }) => {
    const alert = () =>{
        alert("Added");
    }
    const [product] = useState([
        {
            url: "./photo/namkken1.webp",
            name: 'Namkeen Mixture',
            price: 50
        },
        {
            url: "./photo/namkeen2.webp",
            name: 'Jeera Namkeen Cookies',
            price: 100
        },
        {
            url: "./photo/namkeen3.webp",
            name: 'Marwari Bhujiya ',
            price: 100
        },
        {
            url: "./photo/namkeen4.webp",
            name: 'Lite Chiwda',
            price: 150
        },
        {
            url: "./photo/namkeen5.webp",
            name: 'Navratn Mix',
            price: 60
        },
        {
            url: "./photo/namkeen6.webp",
            name: 'Lemon Bhel',
            price: 40
        },
        {
            url: "./photo/namkeen7.webp",
            name: 'Khatta Meetha',
            price: 50
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
            url: "./photo/namkeen12.webp",
            name: 'Kaju Kashmiri mix',
            price: 50
        },
        {
            url: "./photo/products13.jpg",
            name: 'Shing Bhujiya',
            price: 20
        },
        {
            url: "./photo/namkeen14.webp",
            name: 'Farali Chiwda',
            price: 60
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
            <h1>Namkeen</h1>
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

export default Namkeen;