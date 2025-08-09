import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import logo from '../assets/logo.jpeg'
import './NavBar.css'
import { FaUser, FaSearch, FaShoppingCart } from 'react-icons/fa'
import { useCart } from '/src/context/cartContext.jsx'
import React from 'react'
import { useUser } from '../context/UserContext'


function NavBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')
  const { cartItems } = useCart()

  const { user, setUser } = useUser()

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    if (storedUser) setUser(storedUser)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }


  
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const query = params.get('query') || ''
    setSearchInput(query)
  }, [location.search])

  useEffect(() => {
    const delay = setTimeout(() => {
      const onSearchPage = location.pathname === '/search'
      if (searchInput.trim() === '') {
        if (onSearchPage) navigate('/')
      } else {
        navigate(`/search?query=${encodeURIComponent(searchInput)}`)
      }
    }, 200)
    return () => clearTimeout(delay)
  }, [searchInput, navigate, location.pathname])

  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={() => navigate('/')}>
        <img className="logo" src={logo} alt="Kaizen8 Logo" />
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search Kaizen8"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          className="search-btn"
          onClick={(e) => {
            e.preventDefault()
            if (searchInput.trim()) {
              navigate(`/search?query=${encodeURIComponent(searchInput)}`)
            }
          }}
        >
          <FaSearch />
        </button>

      </div>

      <div className="nav-right">
  {user ? (
    <div className="user-menu">
      <div className="account-text">
        <small>Hello,</small>
        <strong>{user.name}</strong>
      </div>
      <button onClick={handleLogout} className="nav-btn">Logout</button>
      <button onClick={() => navigate('/my-orders')} className="nav-btn">View Orders</button>
    </div>
  ) : (
    <div className="account" onClick={() => navigate('/myAccount')}>
      <FaUser />
      <div className="account-text">
        <small>Login/Sign Up</small>
        <strong>My Account</strong>
      </div>
    </div>
  )}

  {/* Cart always visible */}
  <div className="cart" onClick={() => navigate('/cart')}>
    <FaShoppingCart />
    {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
  </div>
</div>

      
    </nav>
  )
}

export default React.memo(NavBar)


