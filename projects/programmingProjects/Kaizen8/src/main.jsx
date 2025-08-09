import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { CartProvider } from '/src/context/cartContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { ProductProvider } from './context/ProductContext.jsx';
import { UserProvider } from './context/UserContext.jsx';



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
