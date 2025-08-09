import { useNavigate } from 'react-router-dom'

function ProductCard({
  id,
  title,
  price,
  originalPrice,
  image,
  onAddToCart,
  rank,
  salesCount,
  discountTiers
}) {
  if (!title || !price || !image || !id) {
    console.warn('Missing product props in ProductCard:', { title, price, image, id })
    return null
  }

  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/product/${id}`)
  }

  function getNextDiscount(salesCount, discountTiers) {
    const tiers = JSON.parse(discountTiers || '[]')
    for (const tier of tiers) {
      if (salesCount < tier.sales) {
        return {
          remaining: tier.sales - salesCount,
          percent: tier.percent
        }
      }
    }
    return null
  }

  const next = getNextDiscount(salesCount, discountTiers)

  return (
    <div className="product-card" onClick={handleCardClick}>
      {rank && <div className="rank-tag">🏆 Top {rank}</div>}

      <div className="product-image-container">
        <img src={image} alt={title} className="product-image" />
      </div>
      <h3>{title}</h3>

      <div className="price-row">
        <span className="discount-price">${price.toFixed(2)}</span>
        {originalPrice && originalPrice > price && (
          <span className="original-price">${originalPrice.toFixed(2)}</span>
        )}
      </div>

      {/* ✅ New part: only show this if discount is upcoming */}
      {next && (
        <p className="discount-info">
          Only {next.remaining} more order{next.remaining !== 1 && 's'} until {next.percent}% off!
        </p>
      )}

      <button
  onClick={(e) => {
    e.stopPropagation()
    onAddToCart({
      id,
      title,
      price,
      originalPrice,
      image,
      salesCount,
      discountTiers
    })
  }}
>
  Add to Cart
</button>

    </div>
  )
}

export default ProductCard
