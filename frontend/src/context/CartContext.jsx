import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('quickcart_cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
      localStorage.removeItem('quickcart_cart');
      setCartItems([]);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('quickcart_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => 
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      return [...prev, { 
        _id: product._id, 
        name: product.name, 
        price: product.price, 
        imageUrl: product.imageUrl,
        category: product.category,
        quantity: 1 
      }];
    });
  };

  const updateQuantity = (productId, amount) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item._id === productId) {
          const newQty = item.quantity + amount;
          return { ...item, quantity: newQty < 1 ? 1 : newQty };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item._id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      updateQuantity, 
      removeFromCart,
      clearCart,
      cartCount,
      cartSubtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
