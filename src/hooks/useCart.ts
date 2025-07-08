import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '../types';

const CART_KEY = 'ecofit-cart';

export interface CartItem {
  productId: string;
  skuCode: string;
  quantity: number;
  size?: string;
  color?: string;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Get cart from localStorage
const getCartFromStorage = (): Cart => {
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      const cart = JSON.parse(stored);
      // Ensure the cart has the correct structure
      return {
        items: cart.items || [],
        total: cart.total || 0,
        itemCount: cart.itemCount || 0,
      };
    }
    return { items: [], total: 0, itemCount: 0 };
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return { items: [], total: 0, itemCount: 0 };
  }
};

// Save cart to localStorage
const saveCartToStorage = (cart: Cart): void => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Calculate cart totals
const calculateCartTotals = (items: CartItem[]): { total: number; itemCount: number } => {
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

export const useCart = () => {
  const queryClient = useQueryClient();

  // Query to get cart
  const { data: cart = { items: [], total: 0, itemCount: 0 } } = useQuery({
    queryKey: ['cart'],
    queryFn: getCartFromStorage,
    staleTime: Infinity, // Never stale since it's local storage
    gcTime: Infinity, // Never garbage collected
  });

  // Mutation to add to cart
  const addToCartMutation = useMutation({
    mutationFn: async ({ 
      product, 
      skuCode, 
      quantity = 1, 
      size, 
      color 
    }: { 
      product: Product; 
      skuCode: string; 
      quantity?: number; 
      size?: string; 
      color?: string; 
    }): Promise<Cart> => {
      const currentCart = getCartFromStorage();
      const existingItemIndex = currentCart.items.findIndex(item => item.skuCode === skuCode);
      
      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = [...currentCart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        };
      } else {
        // Add new item
        newItems = [...currentCart.items, { 
          productId: product.id, 
          skuCode, 
          quantity, 
          size, 
          color, 
          product 
        }];
      }
      
      const { total, itemCount } = calculateCartTotals(newItems);
      const newCart: Cart = { items: newItems, total, itemCount };
      
      saveCartToStorage(newCart);
      return newCart;
    },
    onSuccess: (newCart: Cart) => {
      queryClient.setQueryData(['cart'], newCart);
    },
  });

  // Mutation to remove from cart
  const removeFromCartMutation = useMutation({
    mutationFn: async (skuCode: string): Promise<Cart> => {
      const currentCart = getCartFromStorage();
      const newItems = currentCart.items.filter(item => item.skuCode !== skuCode);
      const { total, itemCount } = calculateCartTotals(newItems);
      const newCart: Cart = { items: newItems, total, itemCount };
      
      saveCartToStorage(newCart);
      return newCart;
    },
    onSuccess: (newCart: Cart) => {
      queryClient.setQueryData(['cart'], newCart);
    },
  });

  // Mutation to update quantity
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ skuCode, quantity }: { skuCode: string; quantity: number }): Promise<Cart> => {
      const currentCart = getCartFromStorage();
      let newItems: CartItem[];
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        newItems = currentCart.items.filter(item => item.skuCode !== skuCode);
      } else {
        // Update quantity
        newItems = currentCart.items.map(item => 
          item.skuCode === skuCode ? { ...item, quantity } : item
        );
      }
      
      const { total, itemCount } = calculateCartTotals(newItems);
      const newCart: Cart = { items: newItems, total, itemCount };
      
      saveCartToStorage(newCart);
      return newCart;
    },
    onSuccess: (newCart: Cart) => {
      queryClient.setQueryData(['cart'], newCart);
    },
  });

  // Mutation to clear cart
  const clearCartMutation = useMutation({
    mutationFn: async (): Promise<Cart> => {
      const emptyCart: Cart = { items: [], total: 0, itemCount: 0 };
      saveCartToStorage(emptyCart);
      return emptyCart;
    },
    onSuccess: (newCart: Cart) => {
      queryClient.setQueryData(['cart'], newCart);
    },
  });

  // Helper function to check if a product is in cart
  const isInCart = (productId: string): boolean => {
    return cart.items.some(item => item.productId === productId);
  };

  // Helper function to check if a specific SKU is in cart
  const isSkuInCart = (skuCode: string): boolean => {
    return cart.items.some(item => item.skuCode === skuCode);
  };

  // Helper function to get cart item quantity
  const getCartItemQuantity = (productId: string): number => {
    const item = cart.items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  // Helper function to get cart item quantity by SKU
  const getCartItemQuantityBySku = (skuCode: string): number => {
    const item = cart.items.find(item => item.skuCode === skuCode);
    return item ? item.quantity : 0;
  };

  return {
    cart,
    isInCart,
    isSkuInCart,
    getCartItemQuantity,
    getCartItemQuantityBySku,
    addToCart: addToCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isLoading: addToCartMutation.isPending || removeFromCartMutation.isPending || updateQuantityMutation.isPending || clearCartMutation.isPending,
  };
};