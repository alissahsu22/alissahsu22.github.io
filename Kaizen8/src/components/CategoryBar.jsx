import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FaBars } from 'react-icons/fa'
import './CategoryBar.css'

function CategoryBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    // Set selected category based on the URL
    const match = location.pathname.match(/^\/category\/(.+)$/)
    if (match) {
      setSelectedCategory(match[1].toLowerCase())
    } else {
      setSelectedCategory('')
    }
  }, [location.pathname])

  useEffect(() => {
    // Fetch unique categories from server
    fetch('http://localhost:4000/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(console.error)
  }, [])

  const goTo = (path) => {
    navigate(path)
  }

  const handleCategoryChange = (e) => {
    const selected = e.target.value
    setSelectedCategory(selected)
    if (selected) navigate(`/category/${selected}`)
  }

  return (
    <div className="category-bar">
      <div
        className={`category-item ${selectedCategory ? 'active' : ''}`}
        style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
      >
        <FaBars />
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="category-select"
        >
          <option value="" disabled>Categories</option>
          <option value="all">All Products</option>
          {categories.map(cat => (
            <option key={cat} value={cat.toLowerCase()}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className={`category-item ${location.pathname === '/best-sellers' ? 'active' : ''}`} onClick={() => goTo('/best-sellers')}>
        Best Sellers
      </div>

      <div className={`category-item ${location.pathname === '/new-arrivals' ? 'active' : ''}`} onClick={() => goTo('/new-arrivals')}>
        New Arrivals
      </div>

      <div className={`category-item ${location.pathname === '/deals' ? 'active' : ''}`} onClick={() => goTo('/deals')}>
        Deals
      </div>

      <div className={`category-item ${location.pathname === '/our-story' ? 'active' : ''}`} onClick={() => goTo('/our-story')}>
        Our Story
      </div>
    </div>
  )
}

export default CategoryBar
