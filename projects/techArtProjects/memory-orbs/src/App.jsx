import { useState, useEffect } from 'react'
import './App.css'
import SceneCanvas from './SceneCanvas.jsx'
import ControlsPanel from './ControlsPanel.jsx'

function App() {
  const [orbitSpeed, setOrbitSpeed] = useState(1)

  useEffect(() => {
    console.log('App orbitSpeed:', orbitSpeed)
  }, [orbitSpeed])

  return (
    <>
     <SceneCanvas orbitSpeed={orbitSpeed}/>
     <ControlsPanel orbitSpeed={orbitSpeed} setOrbitSpeed = {setOrbitSpeed}/>
     </>
  )
}

export default App
