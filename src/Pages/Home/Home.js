import React, {Component} from 'react';
import * as THREE from 'three';
import {TimelineMax} from 'gsap';
import fragment from './WebGL/fragment.glsl';
import vertex from './WebGL/vertex.glsl';
import img1 from '../../images/1.jpg';
import img2 from '../../images/2.jpg';

const OrbitControls = require('three-orbit-controls')(THREE);

let camera,
    pos,
    controls,
    scene,
    renderer,
    geometry,
    geometry1,
    material,
    plane,
    tex1,
    tex2;
const destination = {x: 0, y: 0};
let textures = [];

const ww = window.innerWidth;
const wh = window.innerHeight;


class Home extends Component {
  componentDidMount() {
    this.init()
    this.animate();
    window.addEventListener('resize', this.resize);
    window.addEventListener('mousemove', this.onMousemove);
    this.time = 0;
    this.renderWGL()

    this.counter = 0;
    this.animating = 0;
    this.cont.addEventListener('click', this.onClick)
  }

  componentWillUnmount() {
    removeEventListener('resize', this.resize)
    removeEventListener('mousemove', this.onMousemove);
    removeEventListener('click', this.onClick)
  }
  init = () => {
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerWidth);

    const container = this.cont;
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.001, 100,
    );
    camera.position.set(0, 0, 1);


    controls = new OrbitControls(camera, renderer.domElement);

    textures = [
      THREE.ImageUtils.loadTexture(img1),
      THREE.ImageUtils.loadTexture(img2),
    ];


    material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        time: {type: 'f', value: 0},
        opacity: {type: 'f', value: 1},
        ratio: {type: 'f', value: 1},
        hWave: {type: 'f', value: 0.02},
        waveLength: {type: 'f', value: 4},
        mouse: {type: 'v2', value: new THREE.Vector2()},
        resolution: {type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
        img1: {type: 't', value: textures[0]},
      },
      // wireframe: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 3 / 4, 64, 64), material);
    scene.add(plane);

    this.resize();
  }

  onClick = (e) => {
      if (this.animating) return;
      this.animating = 1;
      this.counter = (this.counter + 1) % textures.length;
      const tl = new TimelineMax({
        onComplete: () => {
          this.animating = 0;
        }
      });
      tl
          .to(material.uniforms.waveLength, 0.5, {value: 22, onComplete: () => material.uniforms.img1.value = textures[this.counter]})
          // .to(material.uniforms.hWave, 0.5, {value: 1, onUpdate: () => console.log(material.uniforms.hWave.value)})
          .to(material.uniforms.waveLength, 0.5, {value: 3}, 0.5);
  };

  renderWGL = () => {
    material.uniforms.mouse.value.x += (destination.x - material.uniforms.mouse.value.x) * 0.05;
    material.uniforms.mouse.value.y += (destination.y - material.uniforms.mouse.value.y) * 0.05;

    renderer.render(scene, camera);
  }

  resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;

    // calculate scene
    const dist = camera.position.z - plane.position.z;
    const height = 1;
    camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

    if (w / h > 1) {
      plane.scale.x = plane.scale.y = 1.05 * w / h;
    }

    camera.updateProjectionMatrix();
  }

  animate = () => {
    this.time += 0.05;
    material.uniforms.time.value = this.time;

    requestAnimationFrame(this.animate);
    this.renderWGL();
  }

  onMousemove = (e) => {
    const x = (e.clientX - ww / 2) / (ww / 2);
    const y = (e.clientY - wh / 2) / (wh / 2);
    destination.x = y;
    destination.y = x;
  }

  render() {
    return (
        <div>
          <div className="containerHome" ref={node => this.cont = node}/>
        </div>
    );
  }
}

export default Home;
