import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { memories } from './data.js'

export function createScene({ canvas, orbitSpeedRef, onLoaded }) {
  if (!canvas) return

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

  // scene.fog = new THREE.FogExp2('#020208', 0.06)

  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.x = 4
  camera.position.y = 6
  camera.position.z = 13
  scene.add(camera)

  const renderer = new THREE.WebGLRenderer({
      canvas: canvas
  })

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const controls = new OrbitControls(camera, renderer.domElement)
  const loadingManager = new THREE.LoadingManager()

  loadingManager.onLoad = () => {
    console.log('All assets loaded')
    if (onLoaded) onLoaded()
  }

  const textureLoader = new THREE.TextureLoader(loadingManager)
  const gltfLoader = new GLTFLoader(loadingManager)

  const floorAlpha = textureLoader.load('/textures/floor/alpha.jpg')
  const floorColorTexture = textureLoader.load('/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg')
  const floorARMTexture = textureLoader.load('/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg')
  const floorNormalTexture = textureLoader.load('/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.png')
  const floorDisplacementTexture = textureLoader.load('/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.png')
  floorColorTexture.colorSpace = THREE.SRGBColorSpace

  floorColorTexture.repeat.set(8, 8)
  floorARMTexture.repeat.set(8, 8)
  floorNormalTexture.repeat.set(8, 8)
  floorDisplacementTexture.repeat.set(8, 8)

  floorColorTexture.wrapS = THREE.RepeatWrapping
  floorARMTexture.wrapS = THREE.RepeatWrapping
  floorNormalTexture.wrapS = THREE.RepeatWrapping
  floorDisplacementTexture.wrapS = THREE.RepeatWrapping

  floorColorTexture.wrapT = THREE.RepeatWrapping
  floorARMTexture.wrapT = THREE.RepeatWrapping
  floorNormalTexture.wrapT = THREE.RepeatWrapping
  floorDisplacementTexture.wrapT = THREE.RepeatWrapping

  const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20,20,100,100),
      new THREE.MeshStandardMaterial({
          alphaMap:floorAlpha,
          map:floorColorTexture,
          transparent:true,
          // aoMap: floorARMTexture,
          roughnessMap: floorARMTexture,
          // metalnessMap: floorARMTexture,
          normalMap: floorNormalTexture,
          displacementMap: floorDisplacementTexture,
          displacementScale: 0.3,
      })
  )
  floor.rotation.x = -Math.PI * 0.5
  floor.receiveShadow = true
  scene.add(floor)

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

  const tvFace = new THREE.Mesh(
      new THREE.PlaneGeometry(2.5, 1.7), 
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#004cff'),
        emissive: new THREE.Color('#004cff'),
        emissiveIntensity: 0.5,
      })
  )
  tvFace.position.set(0.7, 1.6, 2.141) 

  scene.add(tvFace)

  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  let hoveredOrb = null
  let activeVideo = null
  let videoTexture = null

  function playMemoryVideo(memory) {
    console.log('playv video')

    if (activeVideo) {
      const currentVideoSrc = activeVideo.src

      // if same 
      if (currentVideoSrc.includes(memory.video)) {
          return
      }
    }

    stopVideo()

    const video = document.createElement('video')
    video.src = memory.video
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.preload = 'none'

    video.addEventListener('loadeddata', () => {
      videoTexture = new THREE.VideoTexture(video)
      videoTexture.colorSpace = THREE.SRGBColorSpace
    
      tvFace.material.map = videoTexture
      tvFace.material.emissiveMap = videoTexture

      tvFace.material.emissive.set(memory.color)
      tvFace.material.emissiveIntensity = 1.5

      tvFace.material.needsUpdate = true

      video.play()
    })

    activeVideo = video
  }

  function stopVideo() {
    if (activeVideo) {
      activeVideo.pause()
      activeVideo.src = ''
      activeVideo.load()
      activeVideo = null
    }

    if (videoTexture) {
      videoTexture.dispose()
      videoTexture = null
    }
    tvFace.material.map = null
    tvFace.material.emissiveMap = null
    tvFace.material.emissive = new THREE.Color('#004cff')
    tvFace.material.emissiveIntensity = 0.5
    tvFace.material.needsUpdate = true
  }

  window.addEventListener('mousemove', onHover)

  function onHover(event) {
    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = -(event.clientY / sizes.height) * 2 + 1

    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(orbGroup.children, true)

    if (intersects.length > 0) {
      let orb = intersects[0].object

      while (orb.parent && !orb.userData?.radius) {
        orb = orb.parent
      }

      if (hoveredOrb !== orb) {
        if (hoveredOrb) {
          hoveredOrb.userData.isHovered = false
        }

        hoveredOrb = orb
        orb.userData.isHovered = true

        playMemoryVideo(orb.userData)
      }
    } else if (hoveredOrb) {
      hoveredOrb.userData.isHovered = false
      hoveredOrb = null
      stopVideo()
    }
  }


  // Ambient light
  const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
  scene.add(ambientLight)

  // Directional light
  const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
  directionalLight.castShadow = true
  directionalLight.position.set(3, 2, -8)
  scene.add(directionalLight)

  const onResize = () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
  }

  window.addEventListener('resize', onResize)


  const clock = new THREE.Clock()

  const orbShape = new THREE.SphereGeometry(0.5)

  const orbGroup = new THREE.Group()

  // poss can make orbs red? (scarier)
  
  for(const key in memories){
      const {name, color, video} = memories[key]

      const material = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        transparent: true, 
        opacity: 0.9,
        metalness: 1,
        roughness: 0.5,
        // emissive: new THREE.Color(color),
        emissive: OrbColors.base,
        emissiveIntensity: 0.3
      })


      const orb = new THREE.Mesh(orbShape, material)
      orb.userData = {
          name: name, 
          color: color, 
          video: video, 
          radius: 5 + Math.random() * 1.5,
          angle: Math.random() * Math.PI * 2,
          speed: 0.2 + Math.random() * 0.8,
          floatSpeed: 0.5 + Math.random(),
          floatHeight: 0.2 + Math.random() * 0.3,
          baseY: 2, 
          phase: Math.random() * Math.PI * 2, 
          isHovered: false,
    }

      const glow = new THREE.Mesh(
          orbShape,
          new THREE.MeshBasicMaterial({
              // color,
              color:OrbColors.secondary,
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
              // color,
               color: OrbColors.third,
              transparent: true,
              opacity: 0.1,
              blending: THREE.AdditiveBlending,
              depthWrite: false
          })
      )
      glowOuter.scale.set(1.7, 1.7, 1.7)
      orb.add(glowOuter)

      const lightGlow = new THREE.PointLight(OrbColors.base, 6)
      // lightGlow.castShadow = true
      orb.add(lightGlow)

      orbGroup.add(orb)

      orb.userData.glow = glow
      orb.userData.glowOuter = glowOuter
      orb.userData.lightGlow = lightGlow
  }

  scene.add(orbGroup)

  const tick = () =>
  {
    controls.update()
    const elapsedTime = clock.getElapsedTime()

    for (const orb of orbGroup.children) {
      const d = orb.userData
      const glow = d.glow
      const glowOuter = d.glowOuter
      const lightGlow = d.lightGlow

      const pulse = 0.5 + Math.sin(elapsedTime * 2 + d.phase) * 0.5

      if (d.isHovered) {
        orb.material.emissive.set(d.color)
        orb.material.emissiveIntensity = 0.9

        glow.material.color.set(d.color)
        glowOuter.material.color.set(d.color)

        glow.material.opacity = 0.25 + pulse * 0.1
        glowOuter.material.opacity = 0.18 + pulse * 0.08

        glow.scale.setScalar(1.3 + pulse * 0.05)
        glowOuter.scale.setScalar(1.75 + pulse * 0.08)

        lightGlow.color.set(d.color)
      } 
      else {
        orb.material.emissive.set(OrbColors.base)
        orb.material.emissiveIntensity = 0.5

        glow.material.color.set(OrbColors.secondary)
        glowOuter.material.color.set(OrbColors.secondary)

        glow.material.opacity = 0.12 + pulse * 0.05
        glowOuter.material.opacity = 0.08 + pulse * 0.04

        glow.scale.setScalar(1.25 + pulse * 0.03)
        glowOuter.scale.setScalar(1.7 + pulse * 0.05)

        lightGlow.color.set(OrbColors.base)

        d.angle += d.speed * 0.01 * orbitSpeedRef.current
      }

      orb.position.x = Math.cos(d.angle + d.phase) * d.radius
      orb.position.z = Math.sin(d.angle + d.phase) * d.radius
      orb.position.y =
        d.baseY +
        Math.sin(elapsedTime * d.floatSpeed + d.angle + d.phase) *
        d.floatHeight
      }


    renderer.render(scene, camera)
    animationId = requestAnimationFrame(tick)
  }

  tick()

  return () => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', onResize)

    controls.dispose()
    renderer.dispose()

    scene.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose())
        } else {
          obj.material.dispose()
        }
      }
    })
  }

}

