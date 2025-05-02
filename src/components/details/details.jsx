import React from 'react'
import { useContext, useState , useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';

import { ProductContext } from "../contexts/productContext";
import { CartContext } from '../contexts/cartContext';

export const Details = () => {
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams(); // Get product ID from URL
  const { products, loading } = useContext(ProductContext);
  const { cart,updateQuantity } = useContext(CartContext); 
  

  const product = products.find((item) => item.id === id) ;
  const [selectedImage, setSelectedImage] = useState(product.images[0]); 

  const [reviews, setReviews] = useState(product.reviews || []);
  const [newReview, setNewReview] = useState({
    user: "",
    email: "",
    comment: "",
    rating: 0,
  });
  const [error, setError] = useState("");

  const handleReviewChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleRatingSelect = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const submitReview = async (e) => {
    e.preventDefault();

    if (!newReview.user || !newReview.email || !newReview.comment || newReview.rating === 0) {
      setError("All fields and rating are required.");
      return;
    }

    const reviewData = { ...newReview, date: new Date().toISOString().split("T")[0] };

    try {
      await axios.patch(`http://localhost:3000/products/${product.id}`, {
        reviews: [...reviews, reviewData],
      });

      setReviews([...reviews, reviewData]);
      setNewReview({ user: "", email: "", comment: "", rating: 0 });
      setError("");
    } catch (error) {
      console.error("Failed to submit review:", error);
      setError("Something went wrong. Try again.");
    }
  };

  useEffect(() => {
    // Check if product exists in the cart and set its quantity
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setQuantity(existingProduct.quantity);
    }
  }, [cart, product]);

  if (!product) return <p>Product not found</p>;

  if (loading) return <p>Loading...</p>;
  const handleQuantityChange = (e) => {
    const minValue = 1;
    const maxValue = product.availability; // Limit based on product availability
  
    let newQuantity = parseInt(e.target.value, 10) || minValue;
  
    // Ensure the value stays within the range
    newQuantity = Math.max(minValue, Math.min(maxValue, newQuantity));
  
    setQuantity(newQuantity);
  };
  

 
  console.log("Product Details Received:", product);
const handleUpdateCart =()=> {
  updateQuantity(product.id, quantity, product);
 // Update cart with new quantity
}

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
      <section className="details section__lg">
      <div className="details__container container grid">
        {/* Product Images */}
        <div className="details__group">
      {/* Big Image */}
      <img src={selectedImage} alt={product.title} className="details__img" />

      {/* Small Images */}
      <div className="details__small-images grid">
        {product.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={product.title}
            className={`details__small-img ${selectedImage === img ? "active" : ""}`}
            onClick={() => setSelectedImage(img)} // Change big image on click
            style={{ cursor: "pointer" }} // Indicate it's clickable
          />
        ))}
      </div>
    </div>

        {/* Product Information */}
        <div className="details__group">
          <h3 className="details__title">{product.title}</h3>
          <p className="details__brand">Brands: <span>Adidas</span></p>

          <div className="details__price flex">
            <span className="new__price">${product.price}</span>
  
          </div>

          <p className="short__description">{product.description}</p>

          <ul className="product__list">
            <li className="list__item flex"><i className="fi-rs-crown"></i> 1 year Warranty</li>
            <li className="list__item flex"><i className="fi-rs-refresh"></i> 30 Days Return Policy</li>
            <li className="list__item flex"><i className="fi-rs-credit-card"></i> Cash on Delivery available</li>
          </ul>

          <div className="details__action">
            <input 
              type="number" 
              className="quantity" 
              value={quantity} 
              min="1" 
              onChange={handleQuantityChange} 
            />
            <button className="btn btn__sm" onClick={handleUpdateCart}>Add to cart</button>
            <button className="details__action-btn">
              <i className="fi fi-rs-heart"></i>
            </button>
          </div>

          <ul className="details__meta">
            <li className="meta__list flex"><span>SKU:</span> {product.sku}</li>
            <li className="meta__list flex"><span>Availability:</span> {product.availability} Items in stock</li>
          </ul>
        </div>
      </div>

      {/* Product Reviews */}
        {/* Reviews */}
        <div className="details__tab container"> 
        <div className="detail__tabs">
          <span className="detail__tab" data-target="#reviews">Review({reviews.length})</span>
        </div>
         <div className="details__tabs-content">
        <div className="details__tab-content">
          <div className="reviews__container grid">
            {reviews.map((review, index) => (
              <div key={index} className="review__single">
                <div>
                  <img src="/assets/img/avatar-1.jpg" alt="User" className="review__img" />
                  <h4 className="review__title">{review.user}</h4>
                </div>
                <div className="review__data">
                  <div className="review__rating">
                    {Array.from({ length: review.rating }, (_, i) => (
                      <i key={i} className="fi fi-rs-star"></i>
                    ))}
                  </div>
                  <p className="review__description">{review.comment}</p>
                  <span className="review__date">{review.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Review Form */}
          <div className="review__form">
            <h4 className="review__form-title">Add a review</h4>
            <div className="rate__product">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`fi fi-rs-star ${newReview.rating > i ? "selected" : ""}`}
                  onClick={() => handleRatingSelect(i + 1)}
                  style={{ cursor: "pointer", color: newReview.rating > i ? "gold" : "gray" }}
                ></i>
              ))}
            </div>
            {error && <p className="error">{error}</p>}
            <form className="form grid" onSubmit={submitReview}>
              <textarea
                className="form__input textarea"
                placeholder="Write comment"
                name="comment"
                value={newReview.comment}
                onChange={handleReviewChange}
              ></textarea>
              <div className="form__group grid">
                <input
                  type="text"
                  className="form__input"
                  placeholder="Name"
                  name="user"
                  value={newReview.user}
                  onChange={handleReviewChange}
                />
                <input
                  type="email"
                  className="form__input"
                  placeholder="Email"
                  name="email"
                  value={newReview.email}
                  onChange={handleReviewChange}
                />
              </div>
              <div className="form__btn">
                <button className="btn">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      </div></div>
      
    </section>
   </section>
  )
}
