import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { useToast } from './ToastContext';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WISHLIST_STORAGE_KEY = 'ideal_bigshop_wishlist_v1';

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>(() => {
    return getStorageItem<Product[]>(WISHLIST_STORAGE_KEY, []);
  });
  const { showToast } = useToast();

  useEffect(() => {
    setStorageItem(WISHLIST_STORAGE_KEY, items);
  }, [items]);

  const addToWishlist = (product: Product) => {
    if (!items.some((p) => p.id === product.id)) {
      setItems((prev) => [...prev, product]);
      showToast(`'${product.nameBn}' উইশলিস্টে সেভ করা হয়েছে!`, 'success');
    }
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => {
      const removed = prev.find((p) => p.id === productId);
      if (removed) {
        showToast(`'${removed.nameBn}' উইশলিস্ট থেকে সরানো হয়েছে`, 'info');
      }
      return prev.filter((p) => p.id !== productId);
    });
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some((p) => p.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
