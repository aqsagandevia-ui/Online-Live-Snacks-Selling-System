// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import '../Style/Product.css'

// const Product = ({ setCart }) => {
//   const [products] = useState([
//     { id: 1, name: 'Milk Cake', price: 999, img: 'milkcake.webp' },
//     { id: 2, name: 'Gulab Jamun', price: 899, img: 'gulabjamun.webp' },
//     { id: 3, name: 'Rasgulla', price: 699, img: 'rasgulla.webp' },
//     { id: 4, name: 'Jalebi', price: 799, img: 'jalebi.webp' },
//     { id: 5, name: 'Soan Papdi', price: 749, img: 'soan.jpg' },
//     { id: 6, name: 'Rasmalai', price: 649, img: 'rasmalai.jpg' },
//     { id: 7, name: 'Anjeer Pista Roll', price: 649, img: 'anjeerpistaroll.webp' },
//     { id: 8, name: 'Suterfeni', price: 649, img: 'suterfeni.webp' },
//     { id: 9, name: 'laddu', price: 699, img: 'laddu.webp' },
//     { id: 10, name: 'Kaju Katli', price: 799, img: 'kajukatli.webp' },

//   ]);

//   const addToCart = (product) => {
//     setCart(prevCart => {
//       const exists = prevCart.find(item => item.id === product.id);
//       if (exists) {
//         return prevCart.map(item =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       } else {
//         return [...prevCart, { ...product, quantity: 1 }];
//       }
//     });
//   };

//   return (
//     <div className="product-gallery">
//       <h1>Sweet Products</h1>
//       <div className="products">
//         {products.map((product) => (
//           <div key={product.id} className="product-card">
//             <img src={product.img} alt={product.name} />
//             <h2>{product.name}</h2>
//             <p>Price: ₹ {product.price}</p>
//             <button onClick={() => addToCart(product)}>Add to Cart</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Product;


import React from "react";
import { useState } from "react";
import '../styles/Chips.css'
const Chips = ({addToCart }) => {
    const alert = () =>{
        alert("Added");
    }
    const [product] = useState([
        {
            url: "./photo/chips1.webp",
            name: 'Chilli Sprinkled',
            price: 10
        },
        {
            url: "./photo/chips2.webp",
            name: 'Combo Potato Chips',
            price: 10
        },
        {
            url: "./photo/chips3.jpg",
            name: 'Banana Chips',
            price: 50
        },
        {
            url: "./photo/chips4.jpg",
            name: 'Oats Chips - Peri Peri ',
            price: 95
        },
        {
            url: "./photo/chips5.webp",
            name: 'Beetroot Chips',
            price: 110
        },
        {
            url: "./photo/chips6.png",
            name: 'Lemon Chilli',
            price: 100
        },
        {
            url: "./photo/chips7.webp",
            name: 'Salty Wafers',
            price: 10
        },
        {
            url: "./photo/chips8.webp",
            name: 'Cornitos Nacho chips',
            price: 330
        },
        {
            url: "./photo/chips9.jpg",
            name: 'Rumbles',
            price: 20
        },
        {
            url: "./photo/chips10.jpg",
            name: 'Flamin Hot',
            price: 10
        }, 
        {
            url: "./photo/chips11.webp",
            name: 'Crunchex',
            price: 10
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
            <h1>Chips</h1>
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

export default Chips;