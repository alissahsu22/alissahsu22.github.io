import './ControlPanel.css'

export default function ControlsPanel({
  orbitSpeed, setOrbitSpeed,
  fogEnabled, setFogEnabled,
  fogDensity, setFogDensity,
  floatiness, setFloatiness,
  glowStrength, setGlowStrength
}) {
  return (
    <div className="panel">
      <div className="panelHeader">
        <div className="title">Scene Controls</div>
      </div>

      <div className="row">
        <div className="rowTop">
          <span>Orbit Speed</span>
          <span className="value">{orbitSpeed.toFixed(1)}</span>
        </div>
        <input
          className="slider"
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={orbitSpeed}
          onChange={(e) => setOrbitSpeed(Number(e.target.value))}
        />
      </div>

      {/* <div className="row switchRow">
        <div className="rowTop">
          <span>Fog</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={fogEnabled}
              onChange={(e) => setFogEnabled(e.target.checked)}
            />
            <span className="sliderKnob" />
          </label>
        </div>
      </div> */}

      <div className={`row ${!fogEnabled ? 'disabled' : ''}`}>
        <div className="rowTop">
          <span>Fog</span>
          <span className="value">{fogDensity.toFixed(3)}</span>
        </div>
        <input
          className="slider"
          type="range"
          min="0"
          max="0.12"
          step="0.002"
          value={fogDensity}
          onChange={(e) => setFogDensity(Number(e.target.value))}
          disabled={!fogEnabled}
        />
      </div>

      <div className="row">
        <div className="rowTop">
          <span>Floatiness</span>
          <span className="value">{floatiness.toFixed(1)}</span>
        </div>
        <input
          className="slider"
          type="range"
          min="0"
          max="3"
          step="0.1"
          value={floatiness}
          onChange={(e) => setFloatiness(Number(e.target.value))}
        />
      </div>

      <div className="row">
        <div className="rowTop">
          <span>Glow</span>
          <span className="value">{glowStrength.toFixed(1)}</span>
        </div>
        <input
          className="slider"
          type="range"
          min="0"
          max="3"
          step="0.1"
          value={glowStrength}
          onChange={(e) => setGlowStrength(Number(e.target.value))}
        />
      </div>
    </div>
  )
}
