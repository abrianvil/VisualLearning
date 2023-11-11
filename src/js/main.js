import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Maze from './Maze.js';

// Scene setup
const scene = new THREE.Scene();

// Camera setup
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.set(0, 0, 5);
const aspect=window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(-5*aspect, 5*aspect, 5, -5, 0.1, 100);
camera.position.set(0, 20, 0);
camera.lookAt(0, 0, 0);

// Maze setup
const maze = new Maze(15, 15);
maze.generate();
maze.draw(scene);
console.log(maze);

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Basic render loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(50, 55, 50);
scene.add(directionalLight);

// Maze Geometry
const gridHelper = new THREE.GridHelper(15, 15);
scene.add(gridHelper);

// Camera Controls
const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableRotate = false; // Disable camera rotation for a fixed top-down view

// Responsive window
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}