import { useCart } from '/src/context/cartContext.jsx'
import './Cart.css'
import { useNavigate } from 'react-router-dom'

function Cart() {
  const navigate = useNavigate()
  const { cartItems, addToCart, removeFromCart } = useCart()

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map(item => {
            const tiers = (() => {
              try {
                return JSON.parse(item.discountTiers || '[]')
              } catch {
                return []
              }
            })()

            // 🔹 FIX: Don't double count — backend's salesCount already includes purchases
            const currentSales = item.salesCount || 0;
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
                          Only <b>{ordersLeft}</b> more order{ordersLeft !== 1 ? 's' : ''} until{' '}
                          <b>{nextTier.percent}% off!</b>
                        </span>
                      </p>
                    )}
                  </div>
                </div>

               <div className="quantity-controls">
                  <button
                    onClick={async () => { await removeFromCart(item, 1); }}
                    disabled={item.quantity <= 0}
                    aria-label="Decrease quantity"
                  >
                    –
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={async () => { await addToCart(item, 1); }}
                    disabled={item.quantity >= item.stock}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>

                  {item.quantity >= item.stock && (
                    <p className="stock-warning">No more in stock</p>
                  )}
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
