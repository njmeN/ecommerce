import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../../images/logo.svg";
import paymentMethodImg from "../../images/payment-method.png";
import facebookIcon from "../../images/icon-facebook.svg";
import twitterIcon from "../../images/icon-twitter.svg";
import instagramIcon from "../../images/icon-instagram.svg";
import pinterestIcon from "../../images/icon-pinterest.svg";
import youtubeIcon from "../../images/icon-youtube.svg";

const Footer = () => {
  return (
    <footer className="footer container">
      <div className="footer__container grid">
        {/* Footer Content 1 */}
        <div className="footer__content">
          <Link to="/" className="footer__logo">
            <img src={logo} alt="" className="footer__logo-img" />
          </Link>

          <h4 className="footer__subtitle">Contact</h4>

          <p className="footer__description"> <span>Address:</span> 562 Wellington Road, Street 32, San Francisco</p>
          <p className="footer__description"> <span>Phone:</span> +01 2222 365 /(+91) 01 2345 6789</p>
          <p className="footer__description"> <span>Hours:</span> 10:00 - 18:00, Mon - Sat</p>

          <div className="footer__social">
            <h4 className="footer__subtitle">Follow Me</h4>

            <div className="footer__social-links flex">
              <Link to="#"><img src={facebookIcon} alt="" className="footer__social-icon" /></Link>
              <Link to="#"><img src={twitterIcon} alt="" className="footer__social-icon" /></Link>
              <Link to="#"><img src={instagramIcon} alt="" className="footer__social-icon" /></Link>
              <Link to="#"><img src={pinterestIcon} alt="" className="footer__social-icon" /></Link>
              <Link to="#"><img src={youtubeIcon} alt="" className="footer__social-icon" /></Link>
            </div>
          </div>
        </div>

        {/* Footer Content 2 */}
        <div className="footer__content">
          <h3 className="footer__title">Address</h3>

          <ul className="footer__links">
            <li><Link to="#" className="footer__link">About us</Link></li>
            <li><Link to="#" className="footer__link">Delivery Information</Link></li>
            <li><Link to="#" className="footer__link">Privacy Policy</Link></li>
            <li><Link to="#" className="footer__link">Terms & conditions</Link></li>
            <li><Link to="#" className="footer__link">Contact Us</Link></li>
            <li><Link to="#" className="footer__link">Support center</Link></li>
          </ul>
        </div>

        {/* Footer Content 3 */}
        <div className="footer__content">
          <h3 className="footer__title">My Account</h3>

          <ul className="footer__links">
            <li><Link to="/login" className="footer__link">Sign In</Link></li>
            <li><Link to="/cart" className="footer__link">View Cart</Link></li>
            <li><Link to="/wishlist" className="footer__link">My wishlist</Link></li>
            <li><Link to="/accounts" className="footer__link">Track My Order</Link></li>
            <li><Link to="#" className="footer__link">Help</Link></li>
            <li><Link to="/shop" className="footer__link">Order</Link></li>
          </ul>
        </div>

        {/* Footer Content 4 */}
        <div className="footer__content">
          <h3 className="footer__title">Secured Payment Gateways</h3>

          <img src={paymentMethodImg} alt="Payment Methods" className="payment__img" />
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer__bottom">
        <p className="copyright">&copy; 2024 Evara. All rights reserved</p>
        <span className="designer">Designed by najme</span>
      </div>
    </footer>
  );
};

export default Footer;
