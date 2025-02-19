import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js'; //can control rotation/view w/ mouse


// (1) SET UP: 
// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;  // SHADOWS 
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.x = 9.4;  // 10 * cos(70°)
camera.position.z = 3.4;   // 10 * sin(70°)
camera.position.y = 10;   

// Scene
const scene = new THREE.Scene();

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.03;

// (2) CREATING 3D PARALLELOGRAM

function Parallelogram(position, rotation, color) {
    const shape = new THREE.Shape();
    shape.moveTo(-1, -0.5);
    shape.lineTo(1, -0.5);
    shape.lineTo(1.5, 0.5);
    shape.lineTo(-0.5, 0.5);
    shape.closePath();

    const extrudeSettings = { depth: 0.1, bevelEnabled: false };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshStandardMaterial({ color: color });

    const parallelogram3D = new THREE.Mesh(geometry, material);
    parallelogram3D.castShadow = true;  
    parallelogram3D.receiveShadow = true;  

    // Apply position and rotation
    parallelogram3D.position.set(position.x, position.y, position.z);
    parallelogram3D.rotation.set(rotation.x, rotation.y, rotation.z);

    scene.add(parallelogram3D);
    return parallelogram3D;
}


const w04_8= Parallelogram({ x: 3, y: -1.2, z: 2.2 }, { x: 0, y: -2, z: 1.7 }, 0x00ffcc);
const w04_9= Parallelogram({ x: 2.5, y:-2, z: 3 }, { x: 0, y: -2.5, z: 1.3 }, 0x00ffcc);

const w03_8= Parallelogram({ x: 3, y: -1, z: 2.2 }, { x: 0, y: -2, z: 1.3 }, 0x00ffcc);
const w03_9= Parallelogram({ x: 2.5, y:-1, z: 3 }, { x: 0, y: -2.5, z: 1.2 }, 0x00ffcc);
const w03_10= Parallelogram({ x: 2, y: 0, z: 3.5 }, { x: 0, y: -2.5, z: 1.2 }, 0x00ffcc);

const w02_8= Parallelogram({ x: 3, y: -0, z: 2.2 }, { x: 0, y: -2, z: 1.3 }, 0x00ffcc);
const w02_9= Parallelogram({ x: 2.5, y:-0, z: 3 }, { x: 0, y: -2.5, z: 1.2 }, 0x00ffcc);
const w02_10= Parallelogram({ x: 2, y: .5, z: 3.5 }, { x: 0, y: -2.5, z: 1.2 }, 0x00ffcc);

const w01_8= Parallelogram({ x: 3, y: 1, z: 2.2 }, { x: 0, y: -2, z: .9 }, 0x00ffcc);
const w01_9= Parallelogram({ x: 2.5, y: 1, z: 3 }, { x: 0, y: -2.5, z: 1.2 }, 0x00ffcc);
const w01_10= Parallelogram({ x: 2, y: 1.5, z: 3.5 }, { x: 0, y: -2.5, z: 1.2 }, 0x00ffcc);
w01_10.scale.set(0.8,0.8,0.8);


const w1= Parallelogram({ x: 0, y: 1, z: 0 }, { x: 0, y: -.05, z: 1 }, 0x00ffcc);
const w2= Parallelogram({ x: .75, y: 1.2, z: 0 }, { x: 0, y: -.2, z: 1 }, 0x00ffcc);
const w3= Parallelogram({ x: 1.5, y: 1.6, z: 0 }, { x: 0, y: -.32, z: 1 }, 0x00ffcc);
const w4= Parallelogram({ x: 2.25, y: 2, z: 0 }, { x: 0, y:-.7, z: 1 }, 0x00ffcc);
const w5= Parallelogram({ x: 3, y: 2.3, z: .5 }, { x: 0, y: -1.5, z: 1 }, 0x00ffcc);
const w6= Parallelogram({ x: 3.3, y: 2, z: 1 }, { x: 0, y: -2, z: .8 }, 0x00ffcc);
const w7= Parallelogram({ x: 3.2, y: 1.6, z: 1.5 }, { x: 0, y: -2, z: .8 }, 0x00ffcc);


