import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ProductContext } from './../contexts/productContext';
import { CartContext } from '../contexts/cartContext';
import {WishlistContext} from "../contexts/wishlistContext";

const AllProducts = () => {
  const { products, loading, productError} = useContext(ProductContext);
  const { addToCart, exceededAvailability } = useContext(CartContext);
  const {wishlist, setWishlist} = useContext(WishlistContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const productsPerPage = 8; // Number of products per page

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search')?.toLowerCase() || '';
    const categoryQuery = queryParams.get('category');

    if (searchQuery) {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery)
      );
      setFilteredProducts(filtered);
      setCurrentPage(1); 
    } else if (categoryQuery) {
    const filtered = products.filter((product) => 
      product.category.toLowerCase() === categoryQuery.toLowerCase()
    );
    setFilteredProducts(filtered);
  } else {
      setFilteredProducts(products); 
    }
    setCurrentPage(1);
  }, [location.search, products]);

  
  

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Get products for the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product); // Add product to the cart
  };

  const handleAddToWishlist = (product) => {
    setWishlist((prevWishlist) => [...prevWishlist, product]);
  };


  

  return (
    <section className="products section container">
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
      :currentProducts.map((product) => (
          <div key={product.id} className="product__item">
            <div className="product__banner">
              <div className="product__images">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={product.title}
                    className={`product__img ${index === 0 ? 'default' : 'hover'}`}
                  />
                ))}
              </div>

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
              <div className="product__rating">
                {Array.from({ length: Math.round(product.rating) }, (_, index) => (
                  <i key={index} className="fi fi-rs-star"></i>
                ))}
              </div>
              <div className="product__price flex">
                <span className="new__price">${product.price}</span>
                <span className="old__price">$245.85</span> {/* Example old price */}
              </div>
              <Link to="#" className="action__btn cart__btn" aria-label="Add To Cart" onClick={() => handleAddToCart(product)}>
                <i className="fi fi-rs-shopping-bag-add"></i>
              </Link>
              {exceededAvailability[product.id] && <p className="error">More than availability</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <ul className="pagination container flex">
        {[...Array(totalPages)].map((_, index) => (
          <li key={index}>
            <button
              className={`pagination__link ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages} // Disable if on the last page
            className={`pagination__link icon ${currentPage === totalPages ? 'disabled' : ''}`}
          >
            <i className="fi-rs-angle-double-small-right"></i>
          </button>
        </li>
      </ul>
    </section>
  );
};

export default AllProducts;
