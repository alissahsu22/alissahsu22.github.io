import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// put your backend base here (only used to fix old relative paths)
const ASSET_BASE = 'https://alissahsu22-github-io.onrender.com';

export const CartProvider = ({ children }) => {
  // 1) Load from localStorage (no hardcoded defaults)
  const [cartItems, setCartItems] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');

    // migrate old relative image paths to absolute URLs
    const migrated = saved.map(it => {
      const img = it.image || '';
      const fixed =
        /^https?:\/\//i.test(img) ? img :
        `${ASSET_BASE}${img.startsWith('/') ? '' : '/'}${img}`;
      return { ...it, image: fixed };
    });

    if (saved.length && JSON.stringify(saved) !== JSON.stringify(migrated)) {
      localStorage.setItem('cart', JSON.stringify(migrated));
    }
    return migrated;
  });

  // 2) Persist whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 3) Add / update helpers
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
      // ensure image is absolute
      const image = /^https?:\/\//i.test(product.image)
        ? product.image
        : `${ASSET_BASE}${String(product.image || '').startsWith('/') ? '' : '/'}${product.image || ''}`;
      return [...prev, { ...product, image, quantity: qty }];
    });
  };

  const setQuantity = (id, qty) =>
    setCartItems(prev => prev.map(p => (p.id === id ? { ...p, quantity: Math.max(0, qty) } : p)).filter(p => p.quantity > 0));

  const removeFromCart = (product) => setQuantity(product.id, (product.quantity ?? 1) - 1);

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, setQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
