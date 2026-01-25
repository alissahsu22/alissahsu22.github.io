import './LoadingOverlay.css'

function LoadingOverlay() {
  return (
    <div className="loading-overlay">
      <div className="loading-card">
        <div className="spinner" />
        <p className="loading-text">Loading memories…</p>
      </div>
    </div>
  )
}

export default LoadingOverlay
