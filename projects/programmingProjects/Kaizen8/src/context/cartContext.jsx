// cartContext.jsx
import api from '../api';
import { useProducts } from './ProductContext';

export const CartProvider = ({ children }) => {
  const { refreshProducts } = useProducts();
  const [cartItems, setCartItems] = useState([]);

  const addToCart = async (product, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });

    await api.post(`/order/${product.id}`, { quantity: qty });
    await refreshProducts();
  };

  const removeFromCart = async (product, qty = 1) => {
    setCartItems(prev => {
      return prev
        .map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity - qty }
            : item
        )
        .filter(item => item.quantity > 0);
    });

    await api.post(`/order/${product.id}`, { quantity: -qty });
    await refreshProducts();
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
