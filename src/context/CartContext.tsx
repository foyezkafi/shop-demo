import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, silent?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  toggleCartDrawer: () => void;
}

const CART_STORAGE_KEY = 'ideal_bigshop_cart_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    return getStorageItem<CartItem[]>(CART_STORAGE_KEY, []);
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setStorageItem(CART_STORAGE_KEY, items);
  }, [items]);

  const addToCart = (product: Product, quantity = 1, silent = false) => {
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity }];
    });

    if (!silent) {
      showToast(`'${product.nameBn}' কার্টে যুক্ত করা হয়েছে!`, 'success');
    }
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => {
      const removed = prev.find((i) => i.product.id === productId);
      if (removed) {
        showToast(`'${removed.product.nameBn}' কার্ট থেকে সরানো হয়েছে`, 'info');
      }
      return prev.filter((item) => item.product.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const toggleCartDrawer = () => {
    setIsCartDrawerOpen((prev) => !prev);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        toggleCartDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
