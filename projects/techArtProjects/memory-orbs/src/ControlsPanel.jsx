import './ControlPanel.css' 

function ControlsPanel({ orbitSpeed, setOrbitSpeed }) {
  
  return (
    <div className="controls-panel">
      <label htmlFor="orbitSpeed">
        Orbit Speed: {orbitSpeed}
      </label>

      <input
        type="range"
        id="orbitSpeed"
        min="1"
        max="10"
        step="1"
        value={orbitSpeed}
        onChange={(e) => {
        // console.log('slider value:', e.target.value)
        setOrbitSpeed(Number(e.target.value))
      }}
      />
    </div>
  )
}

export default ControlsPanel