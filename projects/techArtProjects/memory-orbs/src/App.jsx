import { useState } from 'react'
import SceneCanvas from './SceneCanvas'
import ControlsPanel from './ControlsPanel'

export default function App() {
  const [orbitSpeed, setOrbitSpeed] = useState(1)

  const [fogEnabled, setFogEnabled] = useState(true)
  const [fogDensity, setFogDensity] = useState(0.025)

  const [floatiness, setFloatiness] = useState(1) 
  const [glowStrength, setGlowStrength] = useState(1.5) 

  return (
    <>
      <SceneCanvas
        orbitSpeed={orbitSpeed}
        fogEnabled={fogEnabled}
        fogDensity={fogDensity}
        floatiness={floatiness}
        glowStrength={glowStrength}
      />

      <ControlsPanel
        orbitSpeed={orbitSpeed}
        setOrbitSpeed={setOrbitSpeed}
        fogEnabled={fogEnabled}
        setFogEnabled={setFogEnabled}
        fogDensity={fogDensity}
        setFogDensity={setFogDensity}
        floatiness={floatiness}
        setFloatiness={setFloatiness}
        glowStrength={glowStrength}
        setGlowStrength={setGlowStrength}
      />
    </>
  )
}