const w2_1= Parallelogram({ x: 0, y: 2, z: 0 }, { x: 0, y: -.05, z: 1 }, 0x00ffcc);
const w2_2= Parallelogram({ x: .75, y: 2.2, z: 0 }, { x: 0, y: -.2, z: 1 }, 0x00ffcc);
const w2_3= Parallelogram({ x: 1.5, y: 2.6, z: 0 }, { x: 0, y: -.32, z: 1 }, 0x00ffcc);
const w2_4= Parallelogram({ x: 2.25, y: 3, z: 0 }, { x: 0, y:-.7, z: 1 }, 0x00ffcc);
const w2_5= Parallelogram({ x: 3, y: 3.3, z: .5 }, { x: 0, y: -1.5, z: 1 }, 0x00ffcc);
const w2_6= Parallelogram({ x: 3.3, y: 3, z: 1 }, { x: 0, y: -2, z: .8 }, 0x00ffcc);
const w2_7= Parallelogram({ x: 3.2, y: 2.6, z: 1.5 }, { x: 0, y: -2, z: .8 }, 0x00ffcc);
const w2_8= Parallelogram({ x: 3, y: 2.2, z: 2.2 }, { x: 0, y: -2, z: .9 }, 0x00ffcc);


const w3_1= Parallelogram({ x: 0, y: 3, z: 0 }, { x: 0, y: -.05, z: 1 }, 0x00ffcc);
const w3_2= Parallelogram({ x: .75, y: 3.2, z: 0 }, { x: 0, y: -.2, z: 1 }, 0x00ffcc);
const w3_3= Parallelogram({ x: 1.5, y: 3.6, z: 0 }, { x: 0, y: -.32, z: 1 }, 0x00ffcc);
const w3_4= Parallelogram({ x: 2.25, y: 4, z: 0 }, { x: 0, y:-.7, z: 1 }, 0x00ffcc);
const w3_5= Parallelogram({ x: 3, y: 4.3, z: .5 }, { x: 0, y: -1.5, z: 1 }, 0x00ffcc);
const w3_6= Parallelogram({ x: 3.3, y: 4, z: 1 }, { x: 0, y: -2, z: .8 }, 0x00ffcc);
const w3_7= Parallelogram({ x: 3.2, y: 3.6, z: 1.5 }, { x: 0, y: -2, z: .8 }, 0x00ffcc);
const w3_8= Parallelogram({ x: 3, y: 3.2, z: 2.2 }, { x: 0, y: -2, z: .9 }, 0x00ffcc);
const w3_9= Parallelogram({ x: 2.5, y: 3, z: 3 }, { x: 0, y: -2.5, z: 1.2 }, 0x00ffcc);
const w3_10= Parallelogram({ x: 2, y: 2.5, z: 3.5 }, { x: 0, y: -2.5, z: 1.2 }, 0x00ffcc);
w3_10.scale.set(0.75,0.75,0.75);


// Create and add the right wing to the scene
const rightWing = new THREE.Group();
rightWing.add(w04_8);
rightWing.add(w04_9);
rightWing.add(w03_8);
rightWing.add(w03_9);
rightWing.add(w03_10);
rightWing.add(w02_8);
rightWing.add(w02_9);
rightWing.add(w02_10);
rightWing.add(w01_8);
rightWing.add(w01_9);
rightWing.add(w01_10);
rightWing.add(w1);
rightWing.add(w2);
rightWing.add(w3);
rightWing.add(w4);
rightWing.add(w5);
rightWing.add(w6);
rightWing.add(w7);
rightWing.add(w2_1);
rightWing.add(w2_2);
rightWing.add(w2_3);
rightWing.add(w2_4);
rightWing.add(w2_5);
rightWing.add(w2_6);
rightWing.add(w2_7);
rightWing.add(w2_8);
rightWing.add(w3_1);
rightWing.add(w3_2);
rightWing.add(w3_3);
rightWing.add(w3_4);
rightWing.add(w3_5);
rightWing.add(w3_6);
rightWing.add(w3_7);
rightWing.add(w3_8);
rightWing.add(w3_9);
rightWing.add(w3_10);

rightWing.position.x=-.5;
rightWing.rotation.y = -Math.PI/6; 
rightWing.position.z = .2;
rightWing.position.y += 3
// scene.add(rightWing);

const leftWing = rightWing.clone();
leftWing.scale.x = -1;
leftWing.position.x = -.5;
leftWing.rotation.y = Math.PI + Math.PI/6; // Added PI/6 to rotate counter-clockwise
leftWing.position.z = -.5;
// scene.add(leftWing);



