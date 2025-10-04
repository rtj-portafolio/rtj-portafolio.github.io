// Escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 6;

// Renderizador
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luz
const light = new THREE.PointLight(0x0ff0ff, 1.2);
light.position.set(5,5,5);
scene.add(light);

// Cubos futuristas
const cubes = [];
const geometry = new THREE.BoxGeometry(0.8,0.8,0.8);

for(let i=0; i<50; i++){
  const material = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.1,
    metalness: 0.9,
    emissive: 0x00ffff,   // Emite brillo cian
    emissiveIntensity: 0.7,
    side: THREE.DoubleSide
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set((Math.random()-0.5)*12, (Math.random()-0.5)*6, (Math.random()-0.5)*12);
  cube.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
  scene.add(cube);
  cubes.push(cube);
}

// Movimiento mouse
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