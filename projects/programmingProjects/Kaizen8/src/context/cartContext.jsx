import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([
  {
    id: 1,
    title: 'Rice',
    price: 25.99,
    quantity: 2,
    image: '/images/rice_img.png',
    salesCount: 30,
    discountTiers: JSON.stringify([
      { sales: 50, percent: 10 },
      { sales: 100, percent: 20 }
    ])
  }
])


function addToCart(product) {
  setCartItems(prevItems => {
    const existing = prevItems.find(item => item.id === product.id)
    if (existing) {
      // ❌ Don’t exceed stock
      if (existing.quantity >= product.stock) return prevItems

      return prevItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    } else {
      return [
        ...prevItems,
        {
          ...product, // includes stock, discountTiers, etc.
          quantity: 1
        }
      ]
    }
  })
}



  const removeFromCart = (product) => {
    setCartItems(prev => {
      return prev
        .map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    })
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
  <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
    {children}
  </CartContext.Provider>
)

}
