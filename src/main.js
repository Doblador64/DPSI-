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

// Luz
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
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Cargar modelo GLTF
const loader = new GLTFLoader();
loader.load(
  "/modelos/locomotora.glb", // Asegúrate de que el archivo está en public/modelos/
  (gltf) => {
    const locomotive = gltf.scene;
    locomotive.scale.set(1, 1, 1);
    locomotive.position.set(0, 0, 0);

    locomotive.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(locomotive);
    controls.target.copy(locomotive.position);
    console.log("Modelo cargado correctamente");
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

// Ajustar al redimensionar
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animación
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
