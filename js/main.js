// Escena
const scene = new THREE.Scene();

// Fondo tipo grid futurista
const size = 20;
const divisions = 20;
const gridHelper = new THREE.GridHelper(size, divisions, 0x00ffff, 0x00ffff);
gridHelper.position.y = -3; // Debajo de los cubos
scene.add(gridHelper);

// Cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 10;
camera.position.y = 1;

// Renderizador
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luz
const ambientLight = new THREE.AmbientLight(0x0ff, 0.3);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0x0ff, 1.2);
pointLight.position.set(5,10,5);
scene.add(pointLight);

// Cubos futuristas con wireframe glow
const cubes = [];
for(let i=0; i<40; i++){
  const geometry = new THREE.BoxGeometry(1,1,1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.1,
    metalness: 0.9,
    emissive: 0x00ffff,
    emissiveIntensity: 0.8
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set((Math.random()-0.5)*12, (Math.random()-0.5)*6, (Math.random()-0.5)*12);
  scene.add(cube);

  // Wireframe para resaltar bordes
  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0x00ffff}));
  cube.add(line);

  cubes.push(cube);
}

// Movimiento del mouse
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e)=>{
  mouseX = (e.clientX/window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY/window.innerHeight - 0.5) * 2;
});

// Animación
function animate(){
  requestAnimationFrame(animate);
  cubes.forEach(cube=>{
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.position.x += mouseX*0.01;
    cube.position.y += -mouseY*0.01;
  });
  renderer.render(scene, camera);
}
animate();

// Responsivo
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
