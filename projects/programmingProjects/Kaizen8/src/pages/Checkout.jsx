import { useNavigate } from 'react-router-dom'
import { useCart } from '/src/context/cartContext.jsx'
import './Checkout.css'
import { useState } from 'react'
import { useProducts } from '../context/ProductContext'
import { useNotification } from '../context/NotificationContext'
import api from '../api'

function Checkout() {
  const navigate = useNavigate()
  const { cartItems, clearCart } = useCart()
  const { refreshProducts } = useProducts()
  const { showNotification } = useNotification()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', address: '' })

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const order = { cartItems, total, ...form }
      const response = await api.post('/orders', order)
      const { orderNumber, timestamp } = response.data

      // Optional: update product stock/sales on server (already done in /orders)
      await Promise.all(cartItems.map(item => api.post(`/order/${item.id}`, { quantity: item.quantity })))

      await refreshProducts()
      clearCart()
      showNotification('Order placed successfully!')

      navigate('/order-confirmation', { state: { ...order, orderNumber, timestamp } })
    } catch (err) {
      console.error(err)
      showNotification('Error placing order.')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="checkout-items">
            {cartItems.map(item => {
              const tiers = (() => {
                try {
                  return JSON.parse(item.discountTiers || '[]')
                } catch {
                  return []
                }
              })()

              const nextTier = tiers.find(t => item.salesCount < t.sales)
              const ordersLeft = nextTier ? nextTier.sales - item.salesCount : null

              return (
                <div key={item.id} className="checkout-item">
                  <img src={item.image} alt={item.title} />
                  <div className="checkout-info">
                    <h3>{item.title}</h3>
                    <p>
                      ${item.price.toFixed(2)} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    {ordersLeft !== null && (
                      <p className="order-left">
                        <span className="order-alert">
                          Only <b>{ordersLeft}</b> more order{ordersLeft !== 1 ? 's' : ''} until{' '}
                          <b>{nextTier.percent}% off!</b>
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <h2 className="checkout-total">Total: ${total.toFixed(2)}</h2>

          <form onSubmit={handleSubmit} className="checkout-form">
            <h3>Shipping Info</h3>
            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
            <input type="text" name="address" placeholder="Billing Address" onChange={handleChange} required />
            <button type="submit" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default Checkout
