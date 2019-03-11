import React, {Component} from 'react';
import {connect} from 'react-redux';
import SimplexNoise from 'simplex-noise'
import Mouse from './mouse'
import Ball from './balls'
import logo from '../../../images/KateLogo.svg'
const lines = []


class CircleCanvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      radius: 200,
      points: 150,
      lineNumbers: 3,
      width: document.body.clientWidth / 2,
      height: document.body.clientHeight / 2,
      style: {
        // transform: `rotateY(${width / 200}deg) rotateX(${0}deg)`
      },
      balls: [],
      show: this.props.menu.show,
    };
    this.inX = 0;
    this.inY = 0;
    this.time = 0;
    this.mouseX=0;
    this.mouseY=0;
    this.inercX = 0;
    this.inercY = 0;

    this.logo = new Image()
    this.logo.src = logo
  }

  componentWillReceiveProps() {
    if (!this.props.animation) this.setState({opacity: 0})
  }

  componentDidMount() {
    this.mouse = new Ball(0,0, 20, 1)
    this.simplex = new SimplexNoise()
    this.pos = new Mouse(this.canvas)
    const TimeO = setTimeout(()=> {
      requestAnimationFrame(this.raf);
      clearTimeout(TimeO)
    }, 400)
    const balls = []
    for (let k = 0; k < this.state.points * 1.5; k++) {
      balls.push(
          new Ball(
            Math.random()*document.documentElement.clientWidth,
            Math.random()*document.documentElement.clientHeight,
            Math.random()*6
          )
      )
    }

    for (let i =0; i <= this.state.lineNumbers; i++) {
      lines[i] = []
      for(let j = 0; j <= this.state.points; j++) {
        let point = {
          x: Math.cos(j/this.state.points * Math.PI*2),
          y: Math.sin(j/this.state.points * Math.PI*2),
          width: 4,
        }
        point._x = point.x;
        point._y = point.y;
        lines[i].push(point)
      }
      this.setState({opacity: 1, balls})
    }

    document.querySelector('body').addEventListener('mousemove', this.mouseMove)
  }

  componentWillUnmount() {
    document.querySelector('body').removeEventListener('mousemove', this.mouseMove)
  }

  updateCanvas = () => {
    const { radius, width, height} = this.state
    this.inercX  += 0.05*(this.mouseX/width - this.inercX)
    this.inercY  += 0.05*(this.mouseY/height - this.inercY)
    for (let i =0; i < this.state.lineNumbers; i++) {
      for (let j = 0; j <= this.state.points; j++) {
        const noise = this.simplex.noise2D(lines[i][j]._x/2 + this.time*0.003 , lines[i][j]._y/2 + this.time*0.003 )
        lines[i][j].x = lines[i][j]._x * radius * (1 - i/10) + noise * (radius /  20)
        lines[i][j].y = lines[i][j]._y * radius * (1 - i/10) + noise * (radius /  20)

        lines[i][j].x = lines[i][j].x + this.inercX * radius*i/20
        lines[i][j].y = lines[i][j].y + this.inercY * radius*i/20

        this.koef = lines[i][j].x * this.inercX + lines[i][j].y * this.inercY

        lines[i][j].width = 10 - 6 * this.koef/200
      }
    }
  }

  renderCanvas = () => {
    const {width, height, points, radius} = this.state
    this.ctx = this.canvas.getContext('2d')
    this.ctx.clearRect(0, 0, width * 2, height * 2)
    this.ctx.fillStyle = "rgba(0,0,0,.98)"


    this.inX += 0.1 * (this.pos.x - this.inX)
    this.inY += 0.1 * (this.pos.y - this.inY)

    this.mouse.setPos(this.pos.x, this.pos.y, 20, 1)
    this.mouse.draw(this.ctx, this.time, true)
    this.state.balls.forEach(ball => {
      ball.think(this.pos, this.inX, this.inY)
      ball.draw(this.ctx, this.time, false, this.pos)
    })
    for (let i =0; i < this.state.lineNumbers; i++) {
      this.ctx.strokeStyle = i === this.state.lineNumbers - 1
          ? `rgb(255,255,255)`
          : `hsl(${100*(i/this.state.lineNumbers * 6)},100%,40%)`
      for (let j = 1; j <= this.state.points; j++) {
        this.ctx.beginPath()
        this.ctx.lineWidth = lines[i][j].width < 1 ? 1 : lines[i][j].width
        this.ctx.moveTo(width + lines[i][j - 1].x, height + lines[i][j - 1].y)
        this.ctx.lineTo(width + lines[i][j].x, height + lines[i][j].y)
        this.ctx.closePath()
        this.ctx.stroke()
      }

      if (i === this.state.lineNumbers - 1) {
        this.ctx.beginPath()
        for (let k = 0; k < points; k++) {
          this.ctx.lineTo(width + lines[i][k].x, height + lines[i][k].y) // white
        }
        this.ctx.closePath()
        this.ctx.fill()
        // this.ctx.stroke()
      }
    }
    this.ctx.drawImage(this.logo, window.innerWidth / 2 - 75 + this.inercX * 20, window.innerHeight / 2 - 60 + this.inercY * 20 , 150, 120);
    // this.ctx.fillText("SPACE" )
  }

  raf = () => {
    this.time = this.time + 1;
    this.renderCanvas()
    this.updateCanvas()
    requestAnimationFrame(this.raf)
  }

  mouseMove = (e) => {
    this.mouseX = e.clientX - this.state.width
    this.mouseY = e.clientY - this.state.height
  }

  render() {
    // style={{opacity: this.state.opacity, transition: "opacity 1s ease 0.2s"}}
    return (
        <div className="CanvasConteiner">
          <canvas ref={node => this.canvas = node} width={document.documentElement.clientWidth} style={this.state.style}
                  height={document.documentElement.clientHeight}/>
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
