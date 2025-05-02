import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { CartContext } from "../contexts/cartContext"
import { Link , useNavigate} from 'react-router-dom';
import { ProductContext } from '../contexts/productContext';
import { UserContext } from '../contexts/userContext';

export default function Cart() {
  const{user}= useContext(UserContext)
  const { cart, updateQuantity, removeFromCart , fetchingError, clearCart} = useContext(CartContext);
  const {productError} = useContext(ProductContext);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();




  const handleQuantityChange = (id, quantity) => {
    if (quantity > 0) {
      updateQuantity(id, parseInt(quantity, 10));
    }
  };

  const calculateTotals = () => {
    const calculatedSubtotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubtotal(calculatedSubtotal);
    setTotal(calculatedSubtotal + shipping);
  };

  useEffect(() => {
    calculateTotals();
  }, [cart]); // Recalculate when cart changes

  const handleProceedToCheckout = () => {
    if (!user) {
        // If user isn't logged in, navigate to login page
        navigate('/login');
    } else {
        // Create the order details
        const order = {
            userId: user.id,
            date: new Date().toISOString(),
            status: 'pending',
            products: cart.map(item => ({
                productId: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.quantity * item.price,
                link: `/product/${item.id}`,
            })),
            totalAmount: cart.reduce((total, item) => total + (item.quantity * item.price), 0),
        };

        // Send the order to the orders collection
        axios.post('http://localhost:3000/orders', order)
            .then((response) => {
                console.log('Order placed:', response.data);

                // Now, update the user object by adding the order to the user's orders array
                const updatedUser = {
                    ...user,
                    orders: [...user.orders, response.data],  // Append the new order to the user's orders
                };

                // Update the user in local storage
                localStorage.setItem('user', JSON.stringify(updatedUser));

                // Update the user in the API (PATCH request to update the user)
                axios.patch(`http://localhost:3000/users/${user.id}`, { orders: updatedUser.orders })
                    .then((userResponse) => {
                        console.log('User orders updated:', userResponse.data);
                        navigate('/order-confirmation');  // Navigate to order confirmation page
                    })
                    .catch((error) => {
                        console.error('Error updating user orders:', error);
                    });
            })
            .catch((error) => {
                console.error('Error placing order:', error);
            });

            clearCart();
    }
};



  return (
    <section>
      <section className="breadcrumb">
        <ul className="breadcrumb__list flex container">
          <li>
            <a href="index.html" className="breadcrumb__link">Home</a>
          </li>
          <li>
            <span className="breadcrumb__link">></span>
          </li>
          <li>
            <span className="breadcrumb__link">Shop</span>
          </li>
          <li>
            <span className="breadcrumb__link">></span>
          </li>
          <li>
            <span className="breadcrumb__link">Cart</span>
          </li>
        </ul>
      </section>

      {/* CART SECTION */}
      <section className="cart section__lg container">
        <div className="table__container">
        {fetchingError && <p className="error">{fetchingError}</p>}
        {productError && <p className="error">{productError}</p>}
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img src={product.images[0]} alt={product.title} className="table__img" />
                  </td>
                  <td>
                    <Link to={`/product/${product.id}`} className="table__title">{product.title}</Link>
                  </td>
                  <td>
                    <span className="table__price">${product.price}</span>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={product.quantity}
                      className="quantity"
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    />
                  </td>
                  <td>
                    <span className="table__subtotal">
                      ${(product.price * product.quantity).toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <i
                      className="fi fi-rs-trash table__trash"
                      onClick={() => removeFromCart(product.id)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cart__actions">
          <Link to="#" className="btn flex btn__md" onClick={calculateTotals}>Update cart</Link>
          <Link to="/shop" className="btn flex btn__md">Continue Shopping</Link>
        </div>

        <div className="divider">
          <i className="fi fi-rs fingerprint"></i>
        </div>

        <div className="cart__group grid">

          <div className="cart__total">
            <h3 className="section__title">Cart Totals</h3>
            <table className="cart__total-table">
              <tr>
                <td>
                  <span className="cart__total-price">Cart Subtotal</span>
                </td>
                <td>
                  <span className="cart__total-price">{subtotal.toFixed(2)}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="cart__total-price">Shipping</span>
                </td>
                <td>
                  <span className="cart__total-price">{shipping}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="cart__total-price">Total</span>
                </td>
                <td>
                  <span className="cart__total-price">{total.toFixed(2)}</span>
                </td>
              </tr>
            </table>
            <button className="btn flex btn__md" onClick={handleProceedToCheckout}>
              <i className="fi fi-rs-box-alt"></i>Proceed To Checkout
            </button>
          </div>
        </div>
      </section>
    </section>
  )
}


