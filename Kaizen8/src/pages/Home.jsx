import { useCart } from '../context/CartContext'
import { useEffect, useState } from 'react'
import TopSellers from '../components/TopSellers'

function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetch('http://localhost:4000/products')
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <TopSellers products={products} onAddToCart={addToCart} />
    </div>
  )
}

export default Home