function Rectangle(position, rotation, scale, color, depth) {
    const shape = new THREE.Shape();
    shape.moveTo(-1, -0.5); // Bottom-left
    shape.lineTo(1, -0.5);  // Bottom-right
    shape.lineTo(1, 0.5);   // Top-right
    shape.lineTo(-1, 0.5);  // Top-left
    shape.closePath();      // Close the rectangle

    const extrudeSettings = { depth: depth, bevelEnabled: false };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshStandardMaterial({ color: color });

    const rectangle = new THREE.Mesh(geometry, material);
    rectangle.castShadow = true;
    rectangle.receiveShadow = true;

    rectangle.position.set(position.x, position.y, position.z);
    rectangle.rotation.set(rotation.x, rotation.y, rotation.z);
    rectangle.scale.set(scale.x, scale.y, scale.z); // Controls width, height, and depth

    scene.add(rectangle);
    return rectangle;
}

function Trapezoid(position, rotation, scale, color, depth) {
    const shape = new THREE.Shape();
    shape.moveTo(-1, -0.5); // Bottom-left
    shape.lineTo(1, -0.5);  // Bottom-right
    shape.lineTo(0.6, 0.5); // Top-right (closer to center)
    shape.lineTo(-0.6, 0.5); // Top-left (closer to center)
    shape.closePath(); // Close the trapezoid shape

    const extrudeSettings = { depth: depth, bevelEnabled: false };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshStandardMaterial({ color: color });

    const trapezoid = new THREE.Mesh(geometry, material);
    trapezoid.castShadow = true;
    trapezoid.receiveShadow = true;

    trapezoid.position.set(position.x, position.y, position.z);
    trapezoid.rotation.set(rotation.x, rotation.y, rotation.z);
    trapezoid.scale.set(scale.x, scale.y, scale.z); // Controls width, height, and depth

    scene.add(trapezoid);
    return trapezoid;
}

function SemiCircle(position, rotation, scale, color,depth) {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 1, 0, Math.PI, false); // Semi-circle arc (0 to π)
    
    const extrudeSettings = { depth: depth, bevelEnabled: false };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide });

    const semiCircle = new THREE.Mesh(geometry, material);
    semiCircle.castShadow = true;
    semiCircle.receiveShadow = true;

    semiCircle.position.set(position.x, position.y, position.z);
    semiCircle.rotation.set(rotation.x, rotation.y, rotation.z);
    semiCircle.scale.set(scale.x, scale.y, scale.z);

    scene.add(semiCircle);
    return semiCircle;
}


//head 
const a= Trapezoid(
    { x: -2.1, y: 1.5, z: -.25 },  
    { x: -Math.PI / 2, y: .8, z: -1.55 },  
    { x: .9, y: 1.5, z: 1 },  
    0xff0000, 
    .8
);

// body 
const a_1 = Trapezoid(
    { x: -.5, y: 0, z: -.25 },  
    { x: Math.PI / 2, y: -1.2, z: 1.55 },  // ✅ Flipped by inverting Y and Z rotations
    { x: .9, y: 3, z: 1 },  
    0xff0000, 
    .8
);


// legs
const a_2= Rectangle(
    {  x: -1, y: -1.9, z: .3 },  
    { x: -8, y: 2, z: Math.PI/2 + .15},  
    { x: .38, y: 1.5, z: .45 },  
    0xff0000, 
    1
);
const a_21= Rectangle(
    {  x: -1, y: -1.9, z: -.8 },  
    { x: -8, y: 2, z: Math.PI/2 + .15},  
    { x: .38, y: 1.5, z: .45 },  
    0xff0000, 
    1
);
const a_22= Trapezoid(
    {  x: .4, y: -2.2, z: .3 },  
    { x: Math.PI/2, y: 0 , z: -Math.PI/2},  
    { x: .4, y: 2.7, z: 1 },  
    0xff0000, 
    .5
);
const a_23= Trapezoid(
    {  x: .4, y: -2.2, z: -.8 },  
    { x: Math.PI/2, y: 0 , z: -Math.PI/2},  
    { x: .4, y: 2.7, z: 1 },  
    0xff0000, 
    .5
);

// feet 
const a_5 = Rectangle(
    { x: 1.7, y: -2.5, z: .3 }, 
    { x: -8, y: .8, z: .1 }, 
    { x: .5, y: .75, z: .5 },
    0xff0000, 
    .75
);
const a_6 = Rectangle(
    { x: 1.7, y: -2.5, z: -.8 }, 
    { x: -8, y: .8, z: .1 }, 
    { x: .5, y: .75, z: .5 },
    0xff0000,
    .75
);

