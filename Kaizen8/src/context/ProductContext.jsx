import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const ProductContext = createContext()

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:4000/products')
      setProducts(res.data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <ProductContext.Provider value={{ products, refreshProducts: fetchProducts }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => useContext(ProductContext)
