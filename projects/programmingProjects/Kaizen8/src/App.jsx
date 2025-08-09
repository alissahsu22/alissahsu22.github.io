import { Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './pages/Home.jsx';
import Cart from './pages/Cart.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import NavBar from './components/NavBar.jsx';
import Account from './pages/Account.jsx';
import SearchResults from './pages/SearchResults.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import CategoryBar from './components/CategoryBar.jsx';
import SignUp from './pages/SignUp.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import VerifyAdmin from './pages/VerifyAdmin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import MyOrders from './pages/MyOrders.jsx';





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
        <Route path="/signup" element={<SignUp />} />

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
