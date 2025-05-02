import React from 'react';
import { Link } from 'react-router-dom';
import homeImg from "../../images/home-img.png";


const Hero = () => {
  return (
    <section className="home section__lg">
      <div className="home__container container grid">
        <div className="home__content">
          <span className="home__subtitle">Hot promotions</span>
          <h1 className="home__title">Fashion Trending <span>Great Collection</span></h1>
          <p className="home__description">
            Save more with coupons & up to 20% off
          </p>
          <Link to="/shop" className="btn">Shop Now</Link>
        </div>

        <img src={homeImg} alt="" className="home__img" />
      </div>
    </section>
  );
};

export default Hero;

