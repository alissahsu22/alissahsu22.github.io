import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { memories } from './data.js'

export function createScene({ canvas, controlsRef, onLoaded }) {
  if (!canvas) return

  const getParams = () => controlsRef?.current

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  const OrbColors = {
    base: '#fffad6',
    secondary: '#fff39b',
    third: '#fffad6'
  }

  const scene = new THREE.Scene()
  let animationId

  // Camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.set(4, 6, 13)
  scene.add(camera)

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  scene.fog = new THREE.FogExp2('#020208', 0.025)
  renderer.setClearColor('#020208', 1)

  // Controls
  const orbitControls = new OrbitControls(camera, renderer.domElement)
  orbitControls.enableDamping = true

  // Loading manager
  const loadingManager = new THREE.LoadingManager()
  loadingManager.onLoad = () => {
    console.log('All assets loaded')
    onLoaded?.()
  }

  const textureLoader = new THREE.TextureLoader(loadingManager)
  const gltfLoader = new GLTFLoader(loadingManager)

  // ---------- Textures / Floor ----------
  const floorAlpha = textureLoader.load('/textures/floor/alpha.jpg')
  const floorColorTexture = textureLoader.load(
    '/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg'
  )
  const floorARMTexture = textureLoader.load(
    '/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg'
  )
  const floorNormalTexture = textureLoader.load(
    '/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.png'
  )
  const floorDisplacementTexture = textureLoader.load(
    '/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.png'
  )

  floorColorTexture.colorSpace = THREE.SRGBColorSpace

  for (const tex of [floorColorTexture, floorARMTexture, floorNormalTexture, floorDisplacementTexture]) {
    tex.repeat.set(8, 8)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
  }

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
      alphaMap: floorAlpha,
      map: floorColorTexture,
      transparent: true,
      roughnessMap: floorARMTexture,
      normalMap: floorNormalTexture,
      displacementMap: floorDisplacementTexture,
      displacementScale: 0.3
    })
  )
  floor.rotation.x = -Math.PI * 0.5
  floor.receiveShadow = true
  scene.add(floor)

  // ---------- TV Model ----------
  gltfLoader.load(
    '/models/old-tv/tv-final.glb',
    (gltf) => {
      const tv = gltf.scene
      tv.scale.set(1, 1, 1)
      tv.position.set(0.7, 0.25, 1)

      tv.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      scene.add(tv)
    },
    undefined,
    (error) => {
      console.error('GLB load error:', error)
    }
  )

  // TV screen plane
  const tvFaceMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#004cff'),
    emissive: new THREE.Color('#004cff'),
    emissiveIntensity: 0.5
  })

  const tvFace = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.7), tvFaceMaterial)
  tvFace.position.set(0.7, 1.6, 2.141)
  scene.add(tvFace)

  // ---------- Raycasting / Hover / Video ----------
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  let hoveredOrb = null
  let activeVideo = null
  let videoTexture = null

  function stopVideo() {
    if (activeVideo) {
      try {
        activeVideo.pause()
      } catch {}
      activeVideo.src = ''
      activeVideo.load()
      activeVideo = null
    }

    if (videoTexture) {
      videoTexture.dispose()
      videoTexture = null
    }

    tvFaceMaterial.map = null
    tvFaceMaterial.emissiveMap = null
    tvFaceMaterial.emissive.set('#004cff')
    tvFaceMaterial.emissiveIntensity = 0.5
    tvFaceMaterial.needsUpdate = true
  }

  function playMemoryVideo(memory) {
    if (activeVideo && activeVideo.dataset.key === memory.video) return

    stopVideo()

    const video = document.createElement('video')
    video.src = memory.video
    video.dataset.key = memory.video
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.crossOrigin = 'anonymous'

    const onLoadedData = () => {
      video.removeEventListener('loadeddata', onLoadedData)

      videoTexture = new THREE.VideoTexture(video)
      videoTexture.colorSpace = THREE.SRGBColorSpace

      tvFaceMaterial.map = videoTexture
      tvFaceMaterial.emissiveMap = videoTexture
      tvFaceMaterial.emissive.set(memory.color)
      tvFaceMaterial.emissiveIntensity = 1.5
      tvFaceMaterial.needsUpdate = true

      video.play().catch(() => {

      })
    }

    video.addEventListener('loadeddata', onLoadedData)
    activeVideo = video
  }

  // ---------- Lights ----------
  const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
  directionalLight.castShadow = true
  directionalLight.position.set(3, 2, -8)
  scene.add(directionalLight)

  // ---------- Orbs ----------
  const orbShape = new THREE.SphereGeometry(0.5, 32, 32)
  const orbGroup = new THREE.Group()
  scene.add(orbGroup)

  for (const key in memories) {
    const { name, color, video } = memories[key]

    const material = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.9,
      metalness: 1,
      roughness: 0.5,
      emissive: new THREE.Color(OrbColors.base),
      emissiveIntensity: 0.3,
      depthWrite: false,    
    })

    const orb = new THREE.Mesh(orbShape, material)

    orb.userData = {
      name,
      color,
      video,
      radius: 5 + Math.random() * 1.5,
      angle: Math.random() * Math.PI * 2,
      speed: 0.2 + Math.random() * 0.8,
      floatSpeed: 0.5 + Math.random(),
      floatHeight: 0.2 + Math.random() * 0.3,
      baseY: 2,
      phase: Math.random() * Math.PI * 2,
      isHovered: false,
      glow: null,
      glowOuter: null,
      lightGlow: null
    }

    const glow = new THREE.Mesh(
      orbShape,
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(OrbColors.secondary),
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    )
    glow.scale.set(1.25, 1.25, 1.25)
    orb.add(glow)

    const glowOuter = new THREE.Mesh(
      orbShape,
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(OrbColors.third),
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    )
    glowOuter.scale.set(1.7, 1.7, 1.7)
    orb.add(glowOuter)

    const lightGlow = new THREE.PointLight(OrbColors.base, 6)
    orb.add(lightGlow)

    orb.userData.glow = glow
    orb.userData.glowOuter = glowOuter
    orb.userData.lightGlow = lightGlow

    orb.renderOrder = 1
    glow.renderOrder = 2
    glowOuter.renderOrder = 3

    orbGroup.add(orb)
  }

  function onHover(event) {
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)

    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(orbGroup.children, true)

    if (intersects.length > 0) {
      let orb = intersects[0].object

      while (orb.parent && !orb.userData?.radius) {
        orb = orb.parent
      }

      if (hoveredOrb !== orb) {
        if (hoveredOrb) hoveredOrb.userData.isHovered = false

        hoveredOrb = orb
        hoveredOrb.userData.isHovered = true

        playMemoryVideo(hoveredOrb.userData)
      }
    } else if (hoveredOrb) {
      hoveredOrb.userData.isHovered = false
      hoveredOrb = null
      stopVideo()
    }
  }

  window.addEventListener('mousemove', onHover)

  function onResize() {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
  }

  window.addEventListener('resize', onResize)

  // ---------- Animation loop ----------
  const clock = new THREE.Clock()

  const DEFAULT_PARAMS = {
    fogEnabled: true,
    fogDensity: 0.025,
    glowStrength: 1,
    orbitSpeed: 1,
    floatiness: 1
  }
