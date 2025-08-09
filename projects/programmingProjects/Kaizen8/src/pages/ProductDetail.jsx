import { useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useNotification } from '../context/NotificationContext'
import { useProducts } from '../context/ProductContext'
import axios from 'axios'
import './ProductDetail.css'

function ProductDetails() {
  const { id } = useParams()
  const { products, refreshProducts } = useProducts()
  const { addToCart } = useCart()
  const { showNotification } = useNotification()

  const product = products.find(p => p.id === parseInt(id))
  if (!product) return <p>Product not found.</p>

  const {
    title,
    image,
    price,
    originalPrice,
    salesCount = 0,
    discountTiers = '[]',
  } = product

  const tiers = JSON.parse(discountTiers || '[]')
  const nextTier = tiers.find(t => salesCount < t.sales)
  const ordersLeft = nextTier ? nextTier.sales - salesCount : null
  const discountPercent = nextTier
    ? nextTier.percent
    : originalPrice
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0

  const handleAdd = async () => {
    try {
      addToCart(product)
      showNotification(`${title} added to cart!`)
      await axios.post(`http://localhost:4000/order/${product.id}`, { quantity: 1 })
      product.salesCount += 1 // 🔁 update locally
      await refreshProducts()
    } catch (err) {
      console.error('Failed to update sales:', err)
    }
  }

  return (
    <div className="product-details-container">
      <img className="product-image" src={image} alt={title} />
      <div className="product-info">
        <h2>{title}</h2>
        <p className="product-price">${price.toFixed(2)}</p>
        {originalPrice && (
          <p className="original-price">Was ${originalPrice.toFixed(2)}</p>
        )}

        {ordersLeft !== null && (
          <p className="order-left">
            <span className="order-alert">
              Only <b>{ordersLeft}</b> more order
              {ordersLeft !== 1 ? 's' : ''} until <b>{discountPercent}% off!</b>
            </span>
          </p>
        )}

        <button onClick={handleAdd}>Add to Cart</button>
      </div>
    </div>
  )
}

export default ProductDetails
