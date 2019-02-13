uniform float time;
uniform float waveLength;
uniform vec2 mouse;
uniform float progress;
varying vec2 vUv;
varying vec2 vUv1;
varying vec2 vUv2;
uniform vec2 resolution;
uniform vec2 uvRate;
varying vec4 vPosition;

float plot(float x, float pct){
  return  smoothstep( pct-0.5, pct, x) -
          smoothstep( pct, pct+0.4, x);
}

void main() {

    vUv = uv;
    vec2 _uv = vUv - 0.5;
    vUv1 = _uv;
    vUv1 *= vec2(uvRate.x, uvRate.y);
    vUv1 += 0.5;

    vUv2 = _uv;
    vUv2 *= vec2(uvRate.x, uvRate.y);
    vUv2 += 0.5;
    vUv2 = vec2(vUv2.x + 0.0025, vUv2.y);
    vUv2 = vec2(vUv2.x + mouse.y*0.0045, vUv2.y);


    vec2 st = gl_Position.xy/resolution;
    float prog = 0.;
//    if ((position.x + 0.5 < progress + 0.05) && (position.x + 0.5 > progress - 0.05)) {
//        prog = plot(position.x +0.5, progress)-0.95;
//        prog = 1.;
//    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x, position.y, 0., 1.0 );
}
