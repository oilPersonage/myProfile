import * as THREE from 'three';
import img from '../../../images/1.jpg';

const OrbitControls = require('three-orbit-controls')(THREE);

let camera,
  controls,
  material,
  geometry,
  scene,
  renderer;

export default function init(elem) {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

  renderer = new THREE.WebGLRenderer();

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const container = elem;
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    1,
    3000,
  );
  camera.position.z = 200;

  controls = new OrbitControls(camera, renderer.domElement);

  // geometry = new THREE.BoxGeometry(1, 1, 1);
  // material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  // const cube = new THREE.Mesh(geometry, material);
  const loader = new THREE.TextureLoader();
  loader.load(img, (texture) => {
    material = new THREE.MeshBasicMaterial({
      map: texture,
      wireframe: true,
    });

    geometry = new THREE.Geometry();

    const fase = new THREE.Face3(0, 1, 2);
    geometry.faces.push(fase)
    const pointCloud = new THREE.PointCloud(geometry);

    scene.add(pointCloud);

    function animate() {
      requestAnimationFrame(animate);
      pointCloud.rotation.x += 0.01;
      pointCloud.rotation.y += 0.01;

      renderer.render(scene, camera);
    }

    animate();
  });
}

