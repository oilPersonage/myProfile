import React, {Component} from 'react';
import * as THREE from 'three';
import {TimelineMax, TweenMax, Power3, Power1} from 'gsap';
import fragment from './WebGL/fragment.glsl';
import fragmentTwo from './WebGL/twoFregment/fragment.glsl';
import vertex from './WebGL/vertex.glsl';
import vertex2 from './WebGL/twoFregment/vertex.glsl';

import img1 from '../../images/bg2.jpg';
import img2 from '../../images/bg3.jpg';
import img3 from '../../images/bg4.jpg';
import img4 from '../../images/bg5.jpg';

import front1 from '../../images/2.png'
import front2 from '../../images/3.png'
import front3 from '../../images/front3.png'
import front4 from '../../images/front5.png'

import PubSub from 'pubsub-js'
import font from '../../fonts/Roboto_Condensed/RobotoCondensed_Bold.json';

const OrbitControls = require('three-orbit-controls')(THREE);

let camera,
    pos,
    controls,
    scene,
    renderer,
    maps,
    fronts,
    twoMaterial,
    material,
    textMesh,
    plane,
    plane2,
    plane3;
const destination = {x: 0, y: 0};
let textures = [];

const ww = window.innerWidth;
const wh = window.innerHeight;


class Home extends Component {
  constructor(props) {
    super(props)
    this.text = [
      [<div key='1' className="title0 oneElem">создаю не повторимые</div>, <div key='21' className="title2">ПОРТФОЛИО</div>],
      [<div key='2' className="title0">захватывающая</div>, <div key='22' className="title2">АНИМАЦИЯ</div>],
      [<div key='3' className="title0 threeHomeText">индивидуальный подход к каждому</div>, <div key='23' className="title2 threeHomeText">КЛИЕНТУ</div>],
      [<div key='4' className="title0">реализую любую</div>, <div key='24' className="title2">ВАШУ ИДУЮ</div>]
    ]
    this.state = {
      currentText: this.text[0],
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


    // controls = new OrbitControls(camera, renderer.domElement);

    textures = [
      THREE.ImageUtils.loadTexture(img1),
      THREE.ImageUtils.loadTexture(img2),
      THREE.ImageUtils.loadTexture(img3),
      THREE.ImageUtils.loadTexture(img4),
    ];
    textures[1].anisotropy = renderer.getMaxAnisotropy();
    textures[0].anisotropy = renderer.getMaxAnisotropy();
    textures[2].anisotropy = renderer.getMaxAnisotropy();
    textures[3].anisotropy = renderer.getMaxAnisotropy();

    fronts = [
      THREE.ImageUtils.loadTexture(front1),
      THREE.ImageUtils.loadTexture(front2),
      THREE.ImageUtils.loadTexture(front3),
      THREE.ImageUtils.loadTexture(front4)
    ]
    fronts[0].anisotropy = renderer.getMaxAnisotropy();
    fronts[1].anisotropy = renderer.getMaxAnisotropy();
    fronts[2].anisotropy = renderer.getMaxAnisotropy();
    fronts[3].anisotropy = renderer.getMaxAnisotropy();

    material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        time: {type: 'f', value: 0},
        opacity: {type: 'f', value: 1},
        uvRate: {type: 'v2', value: new THREE.Vector2(1,1)},
        click: {type: 'v2', value: new THREE.Vector2(-1.1, -1)},
        progress: {type: 'f', value: 0},
        hWave: {type: 'f', value: 0.02},
        waveLength: {type: 'f', value: 3},
        mouse: {type: 'v2', value: new THREE.Vector2()},
        resolution: {type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
        img: {type: 't', value: textures[0]},
        nextImg: {type: 't', value: textures[1]},
      },
      // wireframe: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });
    twoMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: 0,
      uniforms: {
        time: {type: 'f', value: 0},
        opacity: {type: 'f', value: 1},
        click: {type: 'v2', value: new THREE.Vector2(-1.1, -1)},
        uvRate: {type: 'v2', value: new THREE.Vector2(1,1)},
        progress: {type: 'f', value: 0},
        hWave: {type: 'f', value: 0.02},
        waveLength: {type: 'f', value: 3},
        mouse: {type: 'v2', value: new THREE.Vector2()},
        resolution: {type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
        front: {type: 't', value: fronts[0]},
        nextFront: {type: 't', value: fronts[1]},
      },
      // wireframe: true,
      vertexShader: vertex2,
      fragmentShader: fragmentTwo,
    });

    const loader = new THREE.FontLoader()
    loader.load('./fonts/Roboto_Condensed/RobotoCondensed_Bold.json', ft => {
      const textGeometry = new THREE.TextGeometry( 'Patrick Sullivan', {
        font: ft,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelSegments: 5
      } );

      const textMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
      textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set( 0, 0, 0 );
      console.log({textMesh})
    })

    plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 64, 64), material);
    plane2 = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 64, 64), twoMaterial);
    scene.add(plane);
    scene.add(plane2);
    this.resize();
  }

  onClick = (e) => {
    if (e.target !== this.cont.children[0] && !e.target.classList.contains('title0') && !e.target.classList.contains('title2') ) return
    if (this.animating) return;
    this.animating = 1;
    this.counter = (this.counter + 1) % textures.length;
    this.counter2 = (this.counter + 1) % textures.length;
    const tl = new TimelineMax({});
    const x = (e.clientX - ww / 2) / (ww / 2);
    const y = (e.clientY - wh / 2) / (wh / 2);
    tl
        .to(twoMaterial.uniforms.click, 0, {value: {x, y}})
        .to(material.uniforms.click, 0, {value: {x, y}})
        .to(twoMaterial.uniforms.progress, 2, {value: 1, onComplete: () => {
            twoMaterial.uniforms.progress.value = 0;
            twoMaterial.uniforms.front.value = fronts[this.counter]
            twoMaterial.uniforms.nextFront.value = fronts[this.counter2]
            twoMaterial.uniforms.click.value = {x: -2, y: -2}
          }})
        .to(material.uniforms.progress, 2, {value: 1, onComplete: () => {
            material.uniforms.progress.value = 0;
            this.animating = 0;
            material.uniforms.img.value = textures[this.counter]
            material.uniforms.nextImg.value = textures[this.counter2]
            material.uniforms.click.value = {x: -2, y: -2}
          }}, 0)
    this.setState({currentText: this.text[this.counter]})
  };

  renderWGL = () => {
    material.uniforms.mouse.value.x += (destination.x - material.uniforms.mouse.value.x) * 0.05;
    material.uniforms.mouse.value.y += (destination.y - material.uniforms.mouse.value.y) * 0.05;
    twoMaterial.uniforms.mouse.value.y += (destination.y - twoMaterial.uniforms.mouse.value.y) * 0.05;
    twoMaterial.uniforms.mouse.value.x += (destination.x - twoMaterial.uniforms.mouse.value.x) * 0.05;

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

      camera.fov = 2 * (180 / Math.PI) * Math.atan(he / (2 * dist)) * 1.15
      material.uniforms.uvRate.value.y = h/w * y
      material.uniforms.uvRate.value.x = 1
      twoMaterial.uniforms.uvRate.value.y = h/w * y
      twoMaterial.uniforms.uvRate.value.x = 1
      plane.scale.x = w/h
      plane2.scale.x = w/h
    } else {
      camera.fov = 2 * (180 / Math.PI) * Math.atan(1 / (2 * dist)) * 1.15
      material.uniforms.uvRate.value.y = 1
      material.uniforms.uvRate.value.x = 0.5
      twoMaterial.uniforms.uvRate.value.y = 1
      twoMaterial.uniforms.uvRate.value.x = 0.5
      plane.scale.y = h/w;
      plane2.scale.y = h/w;
    }

    camera.updateProjectionMatrix();
  }

  animate = () => {
    this.time += 0.05;

    // console.log(material.uniforms.mouse.value)
    material.uniforms.time.value = this.time;
    twoMaterial.uniforms.time.value = this.time;
    requestAnimationFrame(this.animate);
    this.renderWGL();
  }

  onMousemove = (e) => {
    const x = (e.clientX - ww / 2) / (ww / 2);
    const y = (e.clientY - wh / 2) / (wh / 2);
    destination.x = y;
    destination.y = x;
  }


  // split = (text) => {
  //   text = text.split('')
  //   const newArr = []
  //   text.map((item, index) => newArr.push(<div key={index} className={`itemTitleHome ${text.join('')}`}>{item}</div>))
  //   console.log(newArr)
  //   return newArr
  // }

  render() {
    const {currentText} = this.state
    return (
        <div className='HomeBox'>
          <div className={`titleHome anim${this.text.indexOf(this.state.currentText)}`} ref={node => this.title = node}>
            {currentText}
            {/*<svg>*/}
              {/*<svg height="100" width="">*/}
                {/*<line x1="0" y1="0" x2="0" y2="200" style="stroke:rgb(255,0,0);stroke-width:2" />*/}
              {/*</svg>*/}
            {/*</svg>*/}
          </div>
          <div className="containerHome" ref={node => this.cont = node}/>
          <img src={front1} alt=""/>
          <img src={front2} alt=""/>
        </div>
    );
  }
}

export default Home;
