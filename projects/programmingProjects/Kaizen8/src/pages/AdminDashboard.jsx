import { useEffect, useState } from 'react'
import { jsPDF } from 'jspdf'
import './AdminDashboard.css'
import { useNavigate } from 'react-router-dom'
import api from '../api'

function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const navigate = useNavigate()
useEffect(() => {
    const isVerified = localStorage.getItem('isAdminVerified')
    if (isVerified !== 'true') navigate('/verify-admin')
  }, [navigate])

  useEffect(() => {
    api.get('/orders').then(r => setOrders(r.data)).catch(err => console.error('orders:', err))
    api.get('/products').then(r => setProducts(r.data)).catch(err => console.error('products:', err))
    api.get('/users').then(r => setUsers(r.data)).catch(err => console.error('users:', err))
  }, [])
  

  const downloadOrdersPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(14)
    doc.text('🧾 All Orders Summary', 10, 10)

    let y = 20
    orders.forEach(order => {
      doc.setFontSize(12)
      doc.text(`Order #${order.orderNumber}`, 10, y)
      y += 6
      doc.text(`Name: ${order.name}`, 10, y)
      y += 6
      doc.text(`Email: ${order.email}`, 10, y)
      y += 6
      doc.text(`Address: ${order.address}`, 10, y)
      y += 6
      doc.text(`Date: ${new Date(order.timestamp).toLocaleString()}`, 10, y)
      y += 6
      doc.text(`Total: $${order.total.toFixed(2)}`, 10, y)
      y += 6

      order.orderData.forEach(item => {
        doc.text(`  • ${item.title} × ${item.quantity}`, 12, y)
        y += 6
      })

      y += 6
      if (y > 270) {
        doc.addPage()
        y = 20
      }
    })

    doc.save('All_Orders.pdf')
  }

  const downloadStockPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(14)
    doc.text('📦 Product Inventory', 10, 10)

    let y = 20
    doc.setFontSize(12)
    doc.text('Title | Stock | Sales | Price', 10, y)
    y += 6
    doc.setFont('courier', 'normal')

    products.forEach(prod => {
      const line = `${prod.title.padEnd(20).slice(0, 20)} | ${prod.stock} | ${prod.salesCount} | $${prod.price.toFixed(2)}`
      doc.text(line, 10, y)
      y += 6

      if (y > 270) {
        doc.addPage()
        y = 20
      }
    })

    doc.save('Inventory_Report.pdf')
  }

  const downloadOrdersCSV = () => {
    const rows = orders.map(order => {
      return [
        order.orderNumber,
        order.name,
        order.email,
        order.address,
        new Date(order.timestamp).toLocaleString(),
        `$${order.total.toFixed(2)}`,
        order.orderData.map(i => `${i.title} × ${i.quantity}`).join('; ')
      ].join(',')
    })
    const header = 'OrderNumber,Name,Email,Address,Date,Total,Items'
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'All_Orders.csv'
    link.click()
  }

  const downloadStockCSV = () => {
    const rows = products.map(p => {
      return [p.title, p.stock, p.salesCount, `$${p.price.toFixed(2)}`].join(',')
    })
    const header = 'Title,Stock,Sales,Price'
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'Inventory_Report.csv'
    link.click()
  }
  return (
    <div className="admin-dashboard">
      <h1>📋 Admin Dashboard</h1>

      <button onClick={() => {
  localStorage.removeItem('isAdminVerified')
  navigate('/')
}}>🚪 Logout Admin</button>


      <div className="section">
        <h2>🧾 Orders</h2>
        <button onClick={downloadOrdersPDF}>📄 Download Orders PDF</button>
        <button onClick={downloadOrdersCSV}>📊 Download Orders CSV</button>

        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date</th>
              <th>Total</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.orderNumber}>
                <td>{order.orderNumber}</td>
                <td>{order.name}</td>
                <td>{order.email}</td>
                <td>{new Date(order.timestamp).toLocaleString()}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>{order.orderData.map(i => `${i.title} × ${i.quantity}`).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        <h2>📦 Inventory</h2>
        <button onClick={downloadStockPDF}>📄 Download Inventory PDF</button>
        <button onClick={downloadStockCSV}>📊 Download Inventory CSV</button>

        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Stock</th>
              <th>Sales</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod.id}>
                <td>{prod.title}</td>
                <td>{prod.stock}</td>
                <td>{prod.salesCount}</td>
                <td>${prod.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        <h2>👥 Users</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


    </div>
  )
}

export default AdminDashboard
