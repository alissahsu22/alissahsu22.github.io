// /src/context/cartContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// Use your backend base to fix old relative image paths.
// If you have Vite, set VITE_API_BASE_URL in .env (e.g., https://alissahsu22-github-io.onrender.com)
const API_BASE =
  (import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  'https://alissahsu22-github-io.onrender.com';

function normalizeImage(url) {
  const img = String(url || '');
  if (/^https?:\/\//i.test(img)) return img;
  return `${API_BASE}${img.startsWith('/') ? '' : '/'}${img}`;
}

export const CartProvider = ({ children }) => {
  // 1) Load once from localStorage and migrate image URLs
  const [cartItems, setCartItems] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');
    const migrated = saved.map(it => ({ ...it, image: normalizeImage(it.image) }));
    if (saved.length && JSON.stringify(saved) !== JSON.stringify(migrated)) {
      localStorage.setItem('cart', JSON.stringify(migrated));
    }
    return migrated;
  });

  // 2) Persist on any change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 3) Actions
  const addToCart = (product, qty = 1) => {
    setCartItems(prev => {
      const idx = prev.findIndex(p => p.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        const nextQty = copy[idx].quantity + qty;
        const maxQty = product.stock ?? nextQty;
        copy[idx] = { ...copy[idx], quantity: Math.min(nextQty, maxQty) };
        return copy;
      }
      return [
        ...prev,
        {
          ...product,
          image: normalizeImage(product.image),
          quantity: qty,
        },
      ];
    });
  };

  const setQuantity = (id, qty) =>
    setCartItems(prev =>
      prev
        .map(p => (p.id === id ? { ...p, quantity: Math.max(0, qty) } : p))
        .filter(p => p.quantity > 0)
    );

  const removeFromCart = (product) => setQuantity(product.id, (product.quantity ?? 1) - 1);

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, setQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
