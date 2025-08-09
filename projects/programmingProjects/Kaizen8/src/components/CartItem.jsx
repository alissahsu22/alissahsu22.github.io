import { useCart } from '/src/context/cartContext.jsx'
import { useProducts } from '../context/ProductContext'
import api from '../api'                           // ✅ add

function CartItem({ item }) {
  const { removeFromCart, addToCart } = useCart()
  const { refreshProducts } = useProducts()

  const handleAdd = async () => {
    addToCart(item)
    await api.post(`/order/${item.id}`, { quantity: 1 })   // ✅ was fetch('http://localhost...')
    await refreshProducts()
  }

  return (
    <div className="cart-item">
      <h4>{item.title}</h4>
      <p>${item.price} x {item.quantity}</p>
      <button onClick={() => removeFromCart(item)}>-</button>
      <button onClick={handleAdd}>+</button>
    </div>
  )
}
export default CartItem
