import * as THREE from 'three';

// defines behavior + creates particles object --> effects actually ran/called in SceneCanvas EVERY FRAME 
export function secret_technique_blue(scene, options = {}) {
  const {
    count = 100000,
    pointSize = 0.01,
    maxRadius = 5, // how far particles can spread
    opacity = 0.95,

    randomness = 0.2,
    randomnessPower = 3,

    speed = 6,
    stiffness = speed * 6, // how aggressively it moves
    damping = 10, // how quickly it settles

    wobbleAmplitude = 0.12,
    wobbleFrequency = 10,

    insideColor = 0x9fe6ff,
    outsideColor = 0x1a46ff,

    // camera shake
    shakeEnabled = true,
    shakePosAmp = 0.06,
    shakeRotAmp = 0.015,
    shakeFreq1 = 26,
    shakeFreq2 = 39,
    shakeFreq3 = 19,
    shakeBurstSeconds = 0.22,
    shakeAlways = true,

    epsilon = 0.001, // "close enough" threshold for stopping motion
    epsilonVel = 0.001, // "close enough" threshold for stopping velocity
  } = options; // if no options --> default values

  const inside = new THREE.Color(insideColor);
  const outside = new THREE.Color(outsideColor);

  // count * 3 --> (x, y, z)
  const basePositions = new Float32Array(count * 3); // original position
  const directions = new Float32Array(count * 3); 
  const wobblePhase = new Float32Array(count); // random offset

  const positions = new Float32Array(count * 3); // current position
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const idx3 = i * 3;

    // random outward direction (random direction in 3D --> normalizes into unit vector)
    let x = 0;
    let y = 0;
    let z = 0;
    let magSq = 0;
    while (magSq === 0 || magSq > 1) {
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      z = Math.random() * 2 - 1;
      magSq = x * x + y * y + z * z;
    }
    const invMag = 1 / Math.sqrt(magSq);
    const ux = x * invMag;
    const uy = y * invMag;
    const uz = z * invMag;

    directions[idx3] = ux;
    directions[idx3 + 1] = uy;
    directions[idx3 + 2] = uz;

    // radius --> how far/spread from center particle goes
    const r = Math.pow(Math.random(), 1.45) * maxRadius;

    // random noise --> variation to particle positions
    const noiseScale = Math.pow(Math.random(), randomnessPower) * randomness * r;
    const nx = noiseScale * (Math.random() < 0.5 ? 1 : -1);
    const ny = noiseScale * (Math.random() < 0.5 ? 1 : -1);
    const nz = noiseScale * (Math.random() < 0.5 ? 1 : -1);

    basePositions[idx3] = ux * r + nx;
    basePositions[idx3 + 1] = uy * r + ny;
    basePositions[idx3 + 2] = uz * r + nz;

    // color gradient --> closer to center = inside color, farther = outside color
    const mix = maxRadius > 0 ? Math.min(1, Math.max(0, r / maxRadius)) : 0;
    colors[idx3] = inside.r + (outside.r - inside.r) * mix;
    colors[idx3 + 1] = inside.g + (outside.g - inside.g) * mix;
    colors[idx3 + 2] = inside.b + (outside.b - inside.b) * mix;

    // random wobble phase --> each particle starts at diff point in orbit 
    wobblePhase[i] = Math.random() * Math.PI * 2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: pointSize,
    sizeAttenuation: true, // size decreases with distance
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending, // imp for glow effect
    vertexColors: true,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // curr state of effect (how it's currently behaving)
  const state = {
    // expand 
    // vaccum 
    // idle 
    // transitioning 

    dir: 1, // direction of animation: 1 => expand, -1 => vacuum in
    scale: 0, // current expansion amount: 0 => collapsed, 1 => expanded
    vel: 0,
    basePositions,
    directions,
    wobblePhase,
    active: false,
    shakeBurst: 0, // time until next shake burst
  };

  // attaches state to object 
  points.userData.blueEffectState = state;

  let time = 0;

  // update --> updates the state of the effect based on the time delta
  const update = (dt) => {
    time += dt;
    state.shakeBurst = Math.max(0, state.shakeBurst - dt);

    // desired scale --> 1 for expand, 0 for vacuum
    const desired = state.dir === 1 ? 1 : 0;

    // if system at rest --> return
    if (
      !state.active &&
      Math.abs(desired - state.scale) < epsilon &&
      Math.abs(state.vel) < epsilonVel
    ) {
      return;
    }

    state.active = true;

    // Spring motion --> moves scale toward desired scale
    const delta = desired - state.scale;
    state.vel += delta * stiffness * dt;
    state.vel *= Math.exp(-damping * dt);
    state.scale += state.vel * dt;

    //if close to desired scale --> stop motion (prevents forever jittering)
    if (
      Math.abs(desired - state.scale) < epsilon &&
      Math.abs(state.vel) < epsilonVel
    ) {
      state.scale = desired;
      state.vel = 0;
      state.active = false;
    }

    // wobble strength --> wobble stronger when collapsed, weaker when expanded.
    const s = state.scale;
    const wobbleStrength = wobbleAmplitude * (1 - s);
    const pos = geometry.attributes.position.array;

    // update position --> final position = base position + animated offset
    for (let i = 0; i < count; i++) {
      const idx3 = i * 3;

      const bx = basePositions[idx3];
      const by = basePositions[idx3 + 1];
      const bz = basePositions[idx3 + 2]; 

      const wx = directions[idx3];
      const wy = directions[idx3 + 1];
      const wz = directions[idx3 + 2];

      const wob = Math.sin(time * wobbleFrequency + state.wobblePhase[i]) * wobbleStrength;

      pos[idx3] = bx * s + wx * wob;
      pos[idx3 + 1] = by * s + wy * wob;
      pos[idx3 + 2] = bz * s + wz * wob;
    }

    geometry.attributes.position.needsUpdate = true;
  };

  // setDirection --> sets the direction of the animation (expand or vacuum)
  const setDirection = (newDir) => {
    state.dir = newDir;
    state.active = true;
    state.shakeBurst = Math.max(state.shakeBurst, shakeBurstSeconds);
  };

  // shouldShake --> determines if shake should be applied based on current state
  const shouldShake = () => {
    if (!shakeEnabled) return false;
    if (shakeAlways) return true;
    return (
      state.shakeBurst > 0 ||
      state.active ||
      (state.scale > 0.001 && state.scale < 0.999)
    );
  };

  // get shake --> returns shake offsets for camera based on current state
  const getShake = (t) => {
    if (!shouldShake()) return null;

    // fadeRaw --> how much shake to apply based on current state (stronger when transitioning)
    const fadeRaw = state.dir === 1 ? 1 - state.scale : state.scale;
    const burst = //burst = temporary extra shake after trigger
      shakeBurstSeconds > 0
        ? Math.max(0, Math.min(1, state.shakeBurst / shakeBurstSeconds))
        : 0;
    const base = shakeAlways ? 0.45 : 0;
    const fade = Math.max(0, Math.min(1, Math.max(fadeRaw, burst, base)));

    // fade --> shake amplitudes (make shake stronger based on fade)
    const ax = shakePosAmp * fade;
    const ay = shakePosAmp * fade;
    const ar = shakeRotAmp * fade;


    return {
      x: (Math.sin(t * shakeFreq1) + Math.sin(t * shakeFreq2) * 0.6) * ax,
      y: (Math.cos(t * (shakeFreq1 + 4)) + Math.cos(t * (shakeFreq2 + 4)) * 0.6) * ay,
      rotZ: Math.sin(t * shakeFreq3) * ar,
    };
  };

  const dispose = () => {
    scene.remove(points);
    geometry.dispose();
    material.dispose();
  };

  // initial shake burst --> visible on spawn
  state.shakeBurst = Math.max(state.shakeBurst, shakeBurstSeconds);

  // return all functions/states to be used in SceneCanvas
  return { points, update, setDirection, shouldShake, getShake, dispose };
}