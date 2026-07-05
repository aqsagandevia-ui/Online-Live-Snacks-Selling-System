import React from 'react'
import '../styles/Footer.css'
import { Link } from 'react-router-dom'
import logo1 from '../images/logo1.png'
import instagram_icon from '../images/instagram_icon.png'
import pintester_icon from '../images/pintester_icon.png'
import whatsapp_icon from '../images/whatsapp_icon.png'

const Footer = () => {
  return (
    <div className='footer'>
        <div className='footer-logo'>
            <img src={logo1} alt="" />
            <p>CRUNCHY BITE</p>
        </div>
        <ul className='footer-links'>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/product">Products</Link></li>
            <li><Link to="/aboutus">AboutUs</Link></li>
            <li><Link to="/contactus">ContactUs</Link></li>
        </ul>
        <div className='footer-social-icon'>
            <div className='footer-icons-container'>
                <img src={instagram_icon} alt=""/>
            </div>
            <div className='footer-icons-container'>
                <img src={pintester_icon} alt=""/>
            </div>
            <div className='footer-icons-container'>
                <img src={whatsapp_icon} alt=""/>
            </div>
        </div>
        <div className='footer-copyright'>
            <hr/>
            <p>copyright @2024 - all Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer;