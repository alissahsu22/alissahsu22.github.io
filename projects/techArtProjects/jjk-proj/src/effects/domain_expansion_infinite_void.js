import * as THREE from 'three';

export function domain_expansion_infinite_void(scene, options = {}) {
  const {
    // BEAMS
    beamCount = 200,
    beamMaxLength = 7,
    beamSpeed = 90,
    beamTravelDistance = 120,
    tunnelRadius = 6,
    tunnelRadiusPower = 1.6,
    tunnelTwist = 1.2,

    beamColorMode = 'palette',
    beamColor = 0xffffff,
    beamInsideColor = 0xffffff,
    beamOutsideColor = 0xeaf3ff,
    beamPalette = [0xffffff, 0xf9fbff, 0xf2f7ff, 0xeaf3ff, 0xe3eeff, 0xd9e8ff],
    beamOpacity = 0.95,

    beamThicknessCopies = 5,
    beamThicknessSpread = 0.12,

    vacuumPullStrength = 0.35,
    vacuumPullPower = 1.8,

    // TIMING
    raysDuration = 0.35,
    flashDuration = 0.4,
    whiteFlashFraction = 0.22,
    whiteFlashOpacityBoost = 1.35,

    // PORTAL LOOK
    portalRadius = 1.9,
    portalColor = 0xffffff,
    portalCoreEdgeColor = 0xffffff,
    portalParticleColor = 0xffffff,
    // outer halo (soft aura)
    outerHaloEnabled = true,
    outerHaloOpacity = 0.35,
    outerHaloScale = 3.9,
    // 1 = circle, <1 = more oval/squashed vertically
    outerHaloOvalY = 0.72,
    // fast spinning center look
    centerSpinEnabled = true,
    centerSpinSpeed = 30,
    centerSpinRadiusFactor = 0.62,
    centerSpinOpacity = 0.55,

    // STAR FIELD (white particles that pop out from center)
    starsEnabled = true,
    starsCount = 45000,
    starsMaxRadius = 14,
    starsHoleRadiusFactor = 2.3,
    starsDepth = 90,
    starsPointSize = 0.018,
    starsOpacity = 0.85,
    starsColor = 0xffffff,
    starsStiffness = 65,
    starsDamping = 12,

    // CAMERA SHAKE (consumed by SceneCanvas)
    shakeEnabled = true,
    // Position shake is in world units (camera space). Keep small.
    shakePosAmp = 0.012,
    // Rotation shake is in radians. Keep very small.
    shakeRotAmp = 0.004,
    shakeFreq1 = 24,
    shakeFreq2 = 37,
    shakeFreq3 = 18,

    // Center orb sprites (inlined; was import from secret_technique_red — same stacking as orbOnly there)
    redSphereEnabled = true, 
    redSphereOrbRadius = null,
    redSphereOrbRadiusFactor = 0.55,
    /** Local +Z inside portalGroup. Must be > ~0.8 so world Z clears frontSmokeGroup (~-2.2) vs portal (-3). */
    redSphereLocalZ = 0.95,
    redSphereOrbColor = 0xffffff,
    /** `red` = warm core (default); `white` = cool falloff for a hot white center. */
    redSphereTextureVariant = 'white',
  } = options;

  const originalBackground = scene.background
    ? scene.background.clone?.() ?? scene.background
    : null;

  // ----------------------------
  // HELPERS
  // ----------------------------
  const rand = (min, max) => min + Math.random() * (max - min);

  function createRadialGlowTexture({
    size = 512,
    innerColor = 'rgba(255,255,255,1)',
    midColor = 'rgba(255,255,255,0.22)',
    outerColor = 'rgba(0,0,0,0)',
    innerStop = 0,
    midStop = 0.4,
    outerStop = 1,
  } = {}) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(innerStop, innerColor);
    g.addColorStop(midStop, midColor);
    g.addColorStop(outerStop, outerColor);

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  function createRingTexture({
    size = 1024,
    innerRadius = 0.52,
    outerRadius = 0.8,
    ringColor = 'rgba(180,220,255,0.9)',
    softColor = 'rgba(120,180,255,0.15)',
    bgColor = 'rgba(0,0,0,0)',
  } = {}) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const rMax = size / 2;

    const g = ctx.createRadialGradient(
      cx,
      cy,
      rMax * innerRadius,
      cx,
      cy,
      rMax * outerRadius
    );

    g.addColorStop(0.0, bgColor);
    g.addColorStop(0.15, softColor);
    g.addColorStop(0.55, ringColor);
    g.addColorStop(0.82, softColor);
    g.addColorStop(1.0, bgColor);

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  function createSpinStreakTexture({
    size = 1024,
    streaks = 14,
    innerRadius = 0.12,
    outerRadius = 0.9,
  } = {}) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const rMax = size / 2;

    // soft base glow so it blends into the core
    const base = ctx.createRadialGradient(cx, cy, 0, cx, cy, rMax);
    base.addColorStop(0.0, 'rgba(255,255,255,0.35)');
    base.addColorStop(0.25, 'rgba(255,255,255,0.12)');
    base.addColorStop(1.0, 'rgba(0,0,0,0)');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.globalCompositeOperation = 'lighter';

    const r0 = rMax * innerRadius;
    const r1 = rMax * outerRadius;

    for (let i = 0; i < streaks; i++) {
      const a0 = (i / streaks) * Math.PI * 2 + rand(-0.08, 0.08);
      const arc = rand(0.25, 0.75);
      const width = rand(size * 0.0022, size * 0.006);
      const alpha = rand(0.08, 0.22);

      const g = ctx.createRadialGradient(0, 0, r0, 0, 0, r1);
      g.addColorStop(0.0, `rgba(255,255,255,${alpha})`);
      g.addColorStop(0.55, `rgba(255,255,255,${alpha * 0.55})`);
      g.addColorStop(1.0, 'rgba(0,0,0,0)');

      ctx.strokeStyle = g;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, 0, rand(r0 * 1.2, r1 * 0.98), a0, a0 + arc);
      ctx.stroke();
    }

    // a tiny off-center “spark” so the rotation reads instantly
    const sx = rMax * 0.12;
    const sy = -rMax * 0.06;
    const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, rMax * 0.18);
    sg.addColorStop(0, 'rgba(255,255,255,0.65)');
    sg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.arc(sx, sy, rMax * 0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  function createSpeckTexture(size = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, size, size);

    for (let i = 0; i < 40; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = rand(1, 6);
      const a = rand(0.08, 0.3);

      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(255,255,255,${a})`);
      g.addColorStop(0.5, `rgba(180,220,255,${a * 0.6})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

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

  /** Two-layer concentrated orb (core + soft glow), matching `orbOnly` in secret_technique_red. */
  function createPortalCenterOrb({
    orbRadius,
    orbColor,
    orbTextureVariant = 'red',
    spriteDepthTest = false,
    spriteRenderOrder = null,
  }) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const half = 512;
    const g = ctx.createRadialGradient(half, half, 0, half, half, half);
    if (orbTextureVariant === 'white') {
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
    ctx.fillRect(0, 0, 1024, 1024);
    const orbTexture = new THREE.CanvasTexture(canvas);
    orbTexture.needsUpdate = true;

    const core = makeSprite(orbTexture, orbColor, orbRadius * 1.06, 0.98);
    const glow = makeSprite(orbTexture, orbColor, orbRadius * 2.05, 0.2);
    glow.position.z = -0.006;
    core.material.depthTest = spriteDepthTest;
    glow.material.depthTest = spriteDepthTest;
    if (spriteRenderOrder != null) {
      core.renderOrder = spriteRenderOrder;
      glow.renderOrder = spriteRenderOrder;
    }

    const group = new THREE.Group();
    group.add(core, glow);

    function dispose() {
      orbTexture.dispose();
      core.material.dispose();
      glow.material.dispose();
    }

    return { group, update: () => {}, dispose };
  }

  // ----------------------------
  // BEAMS
  // ----------------------------
  const thicknessCopies = Math.max(1, Math.floor(beamThicknessCopies));
  const beamTotal = beamCount * thicknessCopies;

  const positions = new Float32Array(beamTotal * 2 * 3);
  const beamXY = new Float32Array(beamCount * 2);
  const beamZ = new Float32Array(beamCount);
  const beamSpeeds = new Float32Array(beamCount);
  const beamPhases = new Float32Array(beamCount);
  const copyOffsetXY = new Float32Array(thicknessCopies * 2);
  const colors = new Float32Array(beamTotal * 2 * 3);

  const inside = new THREE.Color(beamInsideColor);
  const outside = new THREE.Color(beamOutsideColor);
  const palette = beamPalette.map((c) => new THREE.Color(c));

  const randRadius = () => Math.pow(Math.random(), tunnelRadiusPower) * tunnelRadius;

  for (let c = 0; c < thicknessCopies; c++) {
    const angle = (c / thicknessCopies) * Math.PI * 2;
    const radius = Math.sqrt(Math.random()) * beamThicknessSpread;
    copyOffsetXY[c * 2] = Math.cos(angle) * radius;
    copyOffsetXY[c * 2 + 1] = Math.sin(angle) * radius;
  }

  function respawnBeam(i) {
    const angle = Math.random() * Math.PI * 2;
    const radius = randRadius();

    beamXY[i * 2] = Math.cos(angle) * radius;
    beamXY[i * 2 + 1] = Math.sin(angle) * radius;
    beamZ[i] = -Math.random() * beamTravelDistance;
    beamSpeeds[i] = beamSpeed * rand(0.75, 1.25);
    beamPhases[i] = Math.random() * Math.PI * 2;
  }

  for (let i = 0; i < beamCount; i++) {
    respawnBeam(i);

    for (let c = 0; c < thicknessCopies; c++) {
      const idx = (i * thicknessCopies + c) * 6;
      positions[idx] = 0;
      positions[idx + 1] = 0;
      positions[idx + 2] = 0;
      positions[idx + 3] = 0;
      positions[idx + 4] = 0;
      positions[idx + 5] = 0;
    }
  }

  const beamGeometry = new THREE.BufferGeometry();
  beamGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  beamGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const beamMaterial =
    beamColorMode === 'gradient' || beamColorMode === 'palette'
      ? new THREE.LineBasicMaterial({
          transparent: true,
          opacity: beamOpacity,
          vertexColors: true,
          depthWrite: false,
        })
      : new THREE.LineBasicMaterial({
          transparent: true,
          opacity: beamOpacity,
          color: beamColor,
          depthWrite: false,
        });

  const beams = new THREE.LineSegments(beamGeometry, beamMaterial);
  scene.add(beams);

  // ----------------------------
  // PORTAL GROUP
  // ----------------------------
  const portalGroup = new THREE.Group();
  portalGroup.visible = false;
  portalGroup.position.z = -3;
  scene.add(portalGroup);

  // ----------------------------
  // STAR FIELD (suspended in space)
  // ----------------------------
  const starsGroup = new THREE.Group();
  starsGroup.visible = false;
  starsGroup.position.z = -25; // sits deeper than the portal
  scene.add(starsGroup);

  let starsPoints = null;
  let starsGeometry = null;
  let starsMaterial = null;
  const starsState = { scale: 0, vel: 0, active: false };

  if (starsEnabled && starsCount > 0) {
    const starPositions = new Float32Array(starsCount * 3);
    const starColors = new Float32Array(starsCount * 3);
    const baseColor = new THREE.Color(starsColor);
    const holeR = portalRadius * Math.max(0, starsHoleRadiusFactor);
    const outerR = Math.max(holeR + 0.001, starsMaxRadius);

    for (let i = 0; i < starsCount; i++) {
      const idx3 = i * 3;

      // Random direction on sphere (rejection sampling).
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

      // Keep a "hole" around the portal so stars never overlap it.
      const r =
        holeR +
        (outerR - holeR) *
          Math.pow(Math.random(), 1.35);
      const zz = (Math.random() - 0.5) * starsDepth;

      starPositions[idx3] = ux * r;
      starPositions[idx3 + 1] = uy * r;
      starPositions[idx3 + 2] = zz + uz * r * 0.25;

      const b = rand(0.65, 1.0);
      starColors[idx3] = baseColor.r * b;
      starColors[idx3 + 1] = baseColor.g * b;
      starColors[idx3 + 2] = baseColor.b * b;
    }

    starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    starsMaterial = new THREE.PointsMaterial({
      size: starsPointSize,
      sizeAttenuation: true,
      transparent: true,
      opacity: starsOpacity,
      depthTest: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    starsPoints = new THREE.Points(starsGeometry, starsMaterial);
    starsPoints.scale.setScalar(0);
    starsGroup.add(starsPoints);
  }

  const ringTexture = createRingTexture({
    ringColor: 'rgba(255,255,255,0.95)',
    softColor: 'rgba(255,255,255,0.18)',
  });

  const centerSpinTexture = createSpinStreakTexture({
    streaks: 16,
    innerRadius: 0.08,
    outerRadius: 0.92,
  });

  const outerHaloTexture = createRadialGlowTexture({
    size: 768,
    innerColor: 'rgba(255,255,255,0.16)',
    midColor: 'rgba(255,255,255,0.08)',
    outerColor: 'rgba(0,0,0,0)',
    midStop: 0.55,
  });

  function createDriftSmokeTexture({
    width = 1024,
    height = 512,
    puffCount = 90,
  } = {}) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < puffCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;

      const rx = rand(width * 0.04, width * 0.14);
      const ry = rand(height * 0.05, height * 0.18);
      const alpha = rand(0.03, 0.09);

      const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry));
      g.addColorStop(0, `rgba(255,255,255,${alpha})`);
      g.addColorStop(0.45, `rgba(180,220,255,${alpha * 0.55})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rand(-0.5, 0.5));
      ctx.scale(rx / Math.max(rx, ry), ry / Math.max(rx, ry));

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(rx, ry), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // slight horizontal smear to make it feel like drifting fog
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < 18; i++) {
      const y = Math.random() * height;
      const h = rand(6, 22);
      const grad = ctx.createLinearGradient(0, y, width, y);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(0.25, 'rgba(200,230,255,0.08)');
      grad.addColorStop(0.75, 'rgba(200,230,255,0.08)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, y, width, h);
    }
    ctx.globalAlpha = 1;

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  const speckTexture = createSpeckTexture();

  const frontSmokeTexture = createDriftSmokeTexture({
    width: 1400,
    height: 700,
    puffCount: 120,
  });

  const frontSmokeGroup = new THREE.Group();
  frontSmokeGroup.visible = false;
  frontSmokeGroup.position.z = -2.2; // in front of portal
  scene.add(frontSmokeGroup);

  const frontSmokeSheets = [];

  for (let i = 0; i < 4; i++) {
    const smoke = makeSprite(
      frontSmokeTexture,
      0xd8ecff,
      9 + i * 1.8,
      0.12 + i * 0.025,
      THREE.NormalBlending
    );

    smoke.position.set(rand(-2.8, 2.8), rand(-1.6, 1.6), 0.02 + i * 0.02);

    smoke.userData = {
      vx: rand(0.08, 0.22),
      vy: rand(-0.015, 0.015),
      wobble: rand(0.4, 1.2),
      wobbleOffset: Math.random() * Math.PI * 2,
      baseY: smoke.position.y,
    };

    frontSmokeGroup.add(smoke);
    frontSmokeSheets.push(smoke);
  }

  // black core disc
  const core = new THREE.Mesh(
    new THREE.CircleGeometry(portalRadius * 0.9, 128),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 1,
      depthWrite: true,
    })
  );
  portalGroup.add(core);

  // faint inner edge
  const innerEdge = new THREE.Mesh(
    new THREE.RingGeometry(portalRadius * 0.9, portalRadius * 0.98, 128),
    new THREE.MeshBasicMaterial({
      color: portalCoreEdgeColor,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  portalGroup.add(innerEdge);

  // sharp bright ring
  const sharpRing = makeSprite(ringTexture, portalColor, portalRadius * 2.55, 0.95);
  portalGroup.add(sharpRing);

  // soft outer halo (white)
  let outerHalo = null;
  if (outerHaloEnabled) {
    outerHalo = makeSprite(
      outerHaloTexture,
      0xffffff,
      portalRadius * outerHaloScale,
      outerHaloOpacity
    );
    outerHalo.position.z = -0.02;
    outerHalo.material.depthTest = false;
    outerHalo.renderOrder = 10;
    outerHalo.scale.y *= Math.max(0.05, outerHaloOvalY);
    portalGroup.add(outerHalo);
  }

  // fast spinning inner “core ring” (helps sell extreme rotation)
  let centerSpinRing = null;
  if (centerSpinEnabled) {
    centerSpinRing = makeSprite(
      centerSpinTexture,
      0xffffff,
      portalRadius * 2.55 * centerSpinRadiusFactor,
      centerSpinOpacity
    );
    // Put this in front of the black core disc (core writes depth).
    centerSpinRing.position.z = 0.02;
    centerSpinRing.material.blending = THREE.AdditiveBlending;
    centerSpinRing.material.depthTest = false;
    centerSpinRing.renderOrder = 200;
    portalGroup.add(centerSpinRing);
  }

  // debris / specks
  const particleGroup = new THREE.Group();
  portalGroup.add(particleGroup);

  const particles = [];
  for (let i = 0; i < 26; i++) {
    const sprite = makeSprite(
      speckTexture,
      portalParticleColor,
      rand(0.08, 0.22),
      rand(0.12, 0.32),
      THREE.NormalBlending
    );

    const angle = Math.random() * Math.PI * 2;
    const radius = rand(portalRadius * 0.95, portalRadius * 1.35);

    sprite.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      rand(-0.05, 0.08)
    );

    sprite.userData = {
      angle,
      radius,
      speed: rand(-0.5, 0.5),
      drift: rand(-0.04, 0.04),
    };

    particleGroup.add(sprite);
    particles.push(sprite);
  }

  let redSphereFx = null;
  if (redSphereEnabled) {
    const rOrb =
      redSphereOrbRadius ??
      Math.max(0.12, portalRadius * redSphereOrbRadiusFactor);
    redSphereFx = createPortalCenterOrb({
      orbRadius: rOrb,
      orbColor: redSphereOrbColor,
      orbTextureVariant: redSphereTextureVariant,
      spriteDepthTest: false,
      spriteRenderOrder: 120,
    });
    redSphereFx.group.position.z = redSphereLocalZ;
    portalGroup.add(redSphereFx.group);
  }

  // ----------------------------
  // STATE
  // ----------------------------
  const state = {
    phase: 'rays',
    time: 0,
    flashTime: 0,
    portalTime: 0,
  };

  const updateStars = (dt, desiredScale) => {
    if (!starsPoints) return;

    if (
      !starsState.active &&
      Math.abs(desiredScale - starsState.scale) < 0.001 &&
      Math.abs(starsState.vel) < 0.001
    ) {
      return;
    }

    starsState.active = true;
    const delta = desiredScale - starsState.scale;
    starsState.vel += delta * starsStiffness * dt;
    starsState.vel *= Math.exp(-starsDamping * dt);
    starsState.scale += starsState.vel * dt;

    if (Math.abs(desiredScale - starsState.scale) < 0.001 && Math.abs(starsState.vel) < 0.001) {
      starsState.scale = desiredScale;
      starsState.vel = 0;
      starsState.active = false;
    }

    starsPoints.scale.setScalar(Math.max(0, starsState.scale));
  };

  // ----------------------------
  // UPDATE BEAMS
  // ----------------------------
  const updateRays = (dt) => {
    const positionArray = beamGeometry.attributes.position.array;
    const colorArray = beamGeometry.attributes.color.array;

    state.time += dt;

    const travelT = raysDuration > 0 ? Math.min(1, state.time / raysDuration) : 0;
    const pull = 1 - vacuumPullStrength * Math.pow(travelT, vacuumPullPower);

    for (let i = 0; i < beamCount; i++) {
      beamZ[i] += beamSpeeds[i] * dt;

      if (beamZ[i] > 0) {
        beamZ[i] = -beamTravelDistance;

        const angle = Math.random() * Math.PI * 2;
        const radius = randRadius();
        beamXY[i * 2] = Math.cos(angle) * radius;
        beamXY[i * 2 + 1] = Math.sin(angle) * radius;
        beamSpeeds[i] = beamSpeed * rand(0.75, 1.25);
        beamPhases[i] = Math.random() * Math.PI * 2;
      }

      const baseX = beamXY[i * 2];
      const baseY = beamXY[i * 2 + 1];

      const rotationAngle = state.time * tunnelTwist + beamPhases[i] * 0.35;
      const cosA = Math.cos(rotationAngle);
      const sinA = Math.sin(rotationAngle);

      const x0 = (baseX * cosA - baseY * sinA) * pull;
      const y0 = (baseX * sinA + baseY * cosA) * pull;

      const headZ = beamZ[i];
      const tailZ = headZ - beamMaxLength;

      let tailColor = inside;
      let headColor = outside;

      if (beamColorMode === 'palette') {
        const a = Math.floor(Math.random() * palette.length);
        const b = Math.min(
          palette.length - 1,
          Math.max(0, a + (Math.random() < 0.5 ? -1 : 1))
        );
        tailColor = palette[a];
        headColor = palette[b];
      }

      for (let c = 0; c < thicknessCopies; c++) {
        const positionIndex = (i * thicknessCopies + c) * 6;
        const colorIndex = (i * thicknessCopies + c) * 6;

        const ox = copyOffsetXY[c * 2];
        const oy = copyOffsetXY[c * 2 + 1];

        const x = x0 + ox;
        const y = y0 + oy;

        positionArray[positionIndex] = x;
        positionArray[positionIndex + 1] = y;
        positionArray[positionIndex + 2] = tailZ;

        positionArray[positionIndex + 3] = x;
        positionArray[positionIndex + 4] = y;
        positionArray[positionIndex + 5] = headZ;

        if (beamColorMode === 'gradient' || beamColorMode === 'palette') {
          colorArray[colorIndex] = tailColor.r;
          colorArray[colorIndex + 1] = tailColor.g;
          colorArray[colorIndex + 2] = tailColor.b;
          colorArray[colorIndex + 3] = headColor.r;
          colorArray[colorIndex + 4] = headColor.g;
          colorArray[colorIndex + 5] = headColor.b;
        }
      }
    }

    beamGeometry.attributes.position.needsUpdate = true;
    if (beamColorMode === 'gradient' || beamColorMode === 'palette') {
      beamGeometry.attributes.color.needsUpdate = true;
    }
  };

  // ----------------------------
  // UPDATE PORTAL
  // ----------------------------
  const updatePortal = (dt) => {
    state.portalTime += dt;

    const t = state.portalTime;

    // slight spin on the different layers
    sharpRing.material.rotation -= dt * 0.04;
    if (centerSpinRing) {
      // very fast core spin (direction set by sign of centerSpinSpeed)
      centerSpinRing.material.rotation += dt * centerSpinSpeed;
      // subtle “flicker” so it looks energetic rather than flat
      centerSpinRing.material.opacity =
        centerSpinOpacity * (0.85 + 0.15 * Math.sin(t * 16.0));
    }

    // opacity variation to make it feel alive
    sharpRing.material.opacity = 0.9 + Math.sin(t * 3.2) * 0.06;
    innerEdge.material.opacity = 0.4 + Math.sin(t * 4.0) * 0.05;

    // stars: fully expanded (with a tiny twinkle)
    updateStars(dt, 1);
    if (starsMaterial) {
      starsMaterial.opacity = starsOpacity * (0.92 + Math.sin(t * 0.7) * 0.04);
    }

    // particle orbit / drift
    for (const p of particles) {
      p.userData.angle += p.userData.speed * dt;
      p.position.x = Math.cos(p.userData.angle) * p.userData.radius;
      p.position.y = Math.sin(p.userData.angle) * p.userData.radius;
      p.position.z += p.userData.drift * dt;

      if (p.position.z > 0.1) p.position.z = -0.05;
      if (p.position.z < -0.08) p.position.z = 0.08;
    }

    for (const smoke of frontSmokeSheets) {
      smoke.position.x += smoke.userData.vx * dt;
      smoke.position.y =
        smoke.userData.baseY +
        Math.sin(t * smoke.userData.wobble + smoke.userData.wobbleOffset) * 0.08;

      smoke.material.opacity =
        0.08 + Math.sin(t * 0.8 + smoke.userData.wobbleOffset) * 0.025;

      if (smoke.position.x > 4.8) {
        smoke.position.x = -4.8;
        smoke.position.y = rand(-1.8, 1.8);
        smoke.userData.baseY = smoke.position.y;
      }
    }
  };

  // ----------------------------
  // UPDATE FLASH
  // ----------------------------
  const updateFlash = (dt) => {
    state.flashTime += dt;
    const t = Math.min(1, state.flashTime / flashDuration);

    const inWhite = t < whiteFlashFraction;
    const whiteT = whiteFlashFraction <= 0 ? 0 : Math.min(1, t / whiteFlashFraction);

    if (inWhite) {
      scene.background = new THREE.Color(0xffffff);
      beamMaterial.opacity = Math.min(
        1,
        beamOpacity * whiteFlashOpacityBoost * (1 - 0.6 * whiteT)
      );
      portalGroup.visible = false;
      frontSmokeGroup.visible = false;
      starsGroup.visible = false;
      updateStars(dt, 0);
    } else {
      scene.background = new THREE.Color(0x000000);

      const postT =
        whiteFlashFraction >= 1
          ? 1
          : Math.min(1, (t - whiteFlashFraction) / (1 - whiteFlashFraction));

      beamMaterial.opacity = beamOpacity * (1 - postT * postT);

      portalGroup.visible = true;
      starsGroup.visible = true;
      // spin immediately after the white flash
      sharpRing.material.rotation -= dt * 0.04;
      if (centerSpinRing) centerSpinRing.material.rotation += dt * centerSpinSpeed;

      // portal emerges after white flash
      const appear = 1 - Math.pow(1 - postT, 3);
      const scale = 0.15 + appear * 0.85;
      portalGroup.scale.setScalar(scale);

      sharpRing.material.opacity = 0.15 + appear * 0.8;
      frontSmokeGroup.visible = true;

      // stars pop out from the center immediately after the flash
      // During the fade-in we match the portal's `appear` exactly (no spring lag),
      // so stars pop at the same time the vortex does.
      if (starsPoints) {
        starsState.scale = appear;
        starsState.vel = 0;
        starsState.active = false;
        starsPoints.scale.setScalar(appear);
      }
    }

    if (t >= 1) {
      state.phase = 'done';
      beamMaterial.opacity = 0.0;
      portalGroup.visible = true;
      portalGroup.scale.setScalar(1);
      frontSmokeGroup.visible = true;
      starsGroup.visible = true;
      updateStars(dt, 1);
    }
  };

  // ----------------------------
  // MAIN UPDATE
  // ----------------------------
  const update = (dt) => {
    if (redSphereFx) redSphereFx.update(dt);

    if (state.phase === 'rays') {
      updateRays(dt);

      if (state.time >= raysDuration) {
        state.phase = 'flash';
        state.flashTime = 0;
      }
      return;
    }

    if (state.phase === 'flash') {
      updateFlash(dt);
      return;
    }

    if (state.phase === 'done') {
      updatePortal(dt);
    }
  };

  const shouldShake = () => {
    if (!shakeEnabled) return false;
    if (state.phase === 'rays') return true;
    if (state.phase !== 'flash') return false;
    return state.flashTime < flashDuration * whiteFlashFraction;
  };

  const getShake = (t) => {
    if (!shouldShake()) return null;

    // Fade down during rays so it starts energetic and settles.
    const raysT =
      state.phase === 'rays' && raysDuration > 0 ? Math.min(1, state.time / raysDuration) : 1;
    const fade = state.phase === 'rays' ? 1 - raysT * 0.55 : 1;

    const ax = shakePosAmp * fade;
    const ay = shakePosAmp * fade;
    const ar = shakeRotAmp * fade;

    return {
      // Mix a couple sines to feel jittery but stable (no frame-random flicker).
      x:
        (Math.sin(t * shakeFreq1) + Math.sin(t * shakeFreq2) * 0.55 + Math.sin(t * 113.0) * 0.22) *
        ax,
      y:
        (Math.cos(t * (shakeFreq1 + 4)) +
          Math.cos(t * (shakeFreq2 + 4)) * 0.55 +
          Math.sin(t * 127.0) * 0.22) *
        ay,
      rotZ: Math.sin(t * shakeFreq3) * ar,
    };
  };

  const disposeTexture = (obj) => {
    if (obj.material?.map) obj.material.map.dispose();
    if (obj.material) obj.material.dispose();
    if (obj.geometry) obj.geometry.dispose();
  };

  const dispose = () => {
    if (redSphereFx) {
      portalGroup.remove(redSphereFx.group);
      redSphereFx.dispose();
      redSphereFx = null;
    }

    scene.remove(beams);
    scene.remove(portalGroup);
    scene.remove(frontSmokeGroup);
    scene.remove(starsGroup);
    beamGeometry.dispose();
    beamMaterial.dispose();
    frontSmokeGroup.traverse((obj) => {
      disposeTexture(obj);
    });
    if (starsPoints) starsGroup.remove(starsPoints);
    if (starsGeometry) starsGeometry.dispose();
    if (starsMaterial) starsMaterial.dispose();

    if (centerSpinRing) {
      portalGroup.remove(centerSpinRing);
      if (centerSpinRing.material?.map) centerSpinRing.material.map.dispose();
      if (centerSpinRing.material) centerSpinRing.material.dispose();
      centerSpinRing = null;
    }
    if (centerSpinTexture) centerSpinTexture.dispose();

    if (originalBackground) scene.background = originalBackground;
  };

  return {
    update,
    dispose,
    shouldShake,
    getShake,
    beams,
    portal: portalGroup,
  };
}