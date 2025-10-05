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
// Asegurar que el renderer limpie a negro
renderer.setClearColor(0x000000, 1);
// make the canvas full screen and sit behind the content
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
renderer.domElement.style.zIndex = '0';
document.body.appendChild(renderer.domElement);
// Keep document background controlled by CSS so the gradient shows through
// (do not override body/html background here)
// renderer.domElement.style.background = '#000';
// poner canvas detrás del contenido para que no tape elementos
renderer.domElement.style.zIndex = '-3';
renderer.domElement.style.pointerEvents = 'none';

// Luz
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(50,50,50);
scene.add(pointLight);

// Crear cubos en un grid 3D (capas) para sensación de apilamiento 3D
const cubes = [];
const gridX = 10;
const gridY = 6;
const layers = 3; // número de capas en Z
const cubeSize = 3;
const spacing = 4; // separación en X/Y
const layerSpacing = 3.6; // separación entre capas Z

// agrupar todos los cubos para rotar el conjunto suavemente
const gridGroup = new THREE.Group();
scene.add(gridGroup);

for (let k = 0; k < layers; k++) {
  for (let i = 0; i < gridX; i++) {
    for (let j = 0; j < gridY; j++) {
      const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const material = new THREE.MeshStandardMaterial({
        color: 0x06060a, // muy oscuro para que el emissive destaque
        emissive: new THREE.Color(0x66ccff),
        emissiveIntensity: 0.06, // brillo base bajo
        roughness: 0.25,
        metalness: 0.6
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.userData.material = material;
      cube.userData.baseEmissive = 0.06;
      cube.userData.targetEmissive = cube.userData.baseEmissive;
      cube.userData.baseLineColor = new THREE.Color(0x555555);
      cube.userData.targetLineColor = cube.userData.baseLineColor.clone();

      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x8888aa }));
      cube.add(line);
      cube.userData.line = line;

      const x = (i - (gridX - 1) / 2) * spacing;
      const y = (j - (gridY - 1) / 2) * spacing;
      const z = (k - (layers - 1) / 2) * layerSpacing;
      cube.position.set(x, y, z);
      gridGroup.add(cube);
      cubes.push(cube);
    }
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
  cubes.forEach(cube => cube.scale.set(1, 1, 1));

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
    obj.scale.set(1.6, 1.6, 1.6); // Se agranda al pasar el mouse
    obj.userData.targetEmissive = HOVER_EMISSIVE * 1.6; // brillo más intenso
    if (obj.userData.line) {
      obj.userData.targetLineColor = new THREE.Color(0xffffff);
    }
  });

  // suavizar transición del brillo emissiveIntensity y del color de la línea
  cubes.forEach(cube => {
    const mat = cube.userData.material;
    if(mat){
      // lerp hacia targetEmissive
      mat.emissiveIntensity += (cube.userData.targetEmissive - mat.emissiveIntensity) * 0.16;
    }
    const line = cube.userData.line;
    if(line && cube.userData.targetLineColor){
      // lerp the line color towards target
      line.material.color.lerp(cube.userData.targetLineColor, 0.12);
    }
  });

  // rotar ligeramente el grupo para dar sensación 3D dinámica
  gridGroup.rotation.y += 0.0012;

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
  // Populate fallback grid (CSS-only) in case WebGL doesn't render or canvas is blocked
  const fallback = document.getElementById('fallback-grid');
  if(fallback){
    // create a bunch of cells
    const cols = 10;
    const rows = 6;
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const cell = document.createElement('div');
        cell.className = 'cell';
        fallback.appendChild(cell);
      }
    }
  }

  // If WebGL context created successfully, hide fallback
  // We check if renderer.domElement has a WebGL context
  let hasGL = false;
  try{
    const gl = renderer.getContext();
    if(gl) hasGL = true;
  }catch(e){ hasGL = false; }
  if(hasGL){
    if(fallback) fallback.style.display = 'none';
  }
});

// Force the correct description text in case of stale HTML or cache
window.addEventListener('DOMContentLoaded', ()=>{
  const desc = document.getElementById('description');
  if(desc){
    // Do not overwrite the DOM here to avoid duplicate text. The HTML already contains
    // the correct sentence and the circular icon link. We only ensure classes are present.
    desc.classList.add('sweep-on');
    desc.classList.add('animate-glow');
  }
});