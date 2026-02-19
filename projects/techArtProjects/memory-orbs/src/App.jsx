import { useCallback, useState } from 'react'
import SceneCanvas from './SceneCanvas'
import LoadingOverlay from './LoadingOverlay'
import ControlsPanel from './ControlsPanel'

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false)

  const [orbitSpeed, setOrbitSpeed] = useState(1)
  const [fogEnabled, setFogEnabled] = useState(true)
  const [fogDensity, setFogDensity] = useState(0.05)
  const [floatiness, setFloatiness] = useState(1)
  const [glowStrength, setGlowStrength] = useState(1)

  const [panelOpen, setPanelOpen] = useState(true)

  // ✅ stable function identity across renders
  const handleLoaded = useCallback(() => {
    setIsLoaded(true)
  }, [])

  return (
    <>
      {!isLoaded && <LoadingOverlay />}

      <SceneCanvas
        orbitSpeed={orbitSpeed}
        fogEnabled={fogEnabled}
        fogDensity={fogDensity}
        floatiness={floatiness}
        glowStrength={glowStrength}
        onLoaded={handleLoaded}
        hidden={!isLoaded}
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
        panelOpen={panelOpen}
        setPanelOpen={setPanelOpen}
      />
    </>
  )
}