const tick = () => {
  const time = clock.getElapsedTime()
  orbitControls.update()

  const params = getParams() ?? DEFAULT_PARAMS

  if (params.fogEnabled) {
    if (!scene.fog) scene.fog = new THREE.FogExp2('#020208', params.fogDensity)
    scene.fog.density = params.fogDensity
  } else {
    scene.fog = null
  }

  const hoveredColor = hoveredOrb?.userData?.color ?? null
  const lightColor = hoveredColor ?? '#ffffff'

  ambientLight.color.set(lightColor)
  directionalLight.color.set(lightColor)

  ambientLight.intensity = hoveredColor ? 0.65 : 0.5
  directionalLight.intensity = hoveredColor ? 1.7 : 1.5

  const glowMult = params.glowStrength

  for (const orb of orbGroup.children) {
    const d = orb.userData
    const glow = d.glow
    const glowOuter = d.glowOuter
    const lightGlow = d.lightGlow

    const pulse = 0.5 + Math.sin(time * 2 + d.phase) * 0.5

    const emissiveColor = d.isHovered ? d.color : OrbColors.base
    const glowColor     = d.isHovered ? d.color : OrbColors.secondary
    const outerColor    = d.isHovered ? d.color : OrbColors.third

    orb.material.emissive.set(emissiveColor)
    orb.material.emissiveIntensity = d.isHovered ? 0.9 : 0.5

    glow.material.color.set(glowColor)
    glowOuter.material.color.set(outerColor)

    lightGlow.color.set(d.isHovered ? d.color : OrbColors.base)

    // Original baseline glow, but multiplied by slider ALWAYS
    const inner = (0.12 + pulse * 0.05) * glowMult
    const outer = (0.08 + pulse * 0.04) * glowMult

    glow.material.opacity = inner
    glowOuter.material.opacity = outer

    // Keep original scale feel; slightly boost with glowStrength so it’s visible
    if (d.isHovered) {
      glow.scale.setScalar(1.3 + pulse * 0.05 + glowMult * 0.02)
      glowOuter.scale.setScalar(1.75 + pulse * 0.08 + glowMult * 0.03)
    } else {
      glow.scale.setScalar(1.25 + pulse * 0.03 + glowMult * 0.02)
      glowOuter.scale.setScalar(1.7 + pulse * 0.05 + glowMult * 0.03)

      d.angle += d.speed * 0.01 * params.orbitSpeed
    }

    // Make the point light respond a bit too (helps “glow” feel without bloom)
    lightGlow.intensity = (d.isHovered ? 8 : 6) * (0.6 + glowMult * 0.5)

    // Orbit
    orb.position.x = Math.cos(d.angle + d.phase) * d.radius
    orb.position.z = Math.sin(d.angle + d.phase) * d.radius

    // Float
    orb.position.y =
      d.baseY +
      Math.sin(time * d.floatSpeed + d.phase) *
      (d.floatHeight * params.floatiness)
  }

  renderer.render(scene, camera)
  animationId = requestAnimationFrame(tick)
}


  tick()

  // ---------- Cleanup ----------
  return () => {
    cancelAnimationFrame(animationId)

    window.removeEventListener('resize', onResize)
    window.removeEventListener('mousemove', onHover)

    stopVideo()

    orbitControls.dispose()
    renderer.dispose()

    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose()

      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose())
        } else {
          obj.material.dispose()
        }
      }
    })

    for (const tex of [
      floorAlpha,
      floorColorTexture,
      floorARMTexture,
      floorNormalTexture,
      floorDisplacementTexture
    ]) {
      tex?.dispose?.()
    }
  }
}


