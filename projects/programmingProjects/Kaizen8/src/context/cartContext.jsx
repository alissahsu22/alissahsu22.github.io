// src/context/cartContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
import { useProducts } from './ProductContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const API_BASE =
  (import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  'https://alissahsu22-github-io.onrender.com';

const normalizeImage = (u='') =>
  /^https?:\/\//i.test(u) ? u : `${API_BASE}${u.startsWith('/') ? '' : '/'}${u}`;

export const CartProvider = ({ children }) => {
  const { refreshProducts } = useProducts();

  const [cartItems, setCartItems] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');
    const migrated = saved.map(it => ({ ...it, image: normalizeImage(it.image) }));
    if (saved.length && JSON.stringify(saved) !== JSON.stringify(migrated)) {
      localStorage.setItem('cart', JSON.stringify(migrated));
    }
    return migrated;
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Local-only updates (NO API) — use for hydration/initialization if needed
  const addToCartLocal = (product, qty = 1) => {
    setCartItems(prev => {
      const i = prev.findIndex(p => p.id === product.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + qty };
        return next;
      }
      return [...prev, { ...product, image: normalizeImage(product.image), quantity: qty }];
    });
  };

  const removeFromCartLocal = (product, qty = 1) => {
    setCartItems(prev =>
      prev
        .map(p => (p.id === product.id ? { ...p, quantity: p.quantity - qty } : p))
        .filter(p => p.quantity > 0)
    );
  };

  // Server-synced actions — call these ONLY on user clicks
  const addToCart = async (product, qty = 1) => {
    addToCartLocal(product, qty);
    try {
      await api.post(`/order/${product.id}`, { quantity: qty });
      await refreshProducts();
    } catch (e) {
      console.error('addToCart sync failed:', e);
    }
  };

  const removeFromCart = async (product, qty = 1) => {
    removeFromCartLocal(product, qty);
    try {
      await api.post(`/order/${product.id}`, { quantity: -qty });
      await refreshProducts();
    } catch (e) {
      console.error('removeFromCart sync failed:', e);
    }
  };

  const setQuantity = async (product, nextQty) => {
    // compute delta BEFORE state change to avoid stale read
    const prevQty = cartItems.find(p => p.id === product.id)?.quantity ?? 0;
    const delta = nextQty - prevQty;

    setCartItems(prev =>
      prev
        .map(p => (p.id === product.id ? { ...p, quantity: Math.max(0, nextQty) } : p))
        .filter(p => p.quantity > 0)
    );

    try {
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
    <CartContext.Provider value={{
      cartItems,
      addToCart,        // user click -> server sync
      removeFromCart,   // user click -> server sync
      setQuantity,      // user change -> server sync
      addToCartLocal,   // local-only (rarely needed)
      removeFromCartLocal,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
