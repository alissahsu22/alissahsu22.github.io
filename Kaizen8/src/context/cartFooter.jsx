import { useCart } from '../context/cartContext'

function CartFooter() {
  const { cart } = useCart()
  const {removeFromCart} = useCart()
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="cart-footer">
      <h4>🛒 Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</h4>
      <p>Total: ${total.toFixed(2)}</p>
      <ul>
        {cart.map(item => (
            <li key={item.id}>
            {item.title} — {item.quantity} x ${item.price} = ${item.quantity * item.price}

            <button onClick={() => removeFromCart(item)}>Remove From Cart</button>
            </li>
        ))}
        </ul>

    </div>
  )
}

export default CartFooter