// Escena y cámara
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 20;

// Renderizador
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luz
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10,10,10);
scene.add(pointLight);

// Crear cuadrículas de cubos
const cubes = [];
const cubeSize = 1;
const spacing = 2;
const gridX = 10;
const gridY = 6;

for(let i=0;i<gridX;i++){
  for(let j=0;j<gridY;j++){
    const geometry = new THREE.BoxGeometry(cubeSize,cubeSize,cubeSize);
    const material = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0xffffff,
      roughness:0.2,
      metalness:0.8
    });
    const cube = new THREE.Mesh(geometry, material);

    // Bordes
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color:0xffffff}));
    cube.add(line);

    cube.position.set((i-gridX/2)*spacing, (j-gridY/2)*spacing, 0);
    scene.add(cube);
    cubes.push(cube);
  }
}

// Raycaster para detectar mouse sobre cubos
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event){
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener('mousemove', onMouseMove);

// Animación
function animate(){
  requestAnimationFrame(animate);

  // Detectar intersecciones
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cubes);

  cubes.forEach(cube => {
    // Escala base
    cube.scale.set(1,1,1);
  });

  intersects.forEach(intersect=>{
    intersect.object.scale.set(1.5,1.5,1.5); // Se agranda al pasar mouse
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
