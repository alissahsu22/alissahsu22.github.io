import * as THREE from 'three';

function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function createOrbTexture({ size = 1024 } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0.00, 'rgba(255,255,255,1)');
  g.addColorStop(0.05, 'rgba(255,255,255,1)');
  g.addColorStop(0.10, 'rgba(255,245,255,1)');
  g.addColorStop(0.18, 'rgba(255,180,255,0.98)');
  g.addColorStop(0.30, 'rgba(245,110,255,0.92)');
  g.addColorStop(0.50, 'rgba(175,70,255,0.62)');
  g.addColorStop(0.75, 'rgba(110,35,220,0.18)');
  g.addColorStop(1.00, 'rgba(0,0,0,0)');

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createHaloTexture({ size = 1024 } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0.0, 'rgba(255,255,255,0)');
  g.addColorStop(0.08, 'rgba(255,230,255,0.04)');
  g.addColorStop(0.18, 'rgba(255,180,255,0.14)');
  g.addColorStop(0.36, 'rgba(220,120,255,0.32)');
  g.addColorStop(0.58, 'rgba(168,85,247,0.42)');
  g.addColorStop(0.82, 'rgba(124,58,237,0.18)');
  g.addColorStop(1.0, 'rgba(0,0,0,0)');

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createVoidSpiralTexture({
  size = 1024,
  arms = 5,
  turns = 7,
  innerRadius = 0.02,
  outerRadius = 0.72,
  stroke = { r: 90, g: 40, b: 130 },
} = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const cx = size / 2;
  const cy = size / 2;
  const rMax = size / 2;

  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.globalCompositeOperation = 'lighter';

  const inner = rMax * innerRadius;
  const outer = rMax * outerRadius;

  for (let a = 0; a < arms; a++) {
    const armPhase = (a / arms) * Math.PI * 2 + Math.random() * 0.25;

    for (let i = 0; i < 650; i++) {
      const u0 = i / 650;
      const u1 = (i + 1) / 650;

      const r0 = inner + (outer - inner) * Math.pow(u0, 0.78);
      const r1 = inner + (outer - inner) * Math.pow(u1, 0.78);

      const curl0 = Math.sin(u0 * 16 + a * 0.7) * 0.22;
      const curl1 = Math.sin(u1 * 16 + a * 0.7) * 0.22;

      const t0 = armPhase + u0 * turns * Math.PI * 2 + curl0;
      const t1 = armPhase + u1 * turns * Math.PI * 2 + curl1;

      const x0 = Math.cos(t0) * r0;
      const y0 = Math.sin(t0) * r0;
      const x1 = Math.cos(t1) * r1;
      const y1 = Math.sin(t1) * r1;

      const alpha = 0.008 + (1 - u0) * 0.06;
      const width = size * (0.0008 + (1 - u0) * 0.0022);

      ctx.strokeStyle = `rgba(${stroke.r},${stroke.g},${stroke.b},${alpha})`;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }
  }

  ctx.restore();
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function makeSprite(texture, color, scale, opacity, blending = THREE.AdditiveBlending) {
  const material = new THREE.SpriteMaterial({
    map: texture,
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    depthTest: true,
    blending,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(scale, scale, 1);
  return sprite;
}

function createPurpleParticleBall({ orbRadius, count = 38000 } = {}) {
  const n = Math.max(0, Math.floor(count));
  if (n === 0) return null;

  const positions = new Float32Array(n * 3);
  const baseDirs = new Float32Array(n * 3);
  const baseR = new Float32Array(n);
  const phases = new Float32Array(n);
  const colors = new Float32Array(n * 3);
  const sizes = new Float32Array(n);

  const cInner = new THREE.Color(0xffffff);
  const cMid = new THREE.Color(0xf0abfc);
  const cOuter = new THREE.Color(0x9333ea);

  for (let i = 0; i < n; i++) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.acos(2 * Math.random() - 1);
    const dx = Math.sin(v) * Math.cos(u);
    const dy = Math.sin(v) * Math.sin(u);
    const dz = Math.cos(v);

    const ix = i * 3;
    baseDirs[ix] = dx;
    baseDirs[ix + 1] = dy;
    baseDirs[ix + 2] = dz;

    const rr = Math.pow(Math.random(), 2.8);
    const r0 = orbRadius * (0.05 + rr * 1.05);
    baseR[i] = r0;

    positions[ix] = dx * r0;
    positions[ix + 1] = dy * r0;
    positions[ix + 2] = dz * r0;

    phases[i] = Math.random() * Math.PI * 2;
    sizes[i] = rand(0.6, 1.8);

    const t = Math.min(1, r0 / (orbRadius * 1.1));
    const col =
      t < 0.35
        ? cInner.clone().lerp(cMid, t / 0.35)
        : cMid.clone().lerp(cOuter, (t - 0.35) / 0.65);

    col.multiplyScalar(0.95 + Math.random() * 0.45);
    colors[ix] = col.r;
    colors[ix + 1] = col.g;
    colors[ix + 2] = col.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.018 * Math.max(0.35, orbRadius),
    vertexColors: true,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);

  return { points, geometry, material, baseDirs, baseR, phases, sizes, n };
}

function stepPurpleParticleBall({ time, ball, expandS, orbRadius }) {
  const { geometry, baseDirs, baseR, phases, sizes, n } = ball;
  const arr = geometry.attributes.position.array;

  const S = expandS;
  const swirl = 0.85 + 0.85 * (1 - Math.min(1, S / 3.0));
  const swirlSpeed = 3.8 + 7.5 * swirl;
  const wobbleAmp = (0.07 + 0.12 * (1 - Math.min(1, S / 3.0))) * orbRadius;

  for (let i = 0; i < n; i++) {
    const ix = i * 3;
    const dx = baseDirs[ix];
    const dy = baseDirs[ix + 1];
    const dz = baseDirs[ix + 2];

    const r = baseR[i] * (0.8 + 2.2 * S);
    const a = time * swirlSpeed + phases[i] + baseR[i] * 2.7;
    const c = Math.cos(a);
    const s = Math.sin(a);

    const rx = dx * c - dy * s;
    const ry = dx * s + dy * c;
    const rz = dz;

    const wob =
      (Math.sin(time * 20 + phases[i]) * 0.7 +
        Math.sin(time * 42 + i * 0.011) * 0.4) *
      wobbleAmp *
      sizes[i];

    arr[ix] = rx * r + wob * rx;
    arr[ix + 1] = ry * r + wob * ry;
    arr[ix + 2] = rz * r + wob * rz;
  }

  geometry.attributes.position.needsUpdate = true;
}

function createSparkBurst({
  count = 500,
  innerRadius = 0.08,
  outerRadius = 1.9,
} = {}) {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const colors = new Float32Array(count * 3);

  const c1 = new THREE.Color(0xffffff);
  const c2 = new THREE.Color(0xe879f9);
  const c3 = new THREE.Color(0xa855f7);

  for (let i = 0; i < count; i++) {
    const ix = i * 3;

    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const dx = Math.sin(phi) * Math.cos(theta);
    const dy = Math.sin(phi) * Math.sin(theta);
    const dz = Math.cos(phi);

    const r = rand(innerRadius, innerRadius * 1.8);
    positions[ix] = dx * r;
    positions[ix + 1] = dy * r;
    positions[ix + 2] = dz * r;

    const speed = rand(outerRadius * 0.4, outerRadius * 1.1);
    velocities[ix] = dx * speed;
    velocities[ix + 1] = dy * speed;
    velocities[ix + 2] = dz * speed;

    phases[i] = Math.random() * Math.PI * 2;

    const mix = Math.random();
    const col =
      mix < 0.3
        ? c1.clone().lerp(c2, mix / 0.3)
        : c2.clone().lerp(c3, (mix - 0.3) / 0.7);

    colors[ix] = col.r;
    colors[ix + 1] = col.g;
    colors[ix + 2] = col.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.04,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  return { points, geometry, material, velocities, phases, count };
}

function stepSparkBurst({ sparkBurst, dt, time, lifeK }) {
  const { geometry, velocities, phases, count } = sparkBurst;
  const arr = geometry.attributes.position.array;

  for (let i = 0; i < count; i++) {
    const ix = i * 3;
    const vx = velocities[ix];
    const vy = velocities[ix + 1];
    const vz = velocities[ix + 2];

    const drag = 1 - dt * 0.6;
    velocities[ix] *= drag;
    velocities[ix + 1] *= drag;
    velocities[ix + 2] *= drag;

    arr[ix] += vx * dt;
    arr[ix + 1] += vy * dt;
    arr[ix + 2] += vz * dt;

    const jitter = 0.012 * (1 - lifeK);
    arr[ix] += Math.sin(time * 30 + phases[i]) * jitter;
    arr[ix + 1] += Math.cos(time * 36 + phases[i] * 1.2) * jitter;
    arr[ix + 2] += Math.sin(time * 28 + phases[i] * 0.8) * jitter;
  }

  geometry.attributes.position.needsUpdate = true;
}

function createStarField({ count = 2200, innerRadius = 7, outerRadius = 30 } = {}) {
  const positions = new Float32Array(count * 3);
  const base = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const colors = new Float32Array(count * 3);

  const c1 = new THREE.Color(0xffffff);
  const c2 = new THREE.Color(0xe9d5ff);
  const c3 = new THREE.Color(0xa855f7);

  for (let i = 0; i < count; i++) {
    const ix = i * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const dx = Math.sin(phi) * Math.cos(theta);
    const dy = Math.sin(phi) * Math.sin(theta);
    const dz = Math.cos(phi);

    const r = rand(innerRadius, outerRadius);
    const x = dx * r;
    const y = dy * r;
    const z = dz * r;
    positions[ix] = x;
    positions[ix + 1] = y;
    positions[ix + 2] = z;
    base[ix] = x;
    base[ix + 1] = y;
    base[ix + 2] = z;

    phases[i] = Math.random() * Math.PI * 2;

    const mix = Math.random();
    const col =
      mix < 0.55
        ? c1.clone().lerp(c2, mix / 0.55)
        : c2.clone().lerp(c3, (mix - 0.55) / 0.45);
    col.multiplyScalar(0.75 + Math.random() * 0.35);
    colors[ix] = col.r;
    colors[ix + 1] = col.g;
    colors[ix + 2] = col.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.03,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  points.renderOrder = 0;
  return { points, geometry, material, base, phases, count };
}

function stepStarField({ starField, time }) {
  const { geometry, base, phases, count } = starField;
  const arr = geometry.attributes.position.array;

  for (let i = 0; i < count; i++) {
    const ix = i * 3;
    const p = phases[i];
    const wob = 0.03 + 0.02 * Math.sin(time * 0.6 + p);
    arr[ix] = base[ix] + Math.sin(time * 2.2 + p) * wob;
    arr[ix + 1] = base[ix + 1] + Math.cos(time * 2.0 + p * 1.13) * wob;
    arr[ix + 2] = base[ix + 2] + Math.sin(time * 1.8 + p * 0.9) * wob;
  }

  geometry.attributes.position.needsUpdate = true;
}

export function secret_technique_purple(scene, options = {}) {
  const {
    orbRadius = 1.0,
    z = -3,
    expandDuration = 0.38,
    holdDuration = 1.6,
  } = options;

  const group = new THREE.Group();
  group.position.z = z;
  group.scale.setScalar(0.3);

  const orbTex = createOrbTexture();
  const haloTex = createHaloTexture();
  const voidTex1 = createVoidSpiralTexture({
    stroke: { r: 95, g: 45, b: 150 },
    arms: 5,
    turns: 6,
    outerRadius: 0.66,
  });
  const voidTex2 = createVoidSpiralTexture({
    stroke: { r: 130, g: 65, b: 190 },
    arms: 4,
    turns: 5,
    outerRadius: 0.58,
  });

  const coreWhite = makeSprite(orbTex, 0xffffff, orbRadius * 2.2, 1);
  const corePink = makeSprite(orbTex, 0xff7af6, orbRadius * 3.5, 0.95);
  const corePurple = makeSprite(orbTex, 0x9333ea, orbRadius * 5.7, 0.72);

  coreWhite.position.z = 0.012;
  corePink.position.z = 0.011;
  corePurple.position.z = 0.010;

  const spiral1 = makeSprite(voidTex1, 0xa855f7, orbRadius * 5.8, 0.12, THREE.AdditiveBlending);
  const spiral2 = makeSprite(voidTex2, 0xd946ef, orbRadius * 4.7, 0.08, THREE.AdditiveBlending);
  spiral1.position.z = 0.004;
  spiral2.position.z = 0.003;

  const innerHalo = makeSprite(haloTex, 0xf5d0fe, orbRadius * 10.5, 0.78, THREE.AdditiveBlending);
  const outerBloom = makeSprite(haloTex, 0xd946ef, orbRadius * 22.0, 0.82, THREE.AdditiveBlending);
  const farBloom = makeSprite(haloTex, 0xffffff, orbRadius * 30.0, 0.24, THREE.AdditiveBlending);

  innerHalo.position.z = -0.02;
  outerBloom.position.z = -0.03;
  farBloom.position.z = -0.04;

  const ball = createPurpleParticleBall({ orbRadius, count: 38000 });
  ball.points.position.z = 0.001;

  const sparks = createSparkBurst({ count: 650, outerRadius: orbRadius * 2.4 });
  sparks.points.position.z = 0.018;

  const stars = createStarField({
    count: 2200,
    innerRadius: orbRadius * 7,
    outerRadius: orbRadius * 30,
  });
  stars.points.position.z = -0.08;

  const litHaloGeom = new THREE.SphereGeometry(orbRadius * 2.9, 48, 32);
  const litHaloMat = new THREE.MeshStandardMaterial({
    color: 0x12031c,
    emissive: 0xc026d3,
    emissiveIntensity: 1.8,
    metalness: 0.12,
    roughness: 0.5,
    transparent: true,
    opacity: 0.17,
    depthWrite: false,
  });
  const litHalo = new THREE.Mesh(litHaloGeom, litHaloMat);
  litHalo.renderOrder = -4;

  const keyLight = new THREE.PointLight(0xffffff, 11.5, 52, 1.25);
  keyLight.position.set(0.45 * orbRadius, 0.25 * orbRadius, 0.75 * orbRadius);

  const fillLight = new THREE.PointLight(0xd946ef, 8.5, 40, 1.5);
  fillLight.position.set(-0.5 * orbRadius, -0.35 * orbRadius, 0.42 * orbRadius);

  const rimLight = new THREE.PointLight(0xc4b5fd, 5.0, 30, 1.8);
  rimLight.position.set(0.18 * orbRadius, 0.68 * orbRadius, -0.25 * orbRadius);

  group.add(
    stars.points,
    litHalo,
    farBloom,
    outerBloom,
    innerHalo,
    spiral1,
    spiral2,
    corePurple,
    corePink,
    coreWhite,
    ball.points,
    sparks.points,
    keyLight,
    fillLight,
    rimLight
  );

  scene.add(group);

  const state = { t: 0, phase: 'expand' };
  let simTime = 0;

  function update(dt) {
    simTime += dt;
    state.t += dt;

    const p = state.phase === 'expand' ? Math.min(1, state.t / expandDuration) : 1;
    const k = easeInOutCubic(p);

    const expandS =
      state.phase === 'expand'
        ? 0.08 + 1.45 * k
        : 1.5 + Math.sin(simTime * 5.4) * 0.07;

    stepPurpleParticleBall({
      time: simTime,
      ball,
      expandS,
      orbRadius,
    });

    ball.material.opacity =
      state.phase === 'expand'
        ? Math.min(1, 0.2 + 1.0 * k)
        : 0.92 + Math.sin(simTime * 8.4) * 0.05;

    const sparkLifeK =
      state.phase === 'expand'
        ? k
        : Math.min(1, state.t / holdDuration);

    stepSparkBurst({
      sparkBurst: sparks,
      dt,
      time: simTime,
      lifeK: sparkLifeK,
    });

    sparks.material.opacity =
      state.phase === 'expand'
        ? 0.6 + k * 0.4
        : 1.0 - sparkLifeK * 0.72;

    stepStarField({ starField: stars, time: simTime });
    const starTwinkle =
      0.72 + Math.sin(simTime * 0.9) * 0.06 + Math.sin(simTime * 2.2) * 0.03;
    stars.material.opacity = 0.55 * starTwinkle;

    spiral1.material.rotation -= dt * 1.2;
    spiral2.material.rotation += dt * 0.95;

    const turbulence = 1 + Math.sin(simTime * 7.8) * 0.03 + Math.sin(simTime * 17.5) * 0.015;

    coreWhite.scale.setScalar(orbRadius * 2.2 * turbulence * (1.0 + Math.sin(simTime * 32) * 0.035));
    corePink.scale.setScalar(orbRadius * 3.5 * turbulence * (1.0 + Math.sin(simTime * 15) * 0.04));
    corePurple.scale.setScalar(orbRadius * 5.7 * turbulence * (1.0 + Math.sin(simTime * 9.5) * 0.035));

    const bloomPulse =
      1 + Math.sin(simTime * 8.0) * 0.08 + Math.sin(simTime * 17.0) * 0.03;
    innerHalo.scale.setScalar(orbRadius * 10.5 * bloomPulse);
    outerBloom.scale.setScalar(orbRadius * 22.0 * bloomPulse * 1.06);
    farBloom.scale.setScalar(orbRadius * 30.0 * (1 + Math.sin(simTime * 6.5) * 0.05));

    innerHalo.material.opacity =
      state.phase === 'expand'
        ? 0.28 + 0.6 * k
        : 0.72 + Math.sin(simTime * 7.2) * 0.06;

    outerBloom.material.opacity =
      state.phase === 'expand'
        ? 0.24 + 0.7 * k
        : 0.78 + Math.sin(simTime * 6.4) * 0.08;

    farBloom.material.opacity =
      state.phase === 'expand'
        ? 0.08 + 0.22 * k
        : 0.2 + Math.sin(simTime * 5.7) * 0.04;

    coreWhite.material.opacity = 0.98 + Math.sin(simTime * 48) * 0.02;
    corePink.material.opacity = 0.88 + Math.sin(simTime * 24) * 0.04;
    corePurple.material.opacity = 0.65 + Math.sin(simTime * 14) * 0.04;

    keyLight.intensity = 11.2 + Math.sin(simTime * 8.5) * 1.9;
    fillLight.intensity = 8.2 + Math.sin(simTime * 6.4 + 0.8) * 1.2;
    rimLight.intensity = 4.8 + Math.sin(simTime * 9.2 + 1.4) * 0.7;

    litHaloMat.opacity = 0.12 + Math.sin(simTime * 7.0) * 0.025;
    litHaloMat.emissiveIntensity = 1.7 + Math.sin(simTime * 8.0) * 0.25;

    if (state.phase === 'expand' && p >= 1) {
      state.phase = 'hold';
      state.t = 0;
    } else if (state.phase === 'hold' && state.t >= holdDuration) {
      state.phase = 'done';
      state.t = 0;
    }
  }

  function getShake(t) {
    const env =
      state.phase === 'expand'
        ? 1.0
        : state.phase === 'hold'
          ? 0.55
          : 0.22;
          
    const ax = 0.085 * env;
    const ay = 0.085 * env;
    const ar = 0.024 * env;

    return {
      x:
        (Math.sin(t * 28) +
          Math.sin(t * 46) * 0.55 +
          Math.sin(t * 117) * 0.24) *
        ax,
      y:
        (Math.cos(t * 32) +
          Math.cos(t * 49) * 0.55 +
          Math.sin(t * 126) * 0.24) *
        ay,
      rotZ: Math.sin(t * 23) * ar,
    };
  }

  function dispose() {
    scene.remove(group);
    group.traverse((obj) => {
      if (obj.material?.map) obj.material.map.dispose();
      if (obj.material) obj.material.dispose();
      if (obj.geometry) obj.geometry.dispose();
    });
  }

  return { update, dispose, group, getShake };
}