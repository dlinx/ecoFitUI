import { useState, useEffect } from 'react';
import { CartItem, Cart } from '@types';

const CART_STORAGE_KEY = 'ecofit_cart';

export const useCart = () => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    itemCount: 0,
  });

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        cartItem => cartItem.productId === item.productId
      );

      let updatedItems;
      if (existingItemIndex >= 0) {
        updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity,
        };
      } else {
        updatedItems = [...prevCart.items, item];
      }

      const itemCount = updatedItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
      
      return {
        ...prevCart,
        items: updatedItems,
        itemCount,
      };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.productId !== productId);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...prevCart,
        items: updatedItems,
        itemCount,
      };
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );
      
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...prevCart,
        items: updatedItems,
        itemCount,
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      total: 0,
      itemCount: 0,
    });
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};