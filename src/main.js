import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// Cámara
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(5, 3, 5);

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Controles de órbita
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Luces
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Suelo
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x808080,
  roughness: 0.8,
  metalness: 0.2,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.25;
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Variables globales
let locomotive;
const hotspots = [];
let hotspotsVisible = true;

function createTrainTracks() {
  // Asumimos que la locomotora se extiende a lo largo del eje Z
  const trackLength = 15; // Longitud de las vías
  const trackWidth = 3; // Separación entre vías

  const trackGeometry = new THREE.BoxGeometry(trackLength, 0.1, 0.5);
  const trackMaterial = new THREE.MeshStandardMaterial({
    color: 0xffa500, // Código hexadecimal para naranja
    roughness: 0.7,
    metalness: 0.3,
  });

  // Vía izquierda (lado negativo de X)
  const leftTrack = new THREE.Mesh(trackGeometry, trackMaterial);
  leftTrack.position.set(-trackWidth / 2, -0.2, 0);
  leftTrack.receiveShadow = true;
  scene.add(leftTrack);

  // Vía derecha (lado positivo de X)
  const rightTrack = new THREE.Mesh(trackGeometry, trackMaterial);
  rightTrack.position.set(trackWidth / 2, -0.2, 0);
  rightTrack.receiveShadow = true;
  scene.add(rightTrack);
}

// Crear árboles simples
function createTrees() {
  const treeCount = 10;
  const treePositions = [];

  // Generar posiciones aleatorias para los árboles
  for (let i = 0; i < treeCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 5 + Math.random() * 9;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    treePositions.push({ x, z });
  }

  // Crear cada árbol
  treePositions.forEach((pos) => {
    // Tronco
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 1, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x5a3825 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(pos.x, 0, pos.z);
    trunk.castShadow = true;
    scene.add(trunk);

    // Copa del árbol
    const leavesGeometry = new THREE.SphereGeometry(1, 8, 8);
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x2e8b57 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.set(pos.x, 1.5, pos.z);
    leaves.castShadow = true;
    scene.add(leaves);
  });
}

