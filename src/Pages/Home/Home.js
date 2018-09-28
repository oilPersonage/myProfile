import React, {Component} from 'react';
import * as THREE from 'three';
import {TimelineMax, TweenMax, Power3, Power1} from 'gsap';
import fragment from './WebGL/fragment.glsl';
import vertex from './WebGL/vertex.glsl';

import img1 from '../../images/1.jpg';
import img2 from '../../images/bg2.jpg';
import img3 from '../../images/bg3.jpg';

import frontImg from '../../images/3k.jpg';
import frontImg2 from '../../images/2.png';

import map3 from '../../images/3mask.jpg';
import map2 from '../../images/2mask.jpg'

import PubSub from 'pubsub-js'
// import font from '../../fonts/Roboto_Condensed/Roboto Condensed_Bold.json';
import font from '../../fonts/Pacifico/Pacifico_Regular.json';

const OrbitControls = require('three-orbit-controls')(THREE);

let camera,
    pos,
    controls,
    scene,
    renderer,
    maps,
    fronts,
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
  constructor(props) {
    super(props)
    this.state = {
      animationComplite: true,
      title: <div className="titleHome" ref={node => this.title = node}></div>
    }
  }

  componentDidMount() {

    this.init()
    this.animate();
    window.addEventListener('resize', this.resize);
    window.addEventListener('mousemove', this.onMousemove);
    this.time = 0;
    this.renderWGL()
    this.counter = 0;
    this.animating = 0;
    document.body.addEventListener('click', this.onClick)

    const tl = new TimelineMax();
    this.text.map(item => tl.staggerFromTo(`.${item}`, 0.2, {opacity: 0, y: -100}, {opacity: 1, y: 0, ease: Power1.easeOut }, 0.1))

    window.addEventListener('wheel', (e) => {
      const {active, animation} = this.state
      let deltaY = e.deltaY / 100
      if (deltaY > 1) {deltaY = 1}
      if (deltaY < -1) {deltaY = -1}
      if (animation) {  // выключил клик при анимации
        const Goto = active === 1 && deltaY === -1
            ? 1
            : active === this.dotsCount - 1 && deltaY === 1
                ? this.dotsCount - 1
                : active + deltaY
        if (!(active === 1 && deltaY === -1) && !(active === this.dotsCount - 1 && deltaY === 1) ) PubSub.publish('gotoSlide', {from: this.state.active, to: Goto})
      }
    })
    PubSub.subscribe('gotoSlide', (msg, data) => {
      this.props.toggleMenu(data)
      this.onClick(data.to)
    });
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
    renderer.setSize(window.innerWidth, window.innerHeight);
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
      THREE.ImageUtils.loadTexture(img3),
      THREE.ImageUtils.loadTexture(img2),
      // THREE.ImageUtils.loadTexture(img1),
    ];
    // textures[2].anisotropy = renderer.getMaxAnisotropy();
    textures[0].anisotropy = renderer.getMaxAnisotropy();
    textures[1].anisotropy = renderer.getMaxAnisotropy();

    fronts = [
      THREE.ImageUtils.loadTexture(frontImg),
      THREE.ImageUtils.loadTexture(frontImg2)
    ]
    fronts[0].anisotropy = renderer.getMaxAnisotropy();
    fronts[1].anisotropy = renderer.getMaxAnisotropy();

    maps = [
      THREE.ImageUtils.loadTexture(map3),
      THREE.ImageUtils.loadTexture(map2)
    ]
    maps[0].anisotropy = renderer.getMaxAnisotropy();
    maps[1].anisotropy = renderer.getMaxAnisotropy();

    material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        time: {type: 'f', value: 0},
        opacity: {type: 'f', value: 1},
        ratio: {type: 'f', value: 1},
        uvRate: {type: 'v2', value: new THREE.Vector2(1,1)},
        progress: {type: 'f', value: -0.05},
        hWave: {type: 'f', value: 0.02},
        waveLength: {type: 'f', value: 3},
        mouse: {type: 'v2', value: new THREE.Vector2()},
        resolution: {type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
        img: {type: 't', value: textures[0]},
        front: {type: 't', value: fronts[0]},
        map: {type: 't', value: maps[0]},
      },
      // wireframe: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 64, 64), material);
    scene.add(plane);
    this.resize();
  }

  onClick = (e) => {
    if (e.target.className === "navElem") return
    if (this.animating) return;
    this.animating = 1;
    this.counter = (this.counter + 1) % textures.length;
    this.text.map(item =>
        TweenMax.staggerTo(`.${item}`, 0.4, {opacity: 0, y: -50, ease: Power1.easeOut, onComplete: () => {
            TweenMax.staggerTo(`.${item}`, 0.2, {opacity: 1, y: 0, ease: Power1.easeOut }, 0.1)
          } }, 0.1)
    )

    const tl = new TimelineMax({
      onComplete: () => {
        this.animating = 0;
      }
    });
    tl
        .to(material.uniforms.progress, 4, { ease: Power3.easeOut, value: 1.05, onComplete: () => {
          material.uniforms.img.value = textures[this.counter],
          material.uniforms.map.value = maps[this.counter],
          material.uniforms.front.value = fronts[this.counter]
          }})
        .to(material.uniforms.progress, 0, {value: -0.05})
  };

  renderWGL = () => {
    material.uniforms.mouse.value.x += (destination.x - material.uniforms.mouse.value.x) * 0.05;
    material.uniforms.mouse.value.y += (destination.y - material.uniforms.mouse.value.y) * 0.05;

    renderer.render(scene, camera);
  }

  resize = () => {
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;

    // calculate scene
    const dist = camera.position.z - plane.position.z;
    const height = 1;
    camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist))
    if (w/h>1) {
      const prop = 1080/1920
      const d = h/w
      const y = 1 + 1 * d
      const he = prop + (1 - h/w) - 0.08

      camera.fov = 2 * (180 / Math.PI) * Math.atan(he / (2 * dist))
      material.uniforms.uvRate.value.y = h/w * y
      material.uniforms.uvRate.value.x = 1
      plane.scale.x = w/h
    } else {
      camera.fov = 2 * (180 / Math.PI) * Math.atan(1 / (2 * dist))
      material.uniforms.uvRate.value.y = 1
      material.uniforms.uvRate.value.x = 0.5
      plane.scale.y = h/w;
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

  split = (text) => {
    text = text.split('')
    const newArr = []
    text.map((item, index) => newArr.push(<div key={index} className={`itemTitleHome ${text.join('')}`}>{item}</div>))
    return newArr
  }

  render() {
    this.text = ["создаю","непоторимые", "ПОРТФОЛИО"]
    return (
        <div style={{display: "inline-block"}}>
          <div className="titleHome" ref={node => this.title = node}>
            {/*{this.text.map((item,index) => <div key={index} className={`title${index}`}>{this.split(item)}</div>)}*/}
            {/*<svg>*/}
              {/*<svg height="100" width="">*/}
                {/*<line x1="0" y1="0" x2="0" y2="200" style="stroke:rgb(255,0,0);stroke-width:2" />*/}
              {/*</svg>*/}
            {/*</svg>*/}
          </div>
          <div className="containerHome" ref={node => this.cont = node}/>
        </div>
    );
  }
}

export default Home;
