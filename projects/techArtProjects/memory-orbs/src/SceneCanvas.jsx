import { createScene } from './three/scene.js'
import { useEffect, useRef } from 'react'

function SceneCanvas({ orbitSpeed, onLoaded }) {
  const canvasRef = useRef(null)
  const orbitSpeedRef = useRef(orbitSpeed)

  useEffect(() => {
    orbitSpeedRef.current = orbitSpeed
  }, [orbitSpeed])

  useEffect(() => {
    if (!canvasRef.current) return

    const cleanup = createScene({
      canvas: canvasRef.current,
      orbitSpeedRef,
      onLoaded   
    })

    return cleanup
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="webgl"
      style={{
        width: '100%',
        height: '100%',
        display: 'block'
      }}
    />
  )
}

export default SceneCanvas
