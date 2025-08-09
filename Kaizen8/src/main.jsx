import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { CartProvider } from './context/CartContext'
import { NotificationProvider } from './context/NotificationContext'
import { ProductProvider } from './context/ProductContext'
import { UserProvider } from './context/UserContext'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
  <ProductProvider>
  <NotificationProvider>
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
  </NotificationProvider>
  </ProductProvider>
  </UserProvider>
  </React.StrictMode>

)
