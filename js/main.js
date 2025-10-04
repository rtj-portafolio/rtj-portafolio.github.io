// Escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Fondo negro

// Cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 30;

// Renderizador
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
// make the canvas full screen and sit behind the content
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
renderer.domElement.style.zIndex = '0';
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
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.2, // brillo base
      roughness: 0.2,
      metalness: 0.8
    });
    const cube = new THREE.Mesh(geometry, material);
    // guardar referencia al material para animar el brillo
    cube.userData.material = material;
    cube.userData.baseEmissive = 0.2; // valor base
    cube.userData.targetEmissive = cube.userData.baseEmissive; // target para lerp
    // target color for the wireframe (dim by default)
    cube.userData.baseLineColor = new THREE.Color(0x666666);
    cube.userData.targetLineColor = cube.userData.baseLineColor.clone();

    // Wireframe para bordes
  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color:0x888888}));
  cube.add(line);
  // guardar referencia a la línea para animar su color
  cube.userData.line = line;

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

  // antes de checar intersecciones, restablecer target de todos los cubos
  const HOVER_EMISSIVE = 1.0; // brillo objetivo al hacer hover
  cubes.forEach(cube => {
    cube.userData.targetEmissive = cube.userData.baseEmissive;
    cube.userData.targetLineColor.copy(cube.userData.baseLineColor);
  });

  // Detectar intersección
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cubes);
  // marcar hovered
  intersects.forEach(intersect => {
    const obj = intersect.object;
    obj.scale.set(1.5,1.5,1.5); // Se agranda al pasar el mouse
    obj.userData.targetEmissive = HOVER_EMISSIVE;
    if(obj.userData.line){
      obj.userData.targetLineColor = new THREE.Color(0xffffff);
    }
  });

  // suavizar transición del brillo emissiveIntensity y del color de la línea
  cubes.forEach(cube => {
    const mat = cube.userData.material;
    if(mat){
      // lerp hacia targetEmissive
      mat.emissiveIntensity += (cube.userData.targetEmissive - mat.emissiveIntensity) * 0.12;
    }
    const line = cube.userData.line;
    if(line && cube.userData.targetLineColor){
      // lerp the line color towards target
      line.material.color.lerp(cube.userData.targetLineColor, 0.12);
    }
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