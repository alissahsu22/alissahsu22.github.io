import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { memories } from './data.js'

export function createScene({ canvas, orbitSpeedRef }) {
  if (!canvas) return

  const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
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

  const textureLoader = new THREE.TextureLoader()

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

  const gltfLoader = new GLTFLoader()

  gltfLoader.load(
    '/models/old-tv/tv-final.glb',
    (gltf) => {
      const tv = gltf.scene

      // scale + position (you WILL tweak these)
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
        color: 'black',
        emissive: new THREE.Color('#004cff'),
        emissiveIntensity: 0.5,
      })
  )
  tvFace.position.set(0.7, 1.6, 2.141) 

  scene.add(tvFace)

  // tvFace.material.color.set('red')

  const video = document.createElement('video')
  video.src = './videos/test.mp4'
  video.loop = true
  video.muted = true
  video.playsInline = true

  const videoTexture = new THREE.VideoTexture(video)

  tvFace.material.map = videoTexture
  tvFace.material.emissiveMap = videoTexture
  tvFace.material.emissiveIntensity = 1.5
  tvFace.material.needsUpdate = true

  video.play()


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
        emissive: new THREE.Color(color),
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
          phase: Math.random() * Math.PI * 2
    }

      const glow = new THREE.Mesh(
          orbShape,
          new THREE.MeshBasicMaterial({
              color,
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
              color,
              transparent: true,
              opacity: 0.1,
              blending: THREE.AdditiveBlending,
              depthWrite: false
          })
      )
      glowOuter.scale.set(1.7, 1.7, 1.7)
      orb.add(glowOuter)

      const lightGlow = new THREE.PointLight(color, 6)
      lightGlow.castShadow = true
      orb.add(lightGlow)

      orbGroup.add(orb)
  }

  scene.add(orbGroup)

  const tick = () =>
  {
    controls.update()
    const elapsedTime = clock.getElapsedTime()

    for (const orb of orbGroup.children) {
      const d = orb.userData

      // Orbit
      d.angle += d.speed * 0.01 * orbitSpeedRef.current

      orb.position.x = Math.cos(d.angle+ d.phase) * d.radius
      orb.position.z = Math.sin(d.angle+ d.phase) * d.radius

      // Vertical float
      orb.position.y =
        d.baseY +
        Math.sin(elapsedTime * d.floatSpeed + d.angle + d.phase) *
        d.floatHeight

      // pulse light 
      const pulse = 0.5 + Math.sin(elapsedTime * 2 + d.phase) * 0.5
      orb.material.emissiveIntensity = 0.8 + pulse * 0.3
      orb.children[0].material.opacity = 0.04 + pulse * 0.03
      orb.children[1].material.opacity = 0.02 + pulse * 0.02

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

