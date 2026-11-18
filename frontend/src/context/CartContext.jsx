import React, { useEffect, useMemo, useState } from 'react';
import { CartContext } from "./cart-context";

const STORAGE_KEY = 'customer_cart';

const readStoredItems = () => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error('Failed to load cart', err);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readStoredItems);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save cart', err);
    }
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.product._id === product._id);
      if (existing) {
        return prev.map((p) =>
          p.product._id === product._id ? { ...p, quantity: p.quantity + quantity } : p
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    setItems((prev) =>
      prev
        .map((p) => (p.product._id === productId ? { ...p, quantity: Math.max(1, quantity) } : p))
        .filter((p) => p.quantity > 0)
    );
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((p) => p.product._id !== productId));
  };

  const clear = () => setItems([]);

  const total = useMemo(
    () =>
      items.reduce((sum, it) => {
        const price = Number(it.product.price || 0);
        return sum + price * (it.quantity || 1);
      }, 0),
    [items]
  );

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clear, total }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;




