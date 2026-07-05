import React from 'react'
import '../styles/Navbar.css'
import logo1 from '../images/logo1.png'
import cart_icon from '../images/cart_icon.png'
import { Link } from 'react-router-dom'


const Navbar = (props) => {

  return (
  <>
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={logo1} alt="" />
        <p>CRUNCHY BITE</p>
      </div>
      <div className="nav-login-cart">
        <button><Link to="http://localhost:3001/">sign-Up</Link></button>
        <Link to='/login'><button>Login</button></Link>
        <Link to='/cart'><img src={cart_icon} alt="" /></Link>
        <sup className='count' style={{ontweight:"bold",fontSize:"20px",position:"relative",marginLeft:"-50px"}}>{props.count}</sup>
      </div>
    </div>

    <div className='nav-menu'>
      <ul>
        <li><Link to="/">Home</Link></li>
          <div className='dropdown'>
            <li><Link to="/product">Product</Link></li>
          </div>   
        <li><Link to="/aboutus">About Us</Link></li>
        <li><Link to="/contactus">Contact Us</Link></li>
      </ul>  
    </div>
    </>
  )
}

export default Navbar