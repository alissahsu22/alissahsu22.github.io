// src/context/ProductContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api' // ✅ uses VITE_API_URL or localhost fallback

const ProductContext = createContext()

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const refreshProducts = async () => {
    const { data } = await api.get('/products')
    setProducts(data)
  }

  const refreshCategories = async () => {
    const { data } = await api.get('/categories')
    setCategories(data)
  }

  useEffect(() => {
    ;(async () => {
      try {
        await Promise.all([refreshProducts(), refreshCategories()])
      } catch (err) {
        console.error('Failed to load data:', err)
      }
    })()
  }, [])

  return (
    <ProductContext.Provider
      value={{ products, categories, refreshProducts, refreshCategories }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => useContext(ProductContext)
