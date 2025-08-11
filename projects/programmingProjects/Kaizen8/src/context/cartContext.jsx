// src/context/cartContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
import { useProducts } from './ProductContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// Use your backend base for fixing any relative image paths in saved carts
const API_BASE =
  (import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  'https://alissahsu22-github-io.onrender.com';

function normalizeImage(url) {
  const img = String(url || '');
  if (/^https?:\/\//i.test(img)) return img;
  return `${API_BASE}${img.startsWith('/') ? '' : '/'}${img}`;
}

export const CartProvider = ({ children }) => {
  const { refreshProducts } = useProducts();

  // Load from localStorage once (no hardcoded defaults)
  const [cartItems, setCartItems] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');
    const migrated = saved.map(it => ({ ...it, image: normalizeImage(it.image) }));
    if (saved.length && JSON.stringify(saved) !== JSON.stringify(migrated)) {
      localStorage.setItem('cart', JSON.stringify(migrated));
    }
    return migrated;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add (+ qty) and sync sales/stock on the server
  const addToCart = async (product, qty = 1) => {
    setCartItems(prev => {
      const i = prev.findIndex(p => p.id === product.id);
      if (i >= 0) {
        const next = [...prev];
        const nextQty = next[i].quantity + qty;
        const maxQty = product.stock ?? nextQty;
        next[i] = { ...next[i], quantity: Math.min(nextQty, maxQty) };
        return next;
      }
      return [...prev, { ...product, image: normalizeImage(product.image), quantity: qty }];
    });

    try {
      await api.post(`/order/${product.id}`, { quantity: qty }); // +qty sale, -qty stock
      await refreshProducts();
    } catch (e) {
      console.error('addToCart sync failed:', e);
      // Optional: rollback UI if desired
    }
  };

  // Remove (- qty) and sync negative delta
  const removeFromCart = async (product, qty = 1) => {
    setCartItems(prev =>
      prev
        .map(p => (p.id === product.id ? { ...p, quantity: p.quantity - qty } : p))
        .filter(p => p.quantity > 0)
    );

    try {
      await api.post(`/order/${product.id}`, { quantity: -qty }); // -qty sale, +qty stock
      await refreshProducts();
    } catch (e) {
      console.error('removeFromCart sync failed:', e);
      // Optional: rollback UI if desired
    }
  };

  // Optional helpers
  const setQuantity = async (product, nextQty) => {
    setCartItems(prev => {
      const i = prev.findIndex(p => p.id === product.id);
      if (i < 0) return prev;
      const delta = nextQty - prev[i].quantity;
      const next = [...prev];
      next[i] = { ...next[i], quantity: Math.max(0, nextQty) };
      return next.filter(p => p.quantity > 0);
    });

    try {
      const delta = nextQty - (cartItems.find(p => p.id === product.id)?.quantity ?? 0);
      if (delta) {
        await api.post(`/order/${product.id}`, { quantity: delta });
        await refreshProducts();
      }
    } catch (e) {
      console.error('setQuantity sync failed:', e);
    }
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, setQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
