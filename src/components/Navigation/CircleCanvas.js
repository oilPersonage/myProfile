import React, {Component} from 'react';
import {TweenLite, Power2} from 'gsap';
import {connect} from 'react-redux';
import Prelin from '../../utils/perlin'

let time = 0
let points = 50;
let mouseMoveX = '';
let mouseMoveY = '';

class CircleCanvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      radius: 150,
      opacity: 0,
      style: {
        transform: `rotateY(${document.body.clientWidth / 2 / 200}deg) rotateX(${0}deg)`
      },
      show: this.props.menu.show,
    };
    this.animFadeIn = 0
  }

  componentDidMount() {
    const TimeO = setTimeout(()=> {
      requestAnimationFrame(this.updateCanvas);
      clearTimeout(TimeO)
    }, 400)
    document.querySelector('body').addEventListener('mousemove', this.mouseMove)
  }

  componentWillUnmount() {
    document.querySelector('body').removeEventListener('mousemove', this.mouseMove)
  }

  changeState = (number) => {
    const height = document.body.clientHeight / 2
    if (this.props.menu.show && this.props.menu.animation === false) {
      const radius = this.state.radius < height / 1.5 ? this.state.radius + number
          : height / 1.5;
      this.setState({
        radius,
        opacity: this.state.opacity > 1 ? 1 : this.state.opacity + 0.02
      })
    }
    if (this.props.menu.animation) {
      this.animFadeIn += 1
      const anim = {radius: this.state.radius, opacity: this.state.opacity}
      this.animFadeIn > 25 && TweenLite.to(anim, 0.6, {radius: 150, opacity: -0.3, onUpdate: ()=> {this.setState({radius: anim.radius, opacity: anim.opacity})}})
    }
  }

  updateCanvas = (time) => {
    // time = (time + 0.01)%1;
    const height = document.body.clientHeight / 2
    const width = document.body.clientWidth / 2
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      ctx.height = height;
      ctx.width = width;
      const number = 3
      ctx.clearRect(0, 0, width * 2, height * 2)
      this.changeState(number)

      points = points < 1500 ? this.state.radius * 1.5 : this.state.radius * 0.5


      let xl, yl;
      ctx.beginPath()
      ctx.lineWidth = 1;
      for (let p = 0; p < points; p++) {
        ctx.strokeStyle = `rgba(255,0,0,${this.state.opacity / 2})`
        let angel = p * 2 * Math.PI / points
        ctx.lineWidth = this.state.radius / 10 * Prelin(Math.sin(angel) * time / 10, time / 1000, 0);

        xl = width + this.state.radius * 1.08 * Math.sin(angel) + 50 * Prelin(Math.sin(angel), time / 1000, 0) - 50 / 2
        yl = height + this.state.radius * 1.08 * Math.cos(angel) + 50 * Prelin(Math.cos(angel), time / 1000, 1) - 50 / 2
        ctx.lineTo(xl, yl) // red
      }
      ctx.closePath()
      ctx.stroke()

      ctx.strokeStyle = `rgba(255,255,255,${this.state.opacity})`
      ctx.beginPath()

      let xw, yw;

      ctx.beginPath()
      ctx.fillStyle = `rgba(0,0,0,${this.state.radius < height / 1.5 ? this.state.opacity / 1.05 : 0.95})`
      for (let k = 0; k < points; k++) {
        let angel = k * 2 * Math.PI / points
        ctx.lineWidth = this.state.radius < height ? this.state.radius / 10 : this.state.radius < height / 2 ? this.state.radius / 25 : this.state.radius / 5 * Prelin(Math.sin(angel), time / 1000, 0) // bg
        xw = width + this.state.radius * Math.sin(angel) + 50 * Prelin(Math.sin(angel), time / 1000, 0) - 50 / 2
        yw = height + this.state.radius * Math.cos(angel) + 50 * Prelin(Math.cos(angel), time / 1000, 1) - 50 / 2
        ctx.lineTo(xw, yw) // white
      }
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      ctx.lineWidth = 1;
      let x1, y1;
      for (let i = 0; i < points; i++) {
        // const x = show ? this.state.radius*Math.sin(i/points *2* Math.PI) : -this.state.radius*Math.sin(i/points *2* Math.PI)
        // const y = show ? this.state.radius*Math.cos(i/points *2* Math.PI) : -this.state.radius*Math.cos(i/points *2* Math.PI)

        let angel = i * 2 * Math.PI / points
        x1 = width + this.state.radius * 1.12 * Math.sin(angel) + 50 * Prelin(Math.sin(angel), time / 1000, 0) - 50 / 2 + Math.sin(i / points * 2 * Math.PI)
        y1 = height + this.state.radius * 1.12 * Math.cos(angel) + 50 * Prelin(Math.cos(angel), time / 1000, 1) - 50 / 2 + Math.cos(i / points * 2 * Math.PI)
        ctx.beginPath()

        ctx.arc(
            x1,
            y1,
            0.1,
            0,
            2 * Math.PI
        )
        ctx.stroke()
        ctx.closePath()
      }
      this.state.radius !== 150 && requestAnimationFrame(this.updateCanvas)
    }
  }

  mouseMove = (e) => {
    let x = e.clientX;
    let y = e.clientY;
    const centrH = document.body.clientHeight / 2
    const centrW = document.body.clientWidth / 2

    if (x < centrW) {
      mouseMoveX = -1
    }

    if (y < centrH) {
      mouseMoveY = 1
    }

    if (y > centrH) {
      mouseMoveY = -1
    }
    let rotY = -(centrW - x) / 200
    let rotX = (centrH - y) / 200
    const style = {
      transform: `rotateY(${rotY}deg) rotateX(${rotX}deg)`
    }
    this.setState({
      style,
    })
  }

  render() {
    return (
        <div className="CanvasConteiner">
          <canvas ref={node => this.canvas = node} width={document.body.clientWidth} style={this.state.style}
                  height={document.body.clientHeight}/>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {menu: state.menu};
}

export default connect(mapStateToProps)(CircleCanvas);

// console.log(time / 1000)

// ctx.clearRect(0, 0, width, height)
// ctx.beginPath();
// ctx.strokeStyle = `rgba(255,255,255,${1}`;
// this.radius = this.radius + 5
// ctx.arc(width-75, height/2 , this.radius < width - 75 ? this.radius : width - 75, 0, 2*Math.PI, false);
// ctx.stroke()
// 0.104,0.204,0.492,1
