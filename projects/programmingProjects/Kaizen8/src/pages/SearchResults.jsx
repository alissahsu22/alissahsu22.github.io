import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { useCart } from '/src/context/cartContext.jsx'
import { useNotification } from '../context/NotificationContext'
import { useProducts } from '../context/ProductContext'
import api from '../api'

function useQuery() { return new URLSearchParams(useLocation().search) }

function SearchResults() {
  const { addToCart } = useCart()
  const { showNotification } = useNotification()
  const { refreshProducts } = useProducts()
  const query = useQuery().get('query') || ''
  const [products, setProducts] = useState([])

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data)).catch(console.error)
  }, [])

  const filtered = products.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))

  return (
    <div>
      <h2 style={{ padding: '1rem', fontWeight: 'bold' }}>Search results for "{query}"</h2>
      {filtered.length === 0 ? (
        <p style={{ padding: '1rem' }}>No products found.</p>
      ) : (
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
                addToCart(product)
                showNotification(`${product.title} added to cart!`)
                await api.post(`/order/${product.id}`, { quantity: 1 })
                product.salesCount += 1
                await refreshProducts()
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
export default SearchResults
