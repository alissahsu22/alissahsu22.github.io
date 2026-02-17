import { useEffect, useRef } from 'react'
import { createScene } from './three/scene'

export default function SceneCanvas({
  orbitSpeed,
  fogEnabled,
  fogDensity,
  floatiness,
  glowStrength,
}) {
  const canvasRef = useRef(null)

  const controlsRef = useRef({
    orbitSpeed,
    fogEnabled,
    fogDensity,
    floatiness,
    glowStrength,
  })

  useEffect(() => {
    controlsRef.current = {
      orbitSpeed,
      fogEnabled,
      fogDensity,
      floatiness,
      glowStrength,
    }
  }, [orbitSpeed, fogEnabled, fogDensity, floatiness, glowStrength])

  useEffect(() => {
    if (!canvasRef.current) return

    const cleanup = createScene({
      canvas: canvasRef.current,
      controlsRef,
    })

    return cleanup
  }, [])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
}
