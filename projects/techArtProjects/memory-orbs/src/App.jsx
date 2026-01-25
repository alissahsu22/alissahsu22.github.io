import { useState } from 'react'
import './App.css'
import SceneCanvas from './SceneCanvas.jsx'
import ControlsPanel from './ControlsPanel.jsx'
import LoadingOverlay from './LoadingOverlay.jsx'

function App() {
  const [orbitSpeed, setOrbitSpeed] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <>
      {!isLoaded && <LoadingOverlay />}

      <SceneCanvas
        orbitSpeed={orbitSpeed}
        onLoaded={() => setIsLoaded(true)}
      />

      <ControlsPanel
        orbitSpeed={orbitSpeed}
        setOrbitSpeed={setOrbitSpeed}
      />
    </>
  )
}

export default App
