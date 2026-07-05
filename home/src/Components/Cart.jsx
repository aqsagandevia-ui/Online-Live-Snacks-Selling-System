import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Cart.css'

export default function Cart({ cart, cartIndex }) {

    // const [removeItem]  = useState([])
    const [cart2, setcart2] = useState([])


    useEffect(() => {
        setcart2(cart)
    }, { cart })

    const handleRemove = (id) => {
        const arr = cart2.filter((Item) => Item.id !== id);
        setcart2(arr);
        <p>Cart is empty</p>
        // handlePrice();
    }

    const calculateTotal = (cart2) => {
        return cart.reduce((total, item) => total + (item.quantity * item.price), 0).toFixed(2);
      };
    

    // const removeItem = (product) => {
    //     setcart2(cart2 => cart2.filter(item => item.id !== product.id));
    // }

    // const removeItem = (product) => {
    //     setcart2( _cart2 => _cart2.filter(item => item.id !== product.id));
    //   };

    return (
        <>
            <br /><br /><br /><br /><br /><br />
            <div>
                <h1 style={{ textAlign: "center", fontFamily: " Arial Narrow Bold", fontWeight: "bold" , marginTop:"-160px"}}>Your Cart</h1>
                {
                    cart2.length === 0 ? (
                         <p style={{ fontSize: "30px" }}>Your cart is empty</p>
                        // <img style={{marginLeft:"20%"}} src={require("./photos/profile.png")} />
                    ) :
                        cart2?.map((cartItem, cartIndex) =>
                        {
                            return (
                                <div><br /><br />
                                    <div className='row card2'>
                                        <div className='col-8'>
                                            <img style={{ marginLeft: "-40px" }} src={cartItem.url} width="35%" />
                                            <span className='itemname' >{cartItem.name} </span>
                                        </div>

                                        <div className='col-4'>
                                            <button style={{ marginTop: "0" }} className='qtysub' onClick={() => {
                                                const _cart2 = cart2.map((item, index) => {
                                                    return cartIndex === index ? { ...item, quantity: item.quantity > 0 ? item.quantity - 1 : 0, } : item
                                                })
                                                setcart2(_cart2)
                                            }}> - </button>

                                            <span style={{ fontSize: "20px", fontWeight: "bold", fontFamily: "serif", marginLeft: "15px", marginRight: "15px" }}>{cartItem.quantity} </span>

                                            <button className='qtyadd' onClick={() => {
                                                const _cart2 = cart2.map((item, index) => {
                                                    return cartIndex === index ? { ...item, quantity: item.quantity + 1 } : item
                                                })
                                                setcart2(_cart2)
                                            }}> + </button>
                                            <span style={{ fontSize: "20px", fontWeight: "bold", fontFamily: "serif", marginLeft: "20px" }}> &#8377;{cartItem.price * cartItem.quantity} </span>
                                        </div>
                                    </div>

                                    {/* <button onClick={() => removeItem(cartItem.id)}>Remove</button> */}
                                    <hr />

                                </div>
                            )
                        })

                }
                <p style={{ fontFamily: "serif", fontWeight: "bold", fontSize: "25px", textAlign: "right", paddingRight: "150px" }}>Total Amount: <span style={{ marginLeft: "10px" }}> &#8377;</span>
                    {
                        cart2.map(item => item.price * item.quantity).reduce((total, value) => total + value, 0)

                    }
                </p>

                {/* <div style={{ paddingLeft: "10%" }}><br />
                    <Link to="/signup"><button className='checkout' >CheckOut</button></Link>
                </div> */}
                
            </div>
            <div>
                        <input className='input1' id="check01" type="checkbox" name="menu" />
                        <label id='label' for="check01" className='chk'>Show Bill</label>
                        <br /><br /><br /><br />
                        <div class="submenu">
                            {/* {
                                submittedData && (
                                    <div >
                                        <h2>Submitted Data</h2>
                                        <p>Name: {formData.name}</p>
                                        
                                    </div>
                                )} */}
                            <h1>Shopping Cart Bill</h1>
                            <br/>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart2.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{item.quantity}</td>
                                            <td>&#8377;{item.price.toFixed(2)}</td>
                                            <td>&#8377;{(item.quantity * item.price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr >
                                        <td colSpan="3">Delivery Charge</td>
                                        {
                                            cart2.length === 0 ? (
                                                <p style={{ fontSize: "30px" }}></p>
                                            ) :
                                                <td colSpan="3">
                                                    Free Delivery
                                                </td>
                                        }
                                    </tr>
                                    <tr>
                                        <td colSpan="3">Total Amount</td>
                                        <td>&#8377;{
                                        cart2.map(item => item.price * item.quantity).reduce((total, value) => total + value ,0)}
                                        </td>
                                    </tr>
                                    <br/><br/>
                                     <tr>
                                        <a href='http://localhost:3004'>
                                        <button style={{marginLeft:"850px",backgroundColor:"mediumturquoise",width:"180px",borderRadius:"10px",fontWeight:"bold",fontSize:"35px",border:"none"}}>Checkout</button>
                                        </a>
                                    </tr> 
                                </tfoot>
                            </table>
                            <br /><br /><br /><br />
                        </div>
                    </div>

            <br /><br /><br />
        </>
    )

}