// arms
const a_7= Rectangle(
    {  x: -1.8, y: 1.5, z: -1.2 },  
    { x: Math.PI/2, y: 0 , z: -Math.PI/2 +.3},  
    { x: .2, y: 1.7, z: 1 },  
    0xff0000, 
    .4
);
const a_27= Rectangle(
    {  x: -2.7, y: 1.5, z: -1 },  
    { x: Math.PI/2, y: 0 , z: -Math.PI/2 -1.1},  
    { x: .2, y: 1.3, z: 1 },  
    0xff0000, 
    .4
);
const a_8= Rectangle(
    {  x: -1.8, y: 1.5, z: .7 },  
    { x: Math.PI/2, y: 0 , z: -Math.PI/2 -.3},  
    { x: .2, y: 1.7, z: 1 },  
    0xff0000, 
    .4
);
const a_28= Rectangle(
    {  x: -2.7, y: 1.5, z: .5 },  
    { x: Math.PI/2, y: 0 , z: -Math.PI/2 +1.1},  
    { x: .2, y: 1.3, z: 1 },  
    0xff0000, 
    .4
);

const angel = new THREE.Group();
angel.add(a); // head
angel.add(a_1); // body
angel.add(a_2, a_21, a_22, a_23); // legs
angel.add(a_5, a_6); // feet
angel.add(a_7, a_27, a_8, a_28); // arms

angel.position.y += 3
scene.add(angel);
scene.add(leftWing);
scene.add(rightWing);

// tombstone/portal
const s1 = SemiCircle(
    { x: -2.8, y: -2.5, z: -.2 },  
    { x: 0, y:(Math.PI/2), z: 0 },  
    { x: 1.5, y: 4, z: 1 },  
    0xffffff,
    .5
);
const portal = new THREE.Group();
portal.position.y += 3;
portal.add(s1);


scene.add(portal);
// function PortalOutline(position, rotation, scale, color, depth) {
//     const outerRadius = 1;
//     const innerRadius = outerRadius - 0.1; // Controls thickness of the outline

//     const frontGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 32, 1, 0, Math.PI);
    
//     const backGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 32, 1, 0, Math.PI);

//     const material = new THREE.MeshStandardMaterial({
//         color: color,
//         side: THREE.DoubleSide
//     });

//     const front = new THREE.Mesh(frontGeometry, material);
//     const back = new THREE.Mesh(backGeometry, material);

//     back.position.z -= depth; 

//     const portalFrame = new THREE.Group();
//     portalFrame.add(front);
//     portalFrame.add(back);

//     const sideGeometry = new THREE.PlaneGeometry(depth, outerRadius - innerRadius);
//     for (let i = 0; i < 2; i++) {
//         const side = new THREE.Mesh(sideGeometry, material);
//         side.position.z = -depth / 2;
//         side.position.x = Math.cos(i * Math.PI) * outerRadius;
//         side.position.y = Math.sin(i * Math.PI) * outerRadius;
//         side.rotation.y = Math.PI / 2;
//         portalFrame.add(side);
//     }

//     portalFrame.position.set(position.x, position.y, position.z);
//     portalFrame.rotation.set(rotation.x, rotation.y, rotation.z);
//     portalFrame.scale.set(scale.x, scale.y, scale.z);

//     scene.add(portalFrame);
//     return portalFrame;
// }

// // ✅ Add a hollow semi-circle with depth (NO fill)
// const portalOutline = PortalOutline(
//     { x: -2.8, y: .4, z: -0.1 },  
//     { x: 0, y: Math.PI / 2, z: 0 },  
//     { x: 2, y: 4, z: 1 },  
//     0xffffff, 
//     1       
// );



// add stained glass 
const textureLoader = new THREE.TextureLoader();
const glassTextures = [
    'stained_glass_texture.jpg'
].map(filename => {
    const texture = textureLoader.load(filename);
    // Add these texture settings
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // Adjust repeat to control tiling (modify these values as needed)
    texture.repeat.set(1, 1);
    return texture;
});

// Create base materials with different textures
const stainedGlassMaterials = glassTextures.map(texture => 
    new THREE.MeshStandardMaterial({
        color: 0xffffff,  
        transparent: true,
        opacity: 0.8,
        roughness: 0,
        metalness: 0.4,
        emissive: 0x000033,
        emissiveIntensity: 1,
        side: THREE.DoubleSide,
        map: texture,
        // Add these material settings
        flatShading: true,
        // Ensure proper texture mapping
        normalScale: new THREE.Vector2(1, 1)
    })
);

// Apply stained glass material to a group
function applyStainedGlassEffect(group) {
    group.traverse((child) => {
        if (child.isMesh) {
            const yPos = child.position.y;
            const xPos = child.position.x;
            const zPos = child.position.z;
            const materialIndex = Math.abs(Math.floor(yPos)) % stainedGlassMaterials.length;
            
            // Create a unique material instance for this mesh
            const material = stainedGlassMaterials[materialIndex].clone();
            
            // More subtle variations that preserve texture visibility
            const brightness = 0.3 + Math.abs(Math.sin(yPos * 2 + xPos)) * 0.7;
            const contrast = 0.4 + Math.abs(Math.cos(zPos + yPos)) * 0.6;
            
            material.emissiveIntensity = brightness;
            material.opacity = 0.8; // Higher opacity to show texture better
            material.metalness = 0.4; // Lower metalness to reduce reflection
            material.roughness = 0.1; // Low roughness for glass-like appearance
            
            // Subtle color tint that preserves the underlying texture
            material.color.setRGB(
                0.8 + Math.sin(xPos) * 0.4,
                0.8 + Math.sin(yPos) * 0.4,
                0.8 + Math.sin(zPos) * 0.4
            );
            
            child.material = material;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
}

// Apply the effect to angel and wings
applyStainedGlassEffect(angel);
applyStainedGlassEffect(rightWing);
applyStainedGlassEffect(leftWing);

// Update point lights configuration
const lightPositions = [
    // Keep existing outer and center lights
    { x: 10, y: 10, z: 10 },
    { x: -10, y: 10, z: 10 },
    { x: 10, y: 10, z: -10 },
    { x: -10, y: 10, z: -10 },
    { x: 10, y: -10, z: 10 },
    { x: -10, y: -10, z: 10 },
    { x: 10, y: -10, z: -10 },
    { x: -10, y: -10, z: -10 },
    { x: 5, y: -8, z: 5 },
    { x: -5, y: -8, z: 5 },
    { x: 5, y: -8, z: -5 },
    { x: -5, y: -8, z: -5 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 8, z: 0 },
    { x: 0, y: -8, z: 0 },
    // New lights specifically for bottom wing illumination
    { x: 3, y: -5, z: 0 },    // Right wing bottom
    { x: -3, y: -5, z: 0 },   // Left wing bottom
    { x: 2, y: -3, z: 2 },    // Right wing back
    { x: -2, y: -3, z: 2 },   // Left wing back
    { x: 2, y: -3, z: -2 },   // Right wing front
    { x: -2, y: -3, z: -2 },  // Left wing front
    // Additional low-angle lights
    { x: 4, y: -4, z: 4 },
    { x: -4, y: -4, z: 4 },
    { x: 4, y: -4, z: -4 },
    { x: -4, y: -4, z: -4 }
];

lightPositions.forEach(pos => {
    const light = new THREE.PointLight(0x6699ff, 1.2, 50);
    light.position.set(pos.x, pos.y, pos.z);
    scene.add(light);
    
    // Add helper sphere to visualize light positions (optional, remove in production)
    // const helper = new THREE.Mesh(
    //     new THREE.SphereGeometry(0.1),
    //     new THREE.MeshBasicMaterial({ color: 0xffff00 })
    // );
    // helper.position.copy(light.position);
    // scene.add(helper);
});

// Stronger ambient light
const glowLight = new THREE.AmbientLight(0x6699ff, 3); // Increased intensity to 3
scene.add(glowLight);

// Brighter hemisphere light
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 2.5); // Increased intensity to 2.5
scene.add(hemiLight);

// Adjust directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Increased intensity to 1.5
directionalLight.position.set(5, 5, 5); // Lowered height for better bottom coverage
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 30;
directionalLight.shadow.camera.left = -15;
directionalLight.shadow.camera.right = 15;
directionalLight.shadow.camera.top = 15;
directionalLight.shadow.camera.bottom = -15;
directionalLight.shadow.bias = -0.001;
scene.add(directionalLight);

// Very subtle ground shadows
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.1 }); // Reduced shadow opacity significantly

// (4) ADD A SHADOW RECEIVER (GROUND)
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
plane.receiveShadow = true;
scene.add(plane);

// (5) RENDER SCENE 
function animate() {
    requestAnimationFrame(animate);
    controls.update(); 
    renderer.render(scene, camera);
}
animate();
// Parallelogram({ x: 2, y: 1, z: -1 }, { x: 0, y: Math.PI / 4, z: 0 },0x00ffcc);
// Parallelogram({ x: -2, y: -1, z: 1 }, { x: 0, y: 0, z: Math.PI / 6 },0x00ffcc);



