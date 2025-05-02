import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from "../../images/logo.svg";
import searching from "../../images/search.png";
import heart from "../../images/icon-heart.svg";
import cartImg from "../../images/icon-cart.svg";
import menuBurger from "../../images/menu-burger.svg";
import { CartContext } from "./../contexts/cartContext";
import { UserContext } from "./../contexts/userContext";
import { WishlistContext } from '../contexts/wishlistContext';


const Header = () => {
  const { wishlist } = useContext(WishlistContext); 
  const wishlistCount = wishlist.length;
  const { cart } = useContext(CartContext);
  const { user, logOut } = useContext(UserContext);

  const [search, setSearch] = useState('')
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemCount = (cart || []).reduce((total, item) => total + item.quantity, 0);


  const toggleMenu = () => {
    setShowMenu(!showMenu);

  };



  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/accounts', label: 'My Account' },
    { path: '/compare', label: 'Compare' },
    { path: '/login', label: 'Login' },
  ];

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };


  return (
    <header className="header">
      <div className="header__top">
        <div className="header__container container">
          <div className="header__contact">
            <span>(+01)-2345-6789</span>

            <span>Our location</span>
          </div>

          <p className="header__alert-news">Super Value Deals - Save more with coupons</p>

          {user ? (
            <div className="header__top-action">
              <Link to="/accounts">{user.name}</Link> {/* Link to account page */}
              {" - "}
              <Link to='/' onClick={logOut} className="logout-btn">Sign Out</Link> {/* Logout button */}
            </div>
          ) : (
            <Link to="/login" className="header__top-action">
              Login / Sign Up
            </Link>
          )}

        </div>
      </div>

      <nav className="nav section">
        <Link to="/" className="nav__logo">
          <img src={logo} alt="" className="nav__logo-img" />
        </Link>

        <div className={`nav__menu  ${showMenu ? 'show-menu' : ''}`} id="nav__menu">
          <div className="nav__menu-top">
            <a href="index.html" className="nav__menu-logo">
              <img src={logo} alt="" />
            </a>

            <div className="nav__close" id="nav__close" onClick={toggleMenu}>
              <i className="fi fi-rs-cross-small"></i>
            </div>
          </div>

          <ul className="nav__list" >
            {navItems.map((item) => (
              <li key={item.path} className={`nav__item ${location.pathname === item.path ? 'active-link' : ''}`}>
                <Link to={item.path} className="nav__link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="header__search">
            <input type="text" dir="auto" placeholder="Search for items..." className="form__input" onChange={(e) => setSearch(e.target.value)} />

            <button className="search__btn" onClick={handleSearch}>
              <img src={searching} alt="" />
            </button>
          </div>
        </div>

        <div className="header__user-actions">
        <Link to="/wishlist" className="header__action-btn">
          <img src={heart} alt="Wishlist" />
          <span className="count">{wishlistCount}</span> 
        </Link>

          <Link to="/cart" className="header__action-btn">
            <img src={cartImg} alt="" />
            <span className="count">{cartItemCount}</span>
          </Link>

          <div className={"header__action-btn nav__toggle"} id="nav__toggle" >
            <img src={menuBurger} alt="" onClick={toggleMenu} />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
