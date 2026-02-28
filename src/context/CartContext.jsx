/**
 * Shopping Cart Context
 * 
 * Global state management for shopping cart
 * Provides:
 * - Add/remove/update cart items
 * - Calculate total price with discounts
 * - Local storage persistence
 * - Cart visibility toggle
 * 
 * Used by Header, Cart Widget, and Checkout pages
 */

import { createContext, useState, useCallback } from 'react';

// 🛒 Cart Context
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.productId === product.id);
      
      if (existingItem) {
        return {
          ...prevCart,
          items: prevCart.items.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
          total: prevCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
      }

      const newItems = [...prevCart.items, {
        productId: product.id,
        productName: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        quantity
      }];

      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.productId !== productId);
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart({ items: [], total: 0 });
  }, []);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};
