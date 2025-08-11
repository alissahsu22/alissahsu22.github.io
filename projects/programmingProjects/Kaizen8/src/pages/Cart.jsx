import { useCart } from '/src/context/cartContext.jsx'
import { useProducts } from '../context/ProductContext'
import api from '../api'
import './Cart.css'
import { useNavigate } from 'react-router-dom'

function Cart() {
  const navigate = useNavigate()
  const { cartItems, addToCart, removeFromCart } = useCart()
  const { refreshProducts } = useProducts()

  const handleAdd = async (item) => {
    addToCart(item, 1)                            // UI/localStorage
    await api.post(`/order/${item.id}`, { quantity: 1 })   // +1 sale, -1 stock
    await refreshProducts()
  }

  const handleRemove = async (item) => {
    removeFromCart(item)                           // UI/localStorage
    await api.post(`/order/${item.id}`, { quantity: -1 })  // -1 sale, +1 stock
    await refreshProducts()
  }

  const total = cartItems.reduce((acc, it) => acc + it.price * it.quantity, 0)

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map(item => {
            const tiers = (() => {
              try { return JSON.parse(item.discountTiers || '[]') } catch { return [] }
            })()

            // optional preview calc; fine to keep
            const currentSales = (item.salesCount || 0) + item.quantity
            const nextTier = tiers.find(t => currentSales < t.sales)
            const ordersLeft = nextTier ? nextTier.sales - currentSales : null

            return (
              <div key={item.id} className="cart-item">
                <div className="item-details">
                  <img src={item.image} alt={item.title} />
                  <div>
                    <h3 className="item-title">{item.title}</h3>
                    <p className="item-subtotal">
                      ${item.price.toFixed(2)} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    {ordersLeft !== null && (
                      <p className="order-left">
                        <span className="order-alert">
                          Only <b>{ordersLeft}</b> more order{ordersLeft !== 1 ? 's' : ''} until <b>{nextTier.percent}% off!</b>
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="quantity-controls">
                  <button onClick={() => handleRemove(item)} disabled={item.quantity <= 0}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleAdd(item)} disabled={item.quantity >= item.stock}>+</button>
                  {item.quantity >= item.stock && <p className="stock-warning">No more in stock</p>}
                </div>
              </div>
            )
          })}

          <h3 className="cart-total">Total: ${total.toFixed(2)}</h3>
          <button className="checkout-button" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  )
}

export default Cart
