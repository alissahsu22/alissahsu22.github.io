import { useCart } from '/src/context/cartContext.jsx'
import { useProducts } from '../context/ProductContext'
import api from '../api'                           // ✅ add

function CartItem({ item }) {
  const { removeFromCart, addToCart } = useCart()
  const { refreshProducts } = useProducts()

  const handleAdd = async () => {
    await addToCart(item, 1)
    await refreshProducts()
  }

  return (
    <div className="cart-item">
      <h4>{item.title}</h4>
      <p>${item.price} x {item.quantity}</p>
      <button onClick={() => removeFromCart(item, 1)}>-</button>
      <button onClick={handleAdd}>+</button>
    </div>
  )
}
export default CartItem
