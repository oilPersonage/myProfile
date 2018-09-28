export default class Balls {
  constructor(x, y, radius, color) {
    this.x = x || 0;
    this.y = y || 0;
    this.origX = x || 0;
    this.origY = y || 0;
    this.vx = 0;
    this.vy = 0;
    this.frac = 0.95;
    this.spring = 0.01;
    this.radius = radius || 10;
    this.color = color || 0;
  }

  setPos = (x, y) => {
    this.x = x;
    this.y = y
  }

  think = (mouse) => {
    let dx = this.x - mouse.x
    let dy = this.y - mouse.y
    let dist = Math.sqrt(dx*dx + dy*dy)
    if (dist < 20) {
      let angle = Math.atan2(dy, dx)
      let tx = mouse.x + Math.cos(angle) * 20
      let ty = mouse.y + Math.sin(angle) * 20

      this.vx += tx - this.x;
      this.vy += ty - this.y;
    }

    // spring
    let dx1 = this.x - this.origX
    let dy1 = this.y - this.origY

    this.vx -= dx1 * this.spring
    this.vy -= dy1 * this.spring
    //fact
    this.vx *= this.frac
    this.vy *= this.frac
    //active move
    this.x += this.vx
    this.y += this.vy
  }

  draw = (ctx) => {
    ctx.save();
    ctx.beginPath();
    //
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);


    if (this.color) {
      ctx.lineWidth = 2;
      ctx.fillStyle = `rgba(255, 255, 255, ${this.color})`;
      ctx.stroke();
    } else {
      const gradient = ctx.createRadialGradient(this.x, this.y, 2 * (this.radius / 6), this.x, this.y, 6 * (this.radius / 6));
      gradient.addColorStop(0, `rgba(255,255,255,${this.radius / 6}`);
      // gradient.addColorStop(0.7, 'rgba(0,0,120,0.2');
      gradient.addColorStop(0.8, `rgba(0,0,255,${1 - this.radius / 3}`);
      gradient.addColorStop(1, `rgba(0,0,0,1`);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    ctx.closePath();
    ctx.restore();
  };
}
