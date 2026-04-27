import * as THREE from 'three';

function smoothstep01(x) {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Build the red orb sprite stack (not added to any scene). */
function createRedConcentratedSphere(options = {}) {
  const {
    orbRadius = 1.0,

    chargeDuration = 0.5,
    holdDuration = 1.0,

    orbColor = 0xff2a2a,
    glowColor = 0xff5c5c,
    darkRed = 0x8a0000,
    streakColor = 0xffffff,

    screenFillScale = 26,

    spriteDepthTest = true,
    spriteRenderOrder = null,

    orbOnly = false,
    animated = true,
    orbTextureVariant = 'red',

    coreWhiteRadiusFactor = 1.28,

    shakeEnabled = true,
    shakePosAmp = 0.085,
    shakeRotAmp = 0.02,
    shakeFreq1 = 26,
    shakeFreq2 = 41,
    shakeFreq3 = 19,

    shakeStartMul = 1.85,
    shakeStartMulFalloffP = 0.28,

    suctionParticlesEnabled = true,
    suctionParticleCount = 1600,
    suctionSpawnRadiusMin = 0.14,
    suctionSpawnRadiusMax = 0.36,
    suctionPointSize = 0.15,
    suctionSwirlTurns = 1.8,
    suctionDepthTest = false,
    suctionStiffness= 0.5,
    suctionDamping = 7.5,
    suctionEpsilon = 0.001,
  } = options;

  const rand = (min, max) => min + Math.random() * (max - min);

  function createOrbTexture({ size = 1024, variant = 'red' } = {}) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2;

    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    if (variant === 'white') {
      g.addColorStop(0.0, 'rgba(255,255,255,1)');
      g.addColorStop(0.1, 'rgba(255,255,255,0.95)');
      g.addColorStop(0.28, 'rgba(248,252,255,0.72)');
      g.addColorStop(0.48, 'rgba(230,240,255,0.28)');
      g.addColorStop(0.68, 'rgba(200,220,255,0.08)');
      g.addColorStop(1.0, 'rgba(0,0,0,0)');
    } else {
      g.addColorStop(0.0, 'rgba(255,255,255,1)');
      g.addColorStop(0.08, 'rgba(255,245,245,1)');
      g.addColorStop(0.18, 'rgba(255,170,170,0.98)');
      g.addColorStop(0.35, 'rgba(255,65,65,0.92)');
      g.addColorStop(0.58, 'rgba(220,10,10,0.6)');
      g.addColorStop(1.0, 'rgba(0,0,0,0)');
    }

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  function createRedSpiralTexture({
    size = 1024,
    arms = 5,
    turns = 10,
    innerRadius = 0.03,
    outerRadius = 0.95,
    strokeR = 255,
    strokeG = 70,
    strokeB = 70,
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
      const armPhase = (a / arms) * Math.PI * 2 + Math.random() * 0.15;

      for (let i = 0; i < 1000; i++) {
        const u0 = i / 1000;
        const u1 = (i + 1) / 1000;

        const r0 = inner + (outer - inner) * Math.pow(u0, 0.82);
        const r1 = inner + (outer - inner) * Math.pow(u1, 0.82);

        const curl0 = Math.sin(u0 * 17 + a) * 0.14;
        const curl1 = Math.sin(u1 * 17 + a) * 0.14;

        const t0 = armPhase + u0 * turns * Math.PI * 2 + curl0;
        const t1 = armPhase + u1 * turns * Math.PI * 2 + curl1;

        const x0 = Math.cos(t0) * r0;
        const y0 = Math.sin(t0) * r0;
        const x1 = Math.cos(t1) * r1;
        const y1 = Math.sin(t1) * r1;

        const alpha = 0.03 + (1 - u0) * 0.24;
        const width = size * (0.0012 + (1 - u0) * 0.006);

        ctx.strokeStyle = `rgba(${strokeR},${strokeG},${strokeB},${alpha})`;
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

  function createArcStreakTexture({
    size = 1024,
    streakCount = 150,
    innerRadius = 0.16,
    outerRadius = 1.0,
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

    for (let i = 0; i < streakCount; i++) {
      const startA = Math.random() * Math.PI * 2;
      const arcSpan = rand(0.18, 0.82);
      const baseR = rMax * rand(innerRadius, outerRadius);

      const width = rand(size * 0.0012, size * 0.005);
      const alpha = rand(0.04, 0.2);

      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.beginPath();

      for (let j = 0; j <= 24; j++) {
        const u = j / 24;
        const r = baseR * (1 - u * 0.28);
        const a = startA + arcSpan * u + Math.sin(u * Math.PI * 2) * 0.08;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;

        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
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

  function createPurpleHaloTexture({ size = 1024 } = {}) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2;

    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0.0, 'rgba(255,255,255,0)');
    g.addColorStop(0.18, 'rgba(220,190,255,0.05)');
    g.addColorStop(0.36, 'rgba(185,110,255,0.18)');
    g.addColorStop(0.58, 'rgba(160,80,255,0.45)');
    g.addColorStop(0.72, 'rgba(120,40,220,0.42)');
    g.addColorStop(0.86, 'rgba(50,14,80,0.18)');
    g.addColorStop(1.0, 'rgba(0,0,0,0)');

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  function createSuctionParticlePoints() {
    const count = Math.max(0, Math.floor(suctionParticleCount));
    if (count === 0) return null;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const dirs = new Float32Array(count * 3);
    const startR = new Float32Array(count);
    const swirlPhase = new Float32Array(count);

    const cOrb = new THREE.Color(orbColor);
    const cGlow = new THREE.Color(glowColor);
    const cHot = new THREE.Color(0xffffff);

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const dx = Math.sin(phi) * Math.cos(theta);
      const dy = Math.sin(phi) * Math.sin(theta);
      const dz = Math.cos(phi);

      const ix = i * 3;
      dirs[ix] = dx;
      dirs[ix + 1] = dy;
      dirs[ix + 2] = dz;

      const r =
        orbRadius *
        (suctionSpawnRadiusMin +
          Math.random() * (suctionSpawnRadiusMax - suctionSpawnRadiusMin));

      positions[ix] = dx * r;
      positions[ix + 1] = dy * r;
      positions[ix + 2] = dz * r;
      startR[i] = r;
      swirlPhase[i] = Math.random() * Math.PI * 2;

      const warm = Math.random();
      const col = warm < 0.55 ? cOrb.clone().lerp(cGlow, Math.random() * 0.65) : cHot.clone().lerp(cGlow, Math.random() * 0.4);
      col.multiplyScalar(0.85 + Math.random() * 0.35);
      colors[ix] = col.r;
      colors[ix + 1] = col.g;
      colors[ix + 2] = col.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: suctionPointSize * Math.max(0.35, orbRadius),
      vertexColors: true,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      depthTest: suctionDepthTest,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    points.position.z = -0.019;
    points.renderOrder =
      spriteRenderOrder != null ? spriteRenderOrder - 5 : 4;

    return {
      points,
      dirs,
      startR,
      swirlPhase,
      geometry,
      material,
      spring: { s: 1, v: 0 },
    };
  }

  function createPurpleParticleBall(particleCount = 42000) {
    const count = Math.max(0, Math.floor(particleCount));
    if (count === 0) return null;

    const positions = new Float32Array(count * 3);
    const baseDirs = new Float32Array(count * 3);
    const baseR = new Float32Array(count);
    const phases = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const cInner = new THREE.Color(0xffffff);
    const cMid = new THREE.Color(0xc084fc);
    const cOuter = new THREE.Color(0x6d28d9);

    for (let i = 0; i < count; i++) {
      // Random direction.
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      const dx = Math.sin(v) * Math.cos(u);
      const dy = Math.sin(v) * Math.sin(u);
      const dz = Math.cos(v);

      const ix = i * 3;
      baseDirs[ix] = dx;
      baseDirs[ix + 1] = dy;
      baseDirs[ix + 2] = dz;

      // Bias toward center for dense, crackling core (reference).
      const rr = Math.pow(Math.random(), 2.35);
      const r0 = orbRadius * (0.14 + rr * 1.0);
      baseR[i] = r0;
      positions[ix] = dx * r0;
      positions[ix + 1] = dy * r0;
      positions[ix + 2] = dz * r0;
      phases[i] = Math.random() * Math.PI * 2;

      // Color gradient: white-hot inner -> lavender -> purple.
      const t = Math.min(1, Math.max(0, (r0 / orbRadius - 0.14) / 1.0));
      const col =
        t < 0.35
          ? cInner.clone().lerp(cMid, t / 0.35)
          : cMid.clone().lerp(cOuter, (t - 0.35) / 0.65);
      col.multiplyScalar(0.85 + Math.random() * 0.35);
      colors[ix] = col.r;
      colors[ix + 1] = col.g;
      colors[ix + 2] = col.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.012 * Math.max(0.35, orbRadius),
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    points.renderOrder = spriteRenderOrder != null ? spriteRenderOrder + 16 : 18;
    points.visible = false;
    points.scale.setScalar(1);

    return { points, geometry, material, baseDirs, baseR, phases, count };
  }

  function stepPurpleParticleBall(dt, simTime, ball, expandS) {
    if (!ball || !ball.points.visible) return;
    const { geometry, baseDirs, baseR, phases, count } = ball;
    const arr = geometry.attributes.position.array;

    // Expand from tight core to a larger sphere.
    const S = expandS;
    const swirl = 0.55 + 0.95 * (1 - Math.min(1, S / 3.2));
    const swirlSpeed = 2.6 + 6.2 * swirl;
    const wobbleAmp = 0.045 + 0.08 * (1 - Math.min(1, S / 3.2));

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const dx = baseDirs[ix];
      const dy = baseDirs[ix + 1];
      const dz = baseDirs[ix + 2];

      const r = baseR[i] * (0.85 + 2.55 * S);
      const a = simTime * swirlSpeed + phases[i];
      const c = Math.cos(a);
      const s = Math.sin(a);
      const rx = dx * c - dy * s;
      const ry = dx * s + dy * c;
      const rz = dz;

      const wob =
        (Math.sin(simTime * 19 + phases[i]) * 0.6 +
          Math.sin(simTime * 41 + i * 0.01) * 0.4) *
        wobbleAmp *
        orbRadius;

      arr[ix] = rx * r + wob * rx;
      arr[ix + 1] = ry * r + wob * ry;
      arr[ix + 2] = rz * r + wob * rz;
    }
    geometry.attributes.position.needsUpdate = true;
  }

  function createPurpleDebrisPoints(debrisCount = 520) {
    const count = Math.max(0, Math.floor(debrisCount));
    if (count === 0) return null;

    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const radialPhase = new Float32Array(count);
    const swirlOff = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      const shell = 2.1 + Math.random() * 7.2;
      const ix = i * 3;
      const sinV = Math.sin(v);
      positions[ix] = sinV * Math.cos(u) * orbRadius * shell;
      positions[ix + 1] = sinV * Math.sin(u) * orbRadius * shell;
      positions[ix + 2] = Math.cos(v) * orbRadius * shell;

      const blow = 0.35 + Math.random() * 3.2;
      velocities[ix] = positions[ix] * 0.018 * blow;
      velocities[ix + 1] = positions[ix + 1] * 0.018 * blow;
      velocities[ix + 2] = positions[ix + 2] * 0.018 * blow;
      radialPhase[i] = Math.random() * Math.PI * 2;
      swirlOff[i] = 0.65 + Math.random() * 1.15;

      const dark = 0.09 + Math.random() * 0.14;
      const r0 = dark * (0.85 + Math.random() * 0.25);
      const g0 = dark * (0.8 + Math.random() * 0.2);
      const b0 = dark * (0.9 + Math.random() * 0.15);
      colors[ix] = r0;
      colors[ix + 1] = g0;
      colors[ix + 2] = b0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.13 * Math.max(0.35, orbRadius),
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: suctionDepthTest,
      blending: THREE.NormalBlending,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geometry, material);
    points.position.z = -0.017;
    points.renderOrder = spriteRenderOrder != null ? spriteRenderOrder + 8 : 12;

    return {
      points,
      velocities,
      geometry,
      material,
      radialPhase,
      swirlOff,
      count,
    };
  }

  function resetPurpleDebris(debris) {
    if (!debris) return;
    const { geometry, velocities, count, radialPhase, swirlOff } = debris;
    const posAttr = geometry.attributes.position;
    const arr = posAttr.array;
    const vel = velocities;
    for (let i = 0; i < count; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      const shell = 2.1 + Math.random() * 7.2;
      const ix = i * 3;
      const sinV = Math.sin(v);
      arr[ix] = sinV * Math.cos(u) * orbRadius * shell;
      arr[ix + 1] = sinV * Math.sin(u) * orbRadius * shell;
      arr[ix + 2] = Math.cos(v) * orbRadius * shell;

      const blow = 0.35 + Math.random() * 3.2;
      vel[ix] = arr[ix] * 0.018 * blow;
      vel[ix + 1] = arr[ix + 1] * 0.018 * blow;
      vel[ix + 2] = arr[ix + 2] * 0.018 * blow;
      radialPhase[i] = Math.random() * Math.PI * 2;
      swirlOff[i] = 0.65 + Math.random() * 1.15;
    }
    posAttr.needsUpdate = true;
  }

  function stepPurpleDebris(dt, simTime, debris) {
    if (!debris || debris.material.opacity < 0.02) return;
    const { geometry, velocities, count, radialPhase, swirlOff } = debris;
    const arr = geometry.attributes.position.array;
    const vel = velocities;
    const damp = Math.pow(0.988, dt * 60);

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      let x = arr[ix];
      let y = arr[ix + 1];
      let z = arr[ix + 2];

      const sw = dt * swirlOff[i] * 2.4;
      const c = Math.cos(sw);
      const s = Math.sin(sw);
      const rx = x * c - y * s;
      const ry = x * s + y * c;
      x = rx;
      y = ry;

      x += vel[ix] * dt * 20;
      y += vel[ix + 1] * dt * 20;
      z += vel[ix + 2] * dt * 20;

      vel[ix] *= damp;
      vel[ix + 1] *= damp;
      vel[ix + 2] *= damp;

      const len = Math.hypot(x, y, z) || 1e-6;
      const pull =
        0.22 * dt * Math.sin(simTime * 3.2 + radialPhase[i]) +
        0.08 * dt * Math.sin(simTime * 11 + i * 0.1);
      x += (-x / len) * orbRadius * pull;
      y += (-y / len) * orbRadius * pull;
      z += (-z / len) * orbRadius * pull;

      arr[ix] = x;
      arr[ix + 1] = y;
      arr[ix + 2] = z;
    }
    geometry.attributes.position.needsUpdate = true;
  }

  const group = new THREE.Group();
  const textureVariant = orbTextureVariant === 'white' ? 'white' : 'red';

  function disposeTexture(obj) {
    if (obj.material?.map) obj.material.map.dispose();
    if (obj.material) obj.material.dispose();
    if (obj.geometry) obj.geometry.dispose();
  }

  function dispose() {
    group.traverse((obj) => {
      disposeTexture(obj);
    });
  }

  function applySpriteRenderOptions() {
    group.traverse((obj) => {
      if (obj instanceof THREE.Sprite) {
        obj.material.depthTest = spriteDepthTest;
        if (spriteRenderOrder != null) obj.renderOrder = spriteRenderOrder;
      }
    });
  }

  if (orbOnly) {
    const orbTexture = createOrbTexture({ variant: textureVariant });
    const c = orbColor;
    const core = makeSprite(orbTexture, c, orbRadius * 1.06, 0.98);
    const glow = makeSprite(orbTexture, c, orbRadius * 2.05, 0.2);
    glow.position.z = -0.006;
    group.add(core, glow);
    applySpriteRenderOptions();
    return {
      group,
      update: () => {},
      dispose,
    };
  }

  const orbTexture = createOrbTexture({ variant: textureVariant });
  const spiralTexture = createRedSpiralTexture();
  const streakTexture = createArcStreakTexture();

  const screenWash = makeSprite(orbTexture, darkRed, orbRadius * 52, 0.42);
  screenWash.position.z = -0.035;

  const coreWhite = makeSprite(
    orbTexture,
    0xffffff,
    orbRadius * coreWhiteRadiusFactor,
    0,
  );
  const coreRed = makeSprite(orbTexture, orbColor, orbRadius * 1.7, 0);
  const spiral1 = makeSprite(spiralTexture, glowColor, orbRadius * 4.0, 0);
  const spiral2 = makeSprite(spiralTexture, 0xffb0b0, orbRadius * 3.1, 0);
  const streaks1 = makeSprite(streakTexture, streakColor, orbRadius * 4.4, 0);
  const streaks2 = makeSprite(streakTexture, 0xffcaca, orbRadius * 3.5, 0);
  const bloom1 = makeSprite(orbTexture, glowColor, orbRadius * 4.8, 0);
  const bloom2 = makeSprite(orbTexture, darkRed, orbRadius * 7.0, 0);

  const purpleHaloGeom = new THREE.SphereGeometry(orbRadius * 2.75, 40, 28);
  const purpleHaloMat = new THREE.MeshStandardMaterial({
    color: 0x08020c,
    emissive: 0x6b21a8,
    emissiveIntensity: 0.42,
    metalness: 0.18,
    roughness: 0.52,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const purpleLitHalo = new THREE.Mesh(purpleHaloGeom, purpleHaloMat);
  purpleLitHalo.renderOrder = -4;
  purpleLitHalo.visible = false;

  const purpleHaloTex = createPurpleHaloTexture();
  const purpleGradientHalo = makeSprite(purpleHaloTex, 0xffffff, orbRadius * 12.5, 0, THREE.AdditiveBlending);
  purpleGradientHalo.position.z = -0.028;
  purpleGradientHalo.renderOrder = spriteRenderOrder != null ? spriteRenderOrder - 2 : 2;
  purpleGradientHalo.visible = false;

  const purpleKeyLight = new THREE.PointLight(0xc4b5fd, 0, 38, 1.45);
  purpleKeyLight.position.set(0.55 * orbRadius, 0.32 * orbRadius, 0.62 * orbRadius);
  const purpleFillLight = new THREE.PointLight(0xa855f7, 0, 28, 1.75);
  purpleFillLight.position.set(-0.48 * orbRadius, -0.4 * orbRadius, 0.35 * orbRadius);
  const purpleRimLight = new THREE.PointLight(0xf5f0ff, 0, 22, 2.0);
  purpleRimLight.position.set(0.12 * orbRadius, 0.65 * orbRadius, -0.28 * orbRadius);

  spiral1.position.z = -0.01;
  spiral2.position.z = -0.012;
  streaks1.position.z = -0.014;
  streaks2.position.z = -0.016;
  bloom1.position.z = -0.02;
  bloom2.position.z = -0.025;
  coreWhite.position.z = 0.002;
  coreRed.position.z = 0.001;

  spiral2.material.rotation = Math.PI / 4;
  streaks2.material.rotation = Math.PI / 3;

  let suction = null;
  if (suctionParticlesEnabled && animated) {
    suction = createSuctionParticlePoints();
  }
  if (suction) group.add(suction.points);

  const purpleBall = animated ? createPurpleParticleBall() : null;

  let purpleDebris = null;
  if (animated) {
    purpleDebris = createPurpleDebrisPoints();
    purpleDebris.points.visible = false;
  }

  group.add(
    purpleLitHalo,
    purpleGradientHalo,
    purpleKeyLight,
    purpleFillLight,
    purpleRimLight,
    screenWash,
    bloom2,
    bloom1,
    streaks2,
    streaks1,
    spiral2,
    spiral1,
    coreRed,
    coreWhite,
  );
  if (purpleBall) group.add(purpleBall.points);
  if (purpleDebris) group.add(purpleDebris.points);

  applySpriteRenderOptions();

  const state = {
    phase: 'charge',
    chargeTime: 0,
    holdTime: 0,
    doneTime: 0,
    purpleTime: 0,
    purpleHoldTime: 0,
    purpleDoneTime: 0,
  };

  const purpleFusionDuration = 0.92;
  const purpleHoldDuration = 1.35;

  
/** Captured at `startPurpleMerge` for smooth lerp from current reds into hollow purple. */
  let purpleFrom = null;

  let suctionAnimTime = 0;
  let purpleSimTime = 0;

  /** Same spring as blue: global scale 1→0, all radii share `spring.s` (vacuum in). */
  function stepSuctionParticles(dt) {
    if (!suction) return;

    const { spring, dirs, startR, swirlPhase, geometry, material } = suction;

    const desired = 0;
    const delta = desired - spring.s;
    spring.v += delta * suctionStiffness * dt;
    spring.v *= Math.exp(-suctionDamping * dt);
    spring.s += spring.v * dt;

    if (spring.s < 0) {
      spring.s = 0;
      spring.v = 0;
    }

    if (
      Math.abs(desired - spring.s) < suctionEpsilon &&
      Math.abs(spring.v) < suctionEpsilon
    ) {
      spring.s = desired;
      spring.v = 0;
      material.opacity = 0;
      return;
    }

    suctionAnimTime += dt;

    const S = spring.s;
    const posAttr = geometry.attributes.position;
    const arr = posAttr.array;
    const n = startR.length;

    for (let i = 0; i < n; i++) {
      const r = startR[i] * S;
      const ix = i * 3;
      const dx = dirs[ix];
      const dy = dirs[ix + 1];
      const dz = dirs[ix + 2];

      const swirlAngle =
        suctionAnimTime * suctionSwirlTurns * Math.PI * 2 * (0.14 + 0.86 * S) +
        swirlPhase[i];
      const c = Math.cos(swirlAngle);
      const s = Math.sin(swirlAngle);
      const rx = dx * c - dy * s;
      const ry = dx * s + dy * c;
      const rz = dz;

      arr[ix] = rx * r;
      arr[ix + 1] = ry * r;
      arr[ix + 2] = rz * r;
    }
    posAttr.needsUpdate = true;

    let mergeFade = 1;
    if (S < 0.22) mergeFade = smoothstep01(S / 0.22);
    material.opacity = mergeFade * 0.96;
  }

  function spinOrb(dt) {
    coreWhite.material.rotation += dt * 2.4;
    coreRed.material.rotation -= dt * 2.0;
  }

  function updateCharge(dt) {
    state.chargeTime += dt;
    const t = Math.min(1, state.chargeTime / chargeDuration);
    const shrinkT = easeInOutCubic(t);

    group.scale.setScalar(
      THREE.MathUtils.lerp(screenFillScale, 1, shrinkT),
    );

    // Red screen wash: strong at start, gone before the orb fully forms.
    const washOut = 1 - smoothstep01(t / 0.48);
    screenWash.material.opacity = 0.5 * washOut;

    // Whirlpool: fade in quickly, peak mid, dissolve as the mass collapses.
    const whirlIn = smoothstep01(t / 0.11);
    const whirlOut = 1 - smoothstep01((t - 0.5) / 0.38);
    const whirl = whirlIn * whirlOut;

    const spinLift = 1 + Math.sin(t * Math.PI) * 1.15;
    spiral1.material.rotation -= dt * (14 + 32 * t) * spinLift;
    spiral2.material.rotation += dt * (12 + 28 * t) * spinLift;
    streaks1.material.rotation -= dt * (10 + 22 * t) * spinLift;
    streaks2.material.rotation += dt * (8.5 + 18 * t) * spinLift;

    const tight = 1 - shrinkT * 0.42;
    spiral1.scale.setScalar(orbRadius * 4.0 * tight);
    spiral2.scale.setScalar(orbRadius * 3.1 * tight);
    streaks1.scale.setScalar(orbRadius * 4.4 * tight);
    streaks2.scale.setScalar(orbRadius * 3.5 * tight);

    spiral1.material.opacity = 0.78 * whirl;
    spiral2.material.opacity = 0.42 * whirl;
    streaks1.material.opacity = 0.52 * whirl;
    streaks2.material.opacity = 0.25 * whirl;
    bloom1.material.opacity = (0.28 + 0.22 * Math.sin(state.chargeTime * 9)) * whirl;
    bloom2.material.opacity = (0.14 + 0.1 * Math.sin(state.chargeTime * 6 + 1)) * whirl;

    // Core coalesces inward during the collapse.
    const coreT = smoothstep01((t - 0.34) / 0.48);
    const pulse = 1 + Math.sin(state.chargeTime * 14) * 0.04 * (1 - coreT);
    coreWhite.material.opacity = coreT * (0.88 + 0.1 * pulse);
    coreRed.material.opacity = coreT * 0.96;
    coreWhite.scale.setScalar(
      orbRadius * coreWhiteRadiusFactor * (0.92 + 0.08 * coreT) * pulse,
    );
    coreRed.scale.setScalar(
      orbRadius * 1.7 * THREE.MathUtils.lerp(1.35, 1, coreT),
    );

    stepSuctionParticles(dt);

    spinOrb(dt);

    if (t >= 1) {
      state.phase = 'hold';
      state.holdTime = 0;
      group.scale.setScalar(1);
      screenWash.material.opacity = 0;
      spiral1.material.opacity = 0;
      spiral2.material.opacity = 0;
      streaks1.material.opacity = 0;
      streaks2.material.opacity = 0;
      bloom1.material.opacity = 0;
      bloom2.material.opacity = 0;
      coreWhite.material.opacity = 0.94;
      coreRed.material.opacity = 0.96;
      coreWhite.scale.setScalar(orbRadius * coreWhiteRadiusFactor);
      coreRed.scale.setScalar(orbRadius * 1.7);
    }
  }

  function updateHold(dt) {
    state.holdTime += dt;
    spinOrb(dt);
    stepSuctionParticles(dt);
    if (state.holdTime >= holdDuration) {
      state.phase = 'done';
      state.doneTime = 0;
    }
  }

  function updateDone(dt) {
    state.doneTime += dt;
    spinOrb(dt);
    stepSuctionParticles(dt);
  }

  function applyPurpleTargets(kEase) {
    if (!purpleFrom) return;
    const k = kEase;
    coreRed.material.color.copy(purpleFrom.coreRed).lerp(purpleFrom.tCoreRed, k);
    coreWhite.material.color.copy(purpleFrom.coreWhite).lerp(purpleFrom.tCoreWhite, k);
    spiral1.material.color.copy(purpleFrom.spiral1).lerp(purpleFrom.tSpiral1, k);
    spiral2.material.color.copy(purpleFrom.spiral2).lerp(purpleFrom.tSpiral2, k);
    streaks1.material.color.copy(purpleFrom.streaks1).lerp(purpleFrom.tStreaks1, k);
    streaks2.material.color.copy(purpleFrom.streaks2).lerp(purpleFrom.tStreaks2, k);
    bloom1.material.color.copy(purpleFrom.bloom1).lerp(purpleFrom.tBloom1, k);
    bloom2.material.color.copy(purpleFrom.bloom2).lerp(purpleFrom.tBloom2, k);
    if (suction) {
      suction.material.color.copy(purpleFrom.suctionMul).lerp(purpleFrom.tSuctionMul, k);
    }
  }

  function updatePurpleFusion(dt) {
    state.purpleTime += dt;
    purpleSimTime += dt;
    const t = Math.min(1, state.purpleTime / purpleFusionDuration);
    const k = easeInOutCubic(t);

    const whirlIn = smoothstep01(t / 0.09);
    const whirlOut = 1 - smoothstep01((t - 0.5) / 0.44);
    const whirl = whirlIn * whirlOut;

    const spinLift = 1 + Math.sin(t * Math.PI) * 1.45;
    spiral1.material.rotation -= dt * (21 + 48 * t) * spinLift;
    spiral2.material.rotation += dt * (19 + 42 * t) * spinLift;
    // No streak overlays for purple (particle ball + halo only).
    streaks1.material.rotation -= dt * (16 + 32 * t) * spinLift;
    streaks2.material.rotation += dt * (14 + 27 * t) * spinLift;

    /** Wide dark vortex framing a smaller bright core (reference: Hollow Purple). */
    const whScale1 = 10.2;
    const whScale2 = 7.85;
    const whScaleS1 = 10.8;
    const whScaleS2 = 8.35;
    const tight = 0.86 + 0.14 * (1 - t);
    spiral1.scale.setScalar(orbRadius * whScale1 * tight);
    spiral2.scale.setScalar(orbRadius * whScale2 * tight);
    streaks1.scale.setScalar(orbRadius * whScaleS1 * tight);
    streaks2.scale.setScalar(orbRadius * whScaleS2 * tight);

    spiral1.material.opacity = 0.92 * whirl;
    spiral2.material.opacity = 0.62 * whirl;
    streaks1.material.opacity = 0;
    streaks2.material.opacity = 0;
    bloom1.material.opacity = (0.48 + 0.26 * Math.sin(state.purpleTime * 11)) * whirl;
    bloom2.material.opacity = (0.42 + 0.18 * Math.sin(state.purpleTime * 7 + 0.9)) * whirl;
    bloom1.scale.setScalar(orbRadius * (5.4 + 0.9 * k));
    bloom2.scale.setScalar(orbRadius * (8.2 + 1.6 * k));

    const crackle =
      0.97 +
      Math.sin(state.purpleTime * 52) * 0.04 +
      Math.sin(state.purpleTime * 111) * 0.025;
    if (purpleDebris) {
      purpleDebris.material.opacity = Math.min(0.96, 0.52 + 0.44 * smoothstep01(t * 1.15));
    }
    const lightBurst = whirl * (0.8 + 0.55 * k);
    purpleKeyLight.intensity = 7.5 * lightBurst * (0.85 + 0.45 * Math.sin(state.purpleTime * 16));
    purpleFillLight.intensity = 5.5 * lightBurst;
    purpleRimLight.intensity = 3.4 * lightBurst * (0.9 + 0.35 * Math.sin(state.purpleTime * 13 + 1));
    purpleHaloMat.opacity = (0.22 + 0.26 * whirl) * (0.45 + 0.55 * k);
    purpleHaloMat.emissiveIntensity = 0.55 + 0.62 * k + 0.42 * whirl;

    const corePulse = 1 + Math.sin(state.purpleTime * 18) * 0.055 * (1 - t * 0.45);
    coreWhite.material.opacity = Math.min(1, 0.99 * corePulse * crackle);
    coreRed.material.opacity = Math.min(1, 0.99 * crackle);
    coreWhite.scale.setScalar(
      orbRadius * coreWhiteRadiusFactor * (0.9 + 0.08 * t) * corePulse,
    );
    coreRed.scale.setScalar(orbRadius * 1.82 * (1 + 0.08 * Math.sin(t * Math.PI)));

    applyPurpleTargets(k);
    stepSuctionParticles(dt);
    if (purpleBall) {
      purpleBall.points.visible = true;
      const expandS = 0.12 + 1.05 * k;
      purpleBall.material.opacity = Math.min(1, 0.08 + 0.8 * k);
      stepPurpleParticleBall(dt, purpleSimTime, purpleBall, expandS);
    }
    stepPurpleDebris(dt, purpleSimTime, purpleDebris);
    spinOrb(dt);

    // Gradient halo glow that pulses while the ball expands.
    purpleGradientHalo.visible = true;
    const haloPulse =
      1 +
      Math.sin(state.purpleTime * 7.5) * 0.08 +
      Math.sin(state.purpleTime * 17) * 0.03;
    purpleGradientHalo.material.opacity = Math.min(
      1,
      (0.16 + 0.56 * whirl) * (0.32 + 0.68 * k),
    );
    purpleGradientHalo.scale.setScalar(
      orbRadius * (12.5 + 7.2 * k) * haloPulse,
    );
    purpleGradientHalo.material.rotation -= dt * (0.65 + 1.2 * k);

    if (t >= 1) {
      group.scale.setScalar(1);
      screenWash.material.opacity = 0;
      spiral1.material.opacity = 0.19;
      spiral2.material.opacity = 0.11;
      streaks1.material.opacity = 0;
      streaks2.material.opacity = 0;
      bloom1.material.opacity = 0.48;
      bloom2.material.opacity = 0.44;
      bloom1.scale.setScalar(orbRadius * 6.1);
      bloom2.scale.setScalar(orbRadius * 10.2);
      coreWhite.material.opacity = 1;
      coreRed.material.opacity = 1;
      coreWhite.scale.setScalar(orbRadius * coreWhiteRadiusFactor * 0.96);
      coreRed.scale.setScalar(orbRadius * 1.85);
      applyPurpleTargets(1);
      purpleKeyLight.intensity = 6.4;
      purpleFillLight.intensity = 4.6;
      purpleRimLight.intensity = 3.1;
      purpleHaloMat.opacity = 0.38;
      purpleHaloMat.emissiveIntensity = 1.12;
      if (purpleDebris) purpleDebris.material.opacity = 0.92;
      if (purpleBall) purpleBall.material.opacity = 0.95;
      purpleGradientHalo.material.opacity = 0.55;
      state.phase = 'purple_hold';
      state.purpleHoldTime = 0;
    }
  }

  function updatePurpleHold(dt) {
    state.purpleHoldTime += dt;
    purpleSimTime += dt;
    spinOrb(dt);
    stepSuctionParticles(dt);
    if (purpleBall) {
      const p = state.purpleHoldTime;
      const breathe = 1 + Math.sin(p * 3.8) * 0.04;
      stepPurpleParticleBall(dt, purpleSimTime, purpleBall, 1.28 * breathe);
      purpleBall.material.opacity = 0.88 + Math.sin(p * 5.1) * 0.06;
    }
    stepPurpleDebris(dt, purpleSimTime, purpleDebris);
    const p = state.purpleHoldTime;

    spiral1.material.rotation -= dt * 0.55;
    spiral2.material.rotation += dt * 0.48;
    streaks1.material.rotation -= dt * 0.35;
    streaks2.material.rotation += dt * 0.42;

    streaks1.material.opacity = 0;
    streaks2.material.opacity = 0;
    spiral1.material.opacity = 0.17 + Math.sin(p * 2.4) * 0.035;
    spiral2.material.opacity = 0.1 + Math.cos(p * 2.1) * 0.022;
    bloom1.material.opacity = 0.46 + Math.sin(p * 5) * 0.08;
    bloom2.material.opacity = 0.42 + Math.cos(p * 3.8) * 0.08;
    bloom1.scale.setScalar(orbRadius * (6.05 + Math.sin(p * 4.2) * 0.25));
    bloom2.scale.setScalar(orbRadius * (10.1 + Math.sin(p * 3.1) * 0.45));

    const holdCrackle =
      0.985 +
      Math.sin(p * 47) * 0.028 +
      Math.sin(p * 103) * 0.018;
    coreWhite.material.opacity = Math.min(1, holdCrackle);
    coreRed.material.opacity = Math.min(1, 0.99 * holdCrackle);

    purpleHaloMat.opacity = 0.34 + Math.sin(p * 4.8) * 0.055;
    purpleHaloMat.emissiveIntensity = 1.02 + Math.sin(p * 5.5) * 0.14;
    purpleKeyLight.intensity = 6.2 + Math.sin(p * 5.2) * 1.35;
    purpleFillLight.intensity = 4.5 + Math.sin(p * 4.1 + 0.7) * 0.85;
    purpleRimLight.intensity = 3.2 + Math.sin(p * 6.2 + 1.1) * 0.55;
    if (purpleDebris) purpleDebris.material.opacity = 0.88 + Math.sin(p * 6) * 0.06;

    purpleGradientHalo.visible = true;
    const haloPulse =
      1 + Math.sin(p * 4.2) * 0.09 + Math.sin(p * 9.5 + 1.2) * 0.035;
    purpleGradientHalo.material.opacity = 0.5 + Math.sin(p * 4.5) * 0.12;
    purpleGradientHalo.scale.setScalar(orbRadius * 19.5 * haloPulse);
    purpleGradientHalo.material.rotation -= dt * 0.55;

    if (state.purpleHoldTime >= purpleHoldDuration) {
      state.phase = 'purple_done';
      state.purpleDoneTime = 0;
    }
  }

  function updatePurpleDone(dt) {
    state.purpleDoneTime += dt;
    purpleSimTime += dt;
    spinOrb(dt);
    stepSuctionParticles(dt);
    if (purpleBall) {
      const p = state.purpleDoneTime;
      const breathe = 1 + Math.sin(p * 2.6) * 0.03;
      stepPurpleParticleBall(dt, purpleSimTime, purpleBall, 1.25 * breathe);
      purpleBall.material.opacity = 0.82 + Math.sin(p * 3.8) * 0.05;
    }
    stepPurpleDebris(dt, purpleSimTime, purpleDebris);
    const p = state.purpleDoneTime;

    spiral1.material.rotation -= dt * 0.42;
    spiral2.material.rotation += dt * 0.36;
    streaks1.material.rotation -= dt * 0.28;
    streaks2.material.rotation += dt * 0.33;
    streaks1.material.opacity = 0;
    streaks2.material.opacity = 0;
    spiral1.material.opacity = 0.15 + Math.sin(p * 2) * 0.025;
    spiral2.material.opacity = 0.085 + Math.cos(p * 1.8) * 0.018;
    bloom1.material.opacity = 0.42 + Math.sin(p * 3.5) * 0.06;
    bloom2.material.opacity = 0.38 + Math.cos(p * 2.9) * 0.06;
    bloom1.scale.setScalar(orbRadius * (5.95 + Math.sin(p * 3.2) * 0.2));
    bloom2.scale.setScalar(orbRadius * (9.85 + Math.sin(p * 2.4) * 0.35));

    const doneCrackle = 0.98 + Math.sin(p * 41) * 0.022;
    coreWhite.material.opacity = Math.min(1, doneCrackle);
    coreRed.material.opacity = Math.min(1, 0.97 * doneCrackle);

    purpleHaloMat.opacity = 0.32 + Math.sin(p * 3.2) * 0.04;
    purpleKeyLight.intensity = 5.4 + Math.sin(p * 3.5) * 0.9;
    purpleFillLight.intensity = 3.9 + Math.sin(p * 2.9) * 0.55;
    purpleRimLight.intensity = 2.65 + Math.sin(p * 4) * 0.42;
    purpleHaloMat.emissiveIntensity = 1.0 + Math.sin(p * 3.8) * 0.1;
    if (purpleDebris) purpleDebris.material.opacity = 0.8 + Math.sin(p * 4.5) * 0.08;

    purpleGradientHalo.visible = true;
    const haloPulse = 1 + Math.sin(p * 3.2) * 0.075;
    purpleGradientHalo.material.opacity = 0.46 + Math.sin(p * 3.6) * 0.1;
    purpleGradientHalo.scale.setScalar(orbRadius * 18.8 * haloPulse);
    purpleGradientHalo.material.rotation -= dt * 0.42;
  }

  function startPurpleMerge() {
    if (!animated) return false;
    if (state.phase === 'purple_fusion' || state.phase === 'purple_hold' || state.phase === 'purple_done') {
      return false;
    }
    if (state.phase !== 'hold' && state.phase !== 'done') return false;

    const tCoreRed = new THREE.Color(0x9333ea);
    const tCoreWhite = new THREE.Color(0xffffff);
    const tSpiral1 = new THREE.Color(0x12041c);
    const tSpiral2 = new THREE.Color(0x1f0a32);
    const tStreaks1 = new THREE.Color(0xffffff);
    const tStreaks2 = new THREE.Color(0xe9d5ff);
    const tBloom1 = new THREE.Color(0xa855f7);
    const tBloom2 = new THREE.Color(0x050108);
    const tSuctionMul = new THREE.Color(0xd8b4fe);

    purpleFrom = {
      coreRed: coreRed.material.color.clone(),
      coreWhite: coreWhite.material.color.clone(),
      spiral1: spiral1.material.color.clone(),
      spiral2: spiral2.material.color.clone(),
      streaks1: streaks1.material.color.clone(),
      streaks2: streaks2.material.color.clone(),
      bloom1: bloom1.material.color.clone(),
      bloom2: bloom2.material.color.clone(),
      suctionMul: suction ? suction.material.color.clone() : new THREE.Color(0xffffff),
      tCoreRed,
      tCoreWhite,
      tSpiral1,
      tSpiral2,
      tStreaks1,
      tStreaks2,
      tBloom1,
      tBloom2,
      tSuctionMul,
    };

    state.phase = 'purple_fusion';
    state.purpleTime = 0;
    purpleSimTime = 0;
    suctionAnimTime = 0;
    purpleLitHalo.visible = true;
    purpleGradientHalo.visible = true;
    purpleKeyLight.intensity = 0;
    purpleFillLight.intensity = 0;
    purpleRimLight.intensity = 0;
    purpleHaloMat.color.setHex(0x06010a);
    purpleHaloMat.emissive.setHex(0x7c3aed);
    if (purpleDebris) {
      purpleDebris.points.visible = true;
      purpleDebris.material.opacity = 0.68;
      resetPurpleDebris(purpleDebris);
    }
    if (purpleBall) {
      purpleBall.points.visible = true;
      purpleBall.material.opacity = 0;
    }
    if (spiral1.material.map === spiralTexture) {
      const voidTex1 = createRedSpiralTexture({
        strokeR: 42,
        strokeG: 22,
        strokeB: 58,
        turns: 11,
      });
      const voidTex2 = createRedSpiralTexture({
        strokeR: 38,
        strokeG: 20,
        strokeB: 54,
        turns: 11,
      });
      spiral1.material.map = voidTex1;
      spiral2.material.map = voidTex2;
      spiral1.material.needsUpdate = true;
      spiral2.material.needsUpdate = true;
      spiralTexture.dispose();
    }

    if (suction) {
      suction.spring.s = 1;
      suction.spring.v = 0;
      suction.material.opacity = 0.96;
    }
    return true;
  }

  function update(dt) {
    if (!animated) return;
    if (state.phase === 'charge') updateCharge(dt);
    else if (state.phase === 'hold') updateHold(dt);
    else if (state.phase === 'done') updateDone(dt);
    else if (state.phase === 'purple_fusion') updatePurpleFusion(dt);
    else if (state.phase === 'purple_hold') updatePurpleHold(dt);
    else if (state.phase === 'purple_done') updatePurpleDone(dt);
  }

  function shakeEnvelope() {
    if (!animated || !shakeEnabled) return 0;
    if (state.phase === 'charge') {
      const p = Math.min(1, state.chargeTime / chargeDuration);
      const washOut = 1 - smoothstep01(p / 0.48);
      const whirlIn = smoothstep01(p / 0.11);
      const whirlOut = 1 - smoothstep01((p - 0.5) / 0.38);
      const whirl = whirlIn * whirlOut;
      const collapseKick = smoothstep01((p - 0.52) / 0.32);
      let env = 0.15 + 0.65 * washOut + 0.52 * whirl + 0.45 * collapseKick;
      env = Math.min(1, env);
      const startMul = THREE.MathUtils.lerp(
        shakeStartMul,
        1,
        smoothstep01(p / shakeStartMulFalloffP),
      );
      return env * startMul;
    }
    if (state.phase === 'hold') return 0.36;
    if (state.phase === 'purple_fusion') {
      const p = Math.min(1, state.purpleTime / purpleFusionDuration);
      const whirlIn = smoothstep01(p / 0.12);
      const whirlOut = 1 - smoothstep01((p - 0.46) / 0.38);
      const whirl = whirlIn * whirlOut;
      let env = 0.2 + 0.62 * whirl + 0.4 * smoothstep01((p - 0.5) / 0.35);
      return Math.min(1, env);
    }
    if (state.phase === 'purple_hold') return 0.4;
    if (state.phase === 'purple_done') return 0.18;
    return 0.16;
  }

  function getShake(t) {
    if (!animated || !shakeEnabled) return null;
    const env = shakeEnvelope();
    if (env < 0.02) return null;
    const ax = shakePosAmp * env;
    const ay = shakePosAmp * env;
    const ar = shakeRotAmp * env;
    return {
      x:
        (Math.sin(t * shakeFreq1) +
          Math.sin(t * shakeFreq2) * 0.55 +
          Math.sin(t * 113.0) * 0.22) *
        ax,
      y:
        (Math.cos(t * (shakeFreq1 + 4)) +
          Math.cos(t * (shakeFreq2 + 4)) * 0.55 +
          Math.sin(t * 127.0) * 0.22) *
        ay,
      rotZ: Math.sin(t * shakeFreq3) * ar,
    };
  }

  return { update, dispose, group, getShake, startPurpleMerge };
}

export function secret_technique_red(scene, options = {}) {
  const originalBackground = scene.background
    ? scene.background.clone?.() ?? scene.background
    : null;

  const fx = createRedConcentratedSphere(options);
  fx.group.position.z = -3;
  scene.add(fx.group);

  return {
    update: fx.update,
    getShake: fx.getShake,
    startPurpleMerge: fx.startPurpleMerge,
    dispose: () => {
      scene.remove(fx.group);
      fx.dispose();
      if (originalBackground) {
        scene.background = originalBackground;
      }
    },
    group: fx.group,
  };
}
