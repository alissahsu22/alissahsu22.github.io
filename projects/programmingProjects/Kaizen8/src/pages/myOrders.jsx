import { useEffect, useState } from 'react'
import api from '../api'

function MyOrders() {
  const [orders, setOrders] = useState([])
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (!user) return
    api.get('/orders')
      .then(res => setOrders(res.data.filter(o => o.email === user.email)))
      .catch(err => console.error('Failed to fetch orders:', err))
  }, [user])

  if (!user) return <p>Please log in to view your orders.</p>
  
  return (
    <div style={{ padding: '2rem' }}>
      <h2>📦 Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id} style={{ marginBottom: '1rem' }}>
              <strong>Order #{order.orderNumber}</strong><br />
              Total: ${order.total.toFixed(2)}<br />
              Date: {new Date(order.timestamp).toLocaleString()}<br />
              <ul>
                {order.orderData.map((item, idx) => (
                  <li key={idx}>{item.title} × {item.quantity}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MyOrders
