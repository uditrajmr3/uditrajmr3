import "./style.css";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

// torus object
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshBasicMaterial({
//   color: 0xff3647,
//   wireframe: true,
// });
const material = new THREE.MeshStandardMaterial({ color: 0xff3647 });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// light source
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// light helper and grid helper
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

// controller
const controls = new OrbitControls(camera, renderer.domElement);

// populate with stars
function addStars() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

// add count of stars to the scene
Array(200).fill().forEach(addStars);
// add background
const spaceTexture = new THREE.TextureLoader().load("im1.png");
scene.background = spaceTexture;

// to automate render
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

// profile pic as jeff texture
const jeffTexture = new THREE.TextureLoader().load("im5.png");
const jeff = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: jeffTexture })
);

scene.add(jeff);

//
// const randomTexture = new THREE.TextureLoader().load("im3.png");
// const random = new THREE.Mesh(
//   new THREE.BoxGeometry(3, 32, 32),
//   new THREE.MeshBasicMaterial({ map: randomTexture })
// );

// scene.add(random);

animate();
