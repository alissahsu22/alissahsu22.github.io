import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FaBars } from 'react-icons/fa'
import './CategoryBar.css'
import api from '../api'                           // ✅ add

function CategoryBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const match = location.pathname.match(/^\/category\/(.+)$/)
    setSelectedCategory(match ? match[1].toLowerCase() : '')
  }, [location.pathname])

  useEffect(() => {
    api.get('/categories')                        
      .then(res => setCategories(res.data))
      .catch(console.error)
  }, [])

  const handleCategoryChange = (e) => {
    const selected = e.target.value
    setSelectedCategory(selected)
    if (selected) navigate(`/category/${selected}`)
  }

  return (
    <div className="category-bar">
      <div className={`category-item ${selectedCategory ? 'active' : ''}`} style={{ display:'flex', alignItems:'center', gap:'5px' }}>
        <FaBars />
        <select value={selectedCategory} onChange={handleCategoryChange} className="category-select">
          <option value="" disabled>Categories</option>
          <option value="all">All Products</option>
          {categories.map(cat => (
            <option key={cat} value={cat.toLowerCase()}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className={`category-item ${location.pathname === '/best-sellers' ? 'active' : ''}`} onClick={() => navigate('/best-sellers')}>Best Sellers</div>
      <div className={`category-item ${location.pathname === '/new-arrivals' ? 'active' : ''}`} onClick={() => navigate('/new-arrivals')}>New Arrivals</div>
      <div className={`category-item ${location.pathname === '/deals' ? 'active' : ''}`} onClick={() => navigate('/deals')}>Deals</div>
      <div className={`category-item ${location.pathname === '/our-story' ? 'active' : ''}`} onClick={() => navigate('/our-story')}>Our Story</div>
    </div>
  )
}
export default CategoryBar
