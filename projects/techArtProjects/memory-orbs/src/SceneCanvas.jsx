import { useEffect, useRef } from 'react'
import { createScene } from './three/scene'

export default function SceneCanvas({
  orbitSpeed,
  fogEnabled,
  fogDensity,
  floatiness,
  glowStrength,
  onLoaded,
  hidden = false,
}) {
  const canvasRef = useRef(null)

  const controlsRef = useRef({
    orbitSpeed,
    fogEnabled,
    fogDensity,
    floatiness,
    glowStrength,
  })

  // ✅ keep latest onLoaded without re-running scene init
  const onLoadedRef = useRef(onLoaded)
  useEffect(() => {
    onLoadedRef.current = onLoaded
  }, [onLoaded])

  useEffect(() => {
    controlsRef.current = {
      orbitSpeed,
      fogEnabled,
      fogDensity,
      floatiness,
      glowStrength,
    }
  }, [orbitSpeed, fogEnabled, fogDensity, floatiness, glowStrength])

  // ✅ init scene ONCE
  useEffect(() => {
    if (!canvasRef.current) return

    const cleanup = createScene({
      canvas: canvasRef.current,
      controlsRef,
      onLoaded: () => onLoadedRef.current?.(),
    })

    return cleanup
  }, []) // <-- important: empty deps

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? 'none' : 'auto',
        transition: 'opacity 600ms ease',
      }}
    />
  )
}
