import { useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useNotification } from '../context/NotificationContext'
import { useProducts } from '../context/ProductContext'
import ProductCard from '../components/ProductCard'
import './CategoryPage.css'

function CategoryPage() {
  const { category } = useParams()
  const { addToCart } = useCart()
  const { showNotification } = useNotification()
  const { products, refreshProducts } = useProducts()

  const filtered = Array.isArray(products)
    ? category.toLowerCase() === 'all'
      ? products
      : products.filter(p =>
          p.category?.some(cat => cat.toLowerCase() === category.toLowerCase())
        )
    : []

  return (
    <div>
      <h2 className="showingResults">Showing results for: {category}</h2>
      <div className="product-grid">
        {filtered.map(product => {
          const handleAdd = async () => {
            addToCart(product)
            showNotification(`${product.title} added to cart!`)
            await fetch(`http://localhost:4000/order/${product.id}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ quantity: 1 }),
            })
            await refreshProducts()
          }

          return (
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

                await fetch(`http://localhost:4000/order/${product.id}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ quantity: 1 }),
                })

                product.salesCount += 1  // ✅ live update count for UI

                await refreshProducts()
              }}

            />

          )
        })}
      </div>
    </div>
  )
}

export default CategoryPage
