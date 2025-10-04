// Escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 10;

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

// Cubos futuristas
const cubes = [];
for(let i=0;i<40;i++){
  const geometry = new THREE.BoxGeometry(1,1,1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.1,
    metalness: 0.9,
    emissive: 0x00ffff,
    emissiveIntensity: 0.8
  });
  const cube = new THREE.Mesh(geometry, material);

  // Wireframe glow
  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0x00ffff}));
  cube.add(line);

  cube.position.set((Math.random()-0.5)*12, (Math.random()-0.5)*6, (Math.random()-0.5)*12);
  scene.add(cube);
  cubes.push(cube);
}

// Interacción con el mouse
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', e => {
  mouseX = (e.clientX/window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY/window.innerHeight - 0.5) * 2;
});

// Animación
function animate(){
  requestAnimationFrame(animate);
  cubes.forEach(cube => {
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
