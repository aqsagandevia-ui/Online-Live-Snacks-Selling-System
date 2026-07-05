import React from 'react'
import '../styles/Aboutus.css'
import h1_img from '../images/h1_img.png'

const Aboutus = () => {
    return (
        <>
            <div className='about-section'>
                <p className='text'>Welcome to Crunchy Bite</p>
            </div>
            <div className='about-text'>
                <div className='about-left'>
                    <p>We are a Indian based company specialize in the online sale of unique and imported candies, chocolates and snacks from around the world.
                        Buy the biggest brands for the best prices at Crunchy Bite!</p>
                    <div>
                        <div className='text'>
                            <p>We have an ever growing range of imported goodies including best selling items such as Hershey's Candy and Cadbury chocolates, pop tarts, nachos, sauces plus much more! So we cater to customers sweet and savoury cravings....Customers can select from a range of our goodies, order them online and get it delivered directly to your door!</p>
                        </div>
                        <div className='last'>
                            <p><b> All our products are simply irresistive. So get ready for some real treats with Crunchy Bite.
                                Please feel free to get in touch with any queries you may have!</b></p>
                        </div>
                    </div>
                </div>
                <div className='about-right'>
                    <img src={h1_img} alt="" />
                </div>
            </div>
        </>
    )
}

export default Aboutus