import {createScene} from './three/scene.js'
import { useEffect, useRef } from 'react'

function SceneCanvas({orbitSpeed}){
    const canvasRef = useRef(null)
    const orbitSpeedRef = useRef(orbitSpeed)

    useEffect( ()=>{
        orbitSpeedRef.current = orbitSpeed
        console.log('orbitSpeed updated:', orbitSpeed)
    }, [orbitSpeed])

    useEffect(() => {
        if (!canvasRef.current) return

        const cleanup = createScene({
        canvas: canvasRef.current,
        orbitSpeedRef
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