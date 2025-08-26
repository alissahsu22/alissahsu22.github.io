import { useParams } from 'react-router-dom'
import { useCart } from '/src/context/cartContext.jsx'
import { useNotification } from '../context/NotificationContext'
import { useProducts } from '../context/ProductContext'
import ProductCard from '../components/ProductCard'
import './CategoryPage.css'
import api from '../api'

function CategoryPage() {
  const { category } = useParams()
  const { addToCart } = useCart()
  const { showNotification } = useNotification()
  const { products, refreshProducts } = useProducts()

  const filtered = Array.isArray(products)
    ? category.toLowerCase() === 'all'
      ? products
      : products.filter(p => p.category?.some(cat => cat.toLowerCase() === category.toLowerCase()))
    : []

  return (
    <div>
      <h2 className="showingResults">Showing results for: {category}</h2>
      <div className="product-grid">
        {filtered.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            originalPrice={product.originalPrice}
            image={product.image}
            rank={product.rank}
            salesCount={product.salesCount}
            discountTiers={product.discountTiers}
            onAddToCart={async () => {
              await addToCart(product, 1)
              showNotification(`${product.title} added to cart!`)
              await refreshProducts()
            }}
          />
        ))}
      </div>
    </div>
  )
}
export default CategoryPage
