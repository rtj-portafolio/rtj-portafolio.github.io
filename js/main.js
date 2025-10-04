// main.js
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);


const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;


const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10,10,10);
scene.add(light);


const cubes = [];
const geometry = new THREE.BoxGeometry(0.5,0.5,0.5);
const material = new THREE.MeshStandardMaterial({
  color: 0x000000,
  roughness: 0.3,
  metalness: 0.8,
  emissive: 0x111111,
  side: THREE.DoubleSide
});

for(let i=0; i<50; i++){
  const cube = new THREE.Mesh(geometry, material.clone());
  cube.position.set((Math.random()-0.5)*10, (Math.random()-0.5)*5, (Math.random()-0.5)*10);
  scene.add(cube);
  cubes.push(cube);
}


let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e)=>{
  mouseX = (e.clientX/window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY/window.innerHeight - 0.5) * 2;
});

n
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


window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
