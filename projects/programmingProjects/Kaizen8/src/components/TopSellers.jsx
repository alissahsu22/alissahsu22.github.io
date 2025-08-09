import { useNavigate } from 'react-router-dom'
import { useCart } from '/src/context/cartContext.jsx'
import { useNotification } from '../context/NotificationContext'
import { useProducts } from '../context/ProductContext'
import api from '../api'                            // ✅ replace axios import
import './TopSeller.css'

function TopSellers({ products }) {
  const { refreshProducts } = useProducts()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { showNotification } = useNotification()

  const handleAdd = async (product) => {
    try {
      addToCart(product)
      showNotification(`${product.title} added to cart!`)
      await api.post(`/order/${product.id}`, { quantity: 1 })   // ✅ was axios.post('http://localhost...')
      product.salesCount += 1
      await refreshProducts()
    } catch (err) {
      console.error('Failed to update sales:', err)
    }
  }

  const topThree = products.filter(p => p.rank <= 3).sort((a, b) => a.rank - b.rank)

  return (
    <div>
      <h2 className="leaderboard-header">Leaderboard Items</h2>
      <div className="leaderboard-container">
        <div className="product-grid">
          {topThree.map((product) => {
            const { salesCount = 0, originalPrice = null, price = null, discountTiers = '[]' } = product
            const tiers = JSON.parse(discountTiers || '[]')
            const nextTier = tiers.find(t => salesCount < t.sales)
            const ordersLeft = nextTier ? nextTier.sales - salesCount : null
            const discountPercent = (originalPrice && price) ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

            return (
              <div className="product-card" key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
                <div className="rank-tag">🏆 Top {product.rank}</div>
                <div className="discount-tag">{discountPercent}% off</div>
                <div className="product-image-container">
                  <img src={product.image} alt={product.title} className="product-image" />
                </div>
                <p className="price">
                  <span className="sale">${price?.toFixed(2)}</span>{' '}
                  {originalPrice && <span className="original">${originalPrice.toFixed(2)}</span>}
                </p>
                <p>{product.title}</p>
                {ordersLeft !== null && (
                  <p className="order-left">
                    Only <b>{ordersLeft}</b> more order{ordersLeft !== 1 ? 's' : ''} until <b>{nextTier.percent}%</b> off
                  </p>
                )}
                <button onClick={(e) => { e.stopPropagation(); handleAdd(product) }}>
                  Add to Cart
                </button>
              </div>
            )
          })}
        </div>
        <div>
          <button className="seeAll-btn" onClick={() => navigate('/category/all')}>See All</button>
        </div>
      </div>
    </div>
  )
}
export default TopSellers
