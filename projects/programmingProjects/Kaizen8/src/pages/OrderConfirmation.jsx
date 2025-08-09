import { useLocation, useNavigate } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import { useEffect, useState } from 'react'
import './OrderConfirmation.css'

function OrderConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()

  const { state } = useLocation()
  const { orderNumber, name, timestamp, email, cartItems, total, address } = state;


  console.log(orderNumber)


  const generatePDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Kaizen8 - Order Receipt', 20, 20)
    doc.setFontSize(12)
    doc.text(`Order Number: ${orderNumber}`, 20, 30)
    doc.text(`Date: ${timestamp}`, 20, 37)
    doc.text(`Customer: ${name}`, 20, 44)
    doc.text(`Email: ${email}`, 20, 51)
    doc.text(`Billing Address: ${address}`, 20, 58)

    doc.text('Items:', 20, 70)
    let y = 78
    cartItems.forEach(item => {
      doc.text(`${item.title} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`, 25, y)
      y += 7
    })

    doc.text(`Total Paid: $${total.toFixed(2)}`, 20, y + 10)
    doc.text('Thank you for shopping with Kaizen8!', 20, y + 20)

    doc.save(`receipt_${orderNumber}.pdf`)
  }

  return (
    <div className="order-confirmation">
      <h1>✅ Order Confirmed!</h1>
      <p>Thank you, <strong>{name}</strong>!</p>
      <p>Pick up at <strong>Kaizen8</strong></p>

      <p><strong>Order Number:</strong> {orderNumber}</p>
      <p><strong>Date:</strong> {timestamp}</p>
      <p><strong>Email Receipt sent to:</strong> {email}</p>
      <div className = 'order-summary'>
        <h3>Order Summary:</h3>
        <ul>
          {cartItems?.map((item) => (
            <li key={item.id}>
              {item.title} × {item.quantity} = ${(
                item.price * item.quantity
              ).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      <p><strong>Total Paid:</strong> ${total?.toFixed(2)}</p>

      <div className="button-group">
        <button onClick={() => navigate('/')}>Back to Home</button>
        <button onClick={generatePDF}>Download Receipt</button>
      </div>
    </div>
  )
}

export default OrderConfirmation
