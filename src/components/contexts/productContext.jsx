// ProductContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [productError, setProductError] =useState(null)
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  

  // Fetch products once and store them in state
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        setProducts([])
        setProductError("Failed to fetch products. Please try again")
        console.log('product fetching error')
        setLoading(false)
      }
    };
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, productError , setProducts}}>
      {children}
    </ProductContext.Provider>
  );
};
