import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ProductContext } from './../contexts/productContext';
import { CartContext } from '../contexts/cartContext';
import {WishlistContext} from "../contexts/wishlistContext";

const Products = () => {
  const { products, loading, productError} = useContext(ProductContext);
  const { addToCart, exceededAvailability } = useContext(CartContext);
  const {wishlist, setWishlist} = useContext(WishlistContext);
  const [activeTab, setActiveTab] = useState('#new-added');

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleTabClick = (target) => {
    setActiveTab(target);
  };

  const handleAddToWishlist = (product) => {
    setWishlist((prevWishlist) => [...prevWishlist, product]);
  };

  return (
    <>
      <section className="products section container">
        <div className="tab__btns">
          <span
            className={`tab__btn ${activeTab === '#new-added' ? 'active-tab' : ''}`}
            onClick={() => handleTabClick('#new-added')}
          >
            New added
          </span>
          <span
            className={`tab__btn ${activeTab === '#popular' ? 'active-tab' : ''}`}
            onClick={() => handleTabClick('#popular')}
          >
            Popular
          </span>
        </div>

        <div className="tab__items">
          <div className={`tab__item ${activeTab === '#new-added' ? 'active-tab' : ''}`} id="new-added">
            <div className="products__container grid">
            {productError && <p className="error">{productError}</p>}
            {loading
              ? 
                [...Array(6)].map((_, index) => (
                  <div key={index} className="product__item">
                    <div className="product__banner">
                      <Skeleton height={200} />
                    </div>
                    <div className="product__content">
                      <Skeleton width={100} />
                      <Skeleton width={150} height={20} />
                      <Skeleton width={80} height={20} />
                    </div>
                  </div>
                ))
              : products.slice(3).map((product) => (
                <div key={product.id} className="product__item">
                  <div className="product__banner">
                    <Link to="/details" className="product__images">
                      {product.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={product.title}
                          className={`product__img ${index === 0 ? 'default' : 'hover'}`}
                        />
                      ))}
                    </Link>

                    <div className="product__actions">
                      <Link to={`/product/${product.id}`} className="action__btn" aria-label="Quick View">
                        <i className="fi fi-rs-eye"></i>
                      </Link>
                      <Link to="#" className="action__btn" aria-label="Add to wishlist" onClick={() => handleAddToWishlist(product)}>
                        <i className="fi fi-rs-heart"></i>
                      </Link>
                      <Link to="#" className="action__btn" aria-label="Compare">
                        <i className="fi fi-rs-shuffle"></i>
                      </Link>
                    </div>
                  </div>

                  <div className="product__content">
                    <span className="product__category">{product.category}</span>
                    <Link to="/details">
                      <h3 className="product__title">{product.title}</h3>
                    </Link>
                    <div className="product__price flex">
                      <span className="new__price">${product.price}</span>
                    </div>
                    <Link to="#" className="action__btn cart__btn" onClick={() => handleAddToCart(product)}>
                      <i className="fi fi-rs-shopping-bag-add"></i>
                    </Link>
                    {exceededAvailability[product.id] && <p className="error">More than availability</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={`tab__item ${activeTab === '#popular' ? 'active-tab' : ''}`} id="popular">
  <div className="products__container grid">
    {productError && <p className="error">{productError}</p>}
    {loading
      ? [...Array(4)].map((_, index) => ( // Show 4 skeletons
          <div key={index} className="product__item">
            <div className="product__banner">
              <Skeleton height={200} />
            </div>
            <div className="product__content">
              <Skeleton width={100} />
              <Skeleton width={150} height={20} />
              <Skeleton width={80} height={20} />
            </div>
          </div>
        ))
      : products.slice(-4).map((product) => ( // Last 4 products
          <div key={product.id} className="product__item">
            <div className="product__banner">
              <Link to="/details" className="product__images">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={product.title}
                    className={`product__img ${index === 0 ? 'default' : 'hover'}`}
                  />
                ))}
              </Link>
            </div>

            <div className="product__content">
              <span className="product__category">{product.category}</span>
              <Link to="/details">
                <h3 className="product__title">{product.title}</h3>
              </Link>
              <div className="product__price flex">
                <span className="new__price">${product.price}</span>
              </div>
              <Link to="#" className="action__btn cart__btn" onClick={() => handleAddToCart(product)}>
                <i className="fi fi-rs-shopping-bag-add"></i>
              </Link>
              {exceededAvailability[product.id] && <p className="error">More than availability</p>}
            </div>
          </div>
        ))}
  </div>
</div>
        </div>
      </section>

      
      
    </>
  );
};

export default Products;
