import React from 'react'
import'../styles/Contactus.css'

const Contactus = () => {
  return (
    <div>
        <section className='contact'>
            <form>
                <h2>Contact Us</h2>
                <div className='input-box'>
                    <label>Name</label>
                    <input type='text' className='field' placeholder='Enter Your Name' required/>
                </div>
                <div className='input-box'>
                    <label>Email Address</label>
                    <input type='email' className='field' placeholder='Enter Your Email' required/>
                </div>
                <div className='input-box'>
                    <label>Your Message</label>
                    <textarea name="" id="" className='field mess' placeholder='Enter Your Message' required></textarea>
                </div>
                <button type='submit'>Send Message</button>
            </form>
        </section>
    </div>
  )
}

export default Contactus