// Crear un hotspot interactivo
function createHotspot(position, name, description) {
  const geometry = new THREE.SphereGeometry(0.2, 16, 16);
  const material = new THREE.MeshBasicMaterial({
    color: 0x952f57,
    transparent: true,
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.copy(position);
  sphere.name = name;
  sphere.userData.description = description;
  scene.add(sphere);
  hotspots.push(sphere);
  return sphere;
}

// Mostrar/ocultar hotspots
function toggleHotspots() {
  hotspotsVisible = !hotspotsVisible;
  hotspots.forEach((hotspot) => {
    hotspot.visible = hotspotsVisible;
  });
}

// Configurar raycasting para interacción con hotspots
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  // Calcular posición normalizada del mouse
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Configurar raycaster
  raycaster.setFromCamera(mouse, camera);

  // Calcular objetos intersectados
  const intersects = raycaster.intersectObjects(hotspots);

  if (intersects.length > 0) {
    const hotspot = intersects[0].object;
    Swal.fire({
      title: hotspot.name,
      text: hotspot.userData.description,
      icon: "info",
      confirmButtonText: "Cerrar",
    });
  }
}

function createGrass() {
    // Textura base para el pasto (primer material)
    const baseGrassGeometry = new THREE.PlaneGeometry(20, 20);
    const baseGrassMaterial = new THREE.MeshStandardMaterial({ // Cambiado el nombre
        color: 0x3a5f0b,
        roughness: 0.6,
        metalness: 0.0
    });
    const baseGrass = new THREE.Mesh(baseGrassGeometry, baseGrassMaterial);
    baseGrass.rotation.x = -Math.PI / 2;
    baseGrass.position.y = -0.25;
    baseGrass.receiveShadow = true;
    scene.add(baseGrass);

    // Hierba 3D (segundo material con diferente nombre)
    const grassCount = 400;
    const grassGeometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    
    for (let i = 0; i < grassCount; i++) {
        const x = Math.random() * 20 - 10;
        const z = Math.random() * 20 - 10;
        const y = 0;
        
        positions.push(x, y, z);
        positions.push(x, y + Math.random() * 0.5 + 0.1, z);
        positions.push(x + (Math.random() - 0.5) * 0.2, y, z + (Math.random() - 0.5) * 0.2);
        
        const hue = 0.3 + Math.random() * 0.1;
        colors.push(hue, 0.8, 0.3);
        colors.push(hue, 0.8, 0.3);
        colors.push(hue, 0.8, 0.3);
    }
    
    grassGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    grassGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const grassBladesMaterial = new THREE.MeshBasicMaterial({ // Cambiado el nombre
        vertexColors: true,
        side: THREE.DoubleSide
    });
    
    const grassField = new THREE.Mesh(grassGeometry, grassBladesMaterial);
    scene.add(grassField);
}

function createSky() {
    // Cielo con gradiente
    const skyGeometry = new THREE.SphereGeometry(50, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
        color: 0x87CEEB,
        side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);
    
    // Niebla para profundidad
    scene.fog = new THREE.FogExp2(0x87CEEB, 0.01);
}

// Cargar modelo GLTF
const loader = new GLTFLoader();
loader.load(
  "/modelos/locomotora.glb",
  (gltf) => {
    locomotive = gltf.scene;
    locomotive.scale.set(1, 1, 1);
    locomotive.position.set(0, 0, 0);

    // Rotar la locomotora si es necesario para alinearla con las vías
    // (ajusta este valor según la orientación de tu modelo)
    locomotive.rotation.y = Math.PI / 2;

    locomotive.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(locomotive);
    controls.target.copy(locomotive.position);
    console.log("Modelo cargado correctamente");

    // Crear entorno
    createTrainTracks();
    createTrees();
    createGrass();
    createSky();

    // Añadir hotspots (puntos interactivos)
    if (locomotive) {
      // Hotspots del lado derecho (valores positivos de X)
      createHotspot(
        new THREE.Vector3(2, 1.5, 1.5),
        "🛤️Sistema de Tracción🛤️",
        "Sistema de tracción con convertidor de par y transmisión eléctrica."
      );
      createHotspot(
        new THREE.Vector3(3.8, 0, 0),
        "🛤️Sistemas de Frenado🛤️",
        "Frenos neumáticos de disco con sistema de seguridad automático."
      );

      // Hotspots del lado izquierdo (valores negativos de X)
      createHotspot(
        new THREE.Vector3(-2, 1.3, 2),
        "⛽Depósito de Combustible⛽",
        "Capacidad de 5000 litros de diésel para largas distancias."
      );
      createHotspot(
        new THREE.Vector3(-2, 0.8, -1),
        "Bogies",
        "Sistema de bogies con suspensión neumática para mayor confort."
      );

      // Hotspot frontal/trasero si es necesario
      createHotspot(
        new THREE.Vector3(-0.2, 0, 0),
        "🚆Parte Delantera🚆",
        "Diseño aerodinámico para reducir resistencia al aire."
      );
     
      createHotspot(
        new THREE.Vector3(1.8, 1.2, -2),
        "Sistema Eléctrico",
        `Generador principal: Alternador trifásico 4,500 VCA
    Rectificación: Puente de diodos de silicio
    Inversores: IGBT para motores de tracción
    Baterías: 4 x 12V 200Ah (sistema auxiliar)
    Circuitos de control: Redundantes (2 canales)
    Protecciones: Disyuntores digitales
    Consumo eléctrico: 1,500 A (plena carga)`
      );
    }
  },
  undefined,
  (error) => {
    console.error("Error al cargar el modelo:", error);
    const errorText = document.createElement("div");
    errorText.style.position = "absolute";
    errorText.style.top = "50%";
    errorText.style.left = "50%";
    errorText.style.transform = "translate(-50%, -50%)";
    errorText.style.color = "red";
    errorText.style.backgroundColor = "white";
    errorText.style.padding = "20px";
    errorText.style.borderRadius = "5px";
    errorText.textContent =
      "Error al cargar el modelo. Verifica la consola para más detalles.";
    document.body.appendChild(errorText);
  }
);

// Event listeners
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener("click", onMouseClick, false);

document
  .getElementById("showHotspots")
  .addEventListener("click", toggleHotspots);

// Animación
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
