import { useCart } from '/src/context/cartContext.jsx'
import { useEffect, useState } from 'react'
import TopSellers from '../components/TopSellers'
import api from '../api'

function Home() {
  const [products, setProducts] = useState([])
  const { addToCart } = useCart()

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data)).catch(console.error)
  }, [])

  return (
    <div>
      <TopSellers products={products} onAddToCart={addToCart} />
    </div>
  )
}
export default Home

