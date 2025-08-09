import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/home'
import Cart from './pages/Cart'
import ProductDetail from './pages/ProductDetail'
import NavBar from './components/NavBar'
import Account from './pages/Account'
import SearchResults from './pages/SearchResults'
import CategoryPage from './pages/CategoryPage'
import CategoryBar from './components/CategoryBar'
import Signup from './pages/SignUp'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import VerifyAdmin from './pages/VerifyAdmin'
import AdminDashboard from './pages/AdminDashboard'
import MyOrders from './pages/myOrders'




// inside your <Routes>



// Inside <Routes>:

// import CartFooter from './context/cartFooter'

function App() {
  return (
    <>
      
      <NavBar />
      <CategoryBar />
      
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/search" element={<SearchResults />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        
        <Route path="/myAccount" element={<Account />} /> 
        <Route path="/signup" element={<Signup />} />

        <Route path="/cart" element={<Cart />} /> 
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />

        <Route path="/product/:id" element={<ProductDetail />} />

        <Route path="/my-orders" element={<MyOrders />} />


        <Route path="/verify-admin" element={<VerifyAdmin />} />
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>

    </>
  )
}

export default App
