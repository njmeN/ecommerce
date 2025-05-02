import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/cartContext';
import { WishlistContext } from '../contexts/wishlistContext';

export default function Wishlist() {
  const {wishlist, setWishlist} = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const removeFromWishlist = (id) => {
    setWishlist((prevWishlist) => prevWishlist.filter(item => item.id !== id));
  };

  return (
    <section>
      <section className="breadcrumb">
        <ul className="breadcrumb__list flex container">
          <li><a href="index.html" className="breadcrumb__link">Home</a></li>
          <li><span className="breadcrumb__link">></span></li>
          <li><span className="breadcrumb__link">Shop</span></li>
          <li><span className="breadcrumb__link">></span></li>
          <li><span className="breadcrumb__link">Wishlist</span></li>
        </ul>
      </section>

      <section className="wishlist section__lg container">
        <div className="table__container">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock Status</th>
                <th>Action</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {wishlist.length > 0 ? (
                wishlist.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img src={product.images[0]} alt={product.title} className="table__img" />
                    </td>
                    <td>
                      <h3 className="table__title">{product.title}</h3>
                    </td>
                    <td>
                      <span className="table__price">${product.price}</span>
                    </td>
                    <td>
                      <span className="table__stock">In Stock</span>
                    </td>
                    <td>
                      <Link
                        to="/cart"
                        className="btn btn__sm"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to cart
                      </Link>
                    </td>
                    <td>
                      <i
                        className="fi fi-rs-trash table__trash"
                        onClick={() => removeFromWishlist(product.id)}
                      ></i>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No items in the wishlist</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
