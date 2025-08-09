import { useCart } from '/src/context/cartContext.jsx'
import { useProducts } from '../context/ProductContext'

function CartItem({ item }) {
  const { removeFromCart, addToCart } = useCart()
  const { refreshProducts } = useProducts()

  const handleAdd = async () => {
    addToCart(item)

    await fetch(`http://localhost:4000/order/${item.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: 1 }),
    })

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
