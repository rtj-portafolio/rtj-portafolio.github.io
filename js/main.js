// Escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Fondo negro

// Cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 30;

// Renderizador
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luz
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(50,50,50);
scene.add(pointLight);

// Crear cubos en grid
const cubes = [];
const gridX = 10;
const gridY = 6;
const spacing = 4;

for(let i=0;i<gridX;i++){
  for(let j=0;j<gridY;j++){
    const geometry = new THREE.BoxGeometry(2,2,2);
    const material = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0xffffff,
      roughness: 0.2,
      metalness: 0.8
    });
    const cube = new THREE.Mesh(geometry, material);

    // Wireframe para bordes
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color:0xffffff}));
    cube.add(line);

    cube.position.set((i-gridX/2)*spacing, (j-gridY/2)*spacing, 0);
    scene.add(cube);
    cubes.push(cube);
  }
}

// Raycaster para interacción con el mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event)=>{
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
});

// Animación
function animate(){
  requestAnimationFrame(animate);

  // Reset escala de todos los cubos
  cubes.forEach(cube => cube.scale.set(1,1,1));

  // Detectar intersección
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cubes);
  intersects.forEach(intersect => {
    intersect.object.scale.set(1.5,1.5,1.5); // Se agranda al pasar el mouse
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
// Activate glow/sweep for the description badge on load
window.addEventListener('load', ()=>{
  const desc = document.getElementById('description');
  if(desc){
    // ensure classes exist (index.html already may include sweep-on)
    desc.classList.add('sweep-on');
    desc.classList.add('animate-glow');
    // if you want a delayed sweep instead, uncomment next line
    // setTimeout(()=> desc.classList.add('sweep-on'), 300);
  }
});