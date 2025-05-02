// CartContext.js
import React, { createContext, useState, useEffect, useContext} from 'react';
import { UserContext } from './userContext';
import axios from 'axios';


export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [fetchingError, setFetchingError] =useState(null)
  const { user} = useContext(UserContext)
  const [exceededAvailability, setExceededAvailability] = useState({});
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
        if (user) {
            try {
                const response = await axios.get(`http://localhost:3000/users/${user.id}`);
                const fetchedCart = typeof response.data.cart === "string" ? JSON.parse(response.data.cart) : response.data.cart;
                setCart(Array.isArray(fetchedCart) ? fetchedCart : []);
            } catch (error) {
               console.log("fetching cart error")
                setFetchingError('fetching products failed')
                setCart([]);
            }
        } else {
            const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
            setCart(storedCart);
        }
    };
    fetchCart();
}, [user]);


  
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart'); // Remove when empty
    }
  

  if (user && cart.length >= 0) {
    axios.patch(`http://localhost:3000/users/${user.id}`, { cart })
      .catch((error) => console.error('Error updating cart:', error));
  }
  console.log(localStorage)
}, [cart]);

const addToCart = (product) => {
  setCart((prevCart) => {
    const existingProduct = prevCart.find((item) => item.id === product.id);

    if (existingProduct) {
      if (existingProduct.quantity >= product.availability) {
        setExceededAvailability((prev) => ({ ...prev, [product.id]: true })); // Set for this product
        setTimeout(() => {
          setExceededAvailability((prev) => ({ ...prev, [product.id]: false })); // Reset after 3s
        }, 3000);
        return prevCart;
      }

      return prevCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: Math.min(item.quantity + 1, product.availability) }
          : item
      );
    }

    return [...prevCart, { ...product, quantity: 1 }];
  });
};


  const updateQuantity = (id, quantity, product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === id);
  
      if (existingProduct) {
        // Update quantity if product exists
        return prevCart.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
      } else {
        // Add product to cart if it doesn't exist
        return [...prevCart, { ...product, quantity }];
      }
    });
  };
  
  


  

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, updateQuantity, removeFromCart, clearCart, exceededAvailability, fetchingError}}>
      {children}
    </CartContext.Provider>
  );
};
