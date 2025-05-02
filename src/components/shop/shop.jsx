import React from 'react'
import "../home/products"
import AllProducts from './AllProducts';
import { Link } from 'react-router-dom';

const Shop = () => {
  return (
    <main className='main'>
         <section className="breadcrumb">
            <ul className="breadcrumb__list flex container">
            <li>
                <Link to="/" className="breadcrumb__link">Home</Link>
            </li>
            <li>
                <span className="breadcrumb__link">{">"}</span>
            </li>
            <li>
                <span className="breadcrumb__link">Shop</span>
            </li>
            </ul>
        </section>
        <AllProducts/>
       
 


    </main>
   
  )
}

export default Shop;