uniform float time;
uniform float waveLength;
uniform vec2 mouse;
uniform float progress;
varying vec2 vUv;
varying vec2 vUv1;
varying vec2 vUv2;
varying vec2 click;
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

    float dur = mouse.y - 0.5; // -0.5 do 0.5
    float step = mouse.y * 0.2; // 0 do 1
    float move = (dur - vUv2.x + step) * 0.001;
    vUv2 = vec2(vUv2.x + move, vUv2.y);
    vUv2 = vec2(vUv2.x + 0.0025, vUv2.y);
    vUv2 += 0.5;

//    vUv2 = vec2(vUv2.x + mouse.y*0.0045, vUv2.y);

//    vec2 st = gl_Position.xy/resolution;
//    float prog = 0.;
//    if ((position.x + 0.5 < progress + 0.05) && (position.x + 0.5 > progress - 0.05)) {
//        prog = plot(position.x +0.5, progress)-0.95;
////        prog = 1.;
//    }


    vec3 transformed = vec3(vUv2, 0.);
    float dx = vUv2.x;
    float dy = vUv2.y;
    float freq = sqrt(dx*dx + dy*dy);
    float amp = 0.005;
    float angle = -time*2.0+freq*40.0;
    transformed.z += sin(angle)*amp;
//    float wave = transformed.z * (500 - click.x)


//    gl_Position = projectionMatrix * viewMatrix * modelMatrix  * vec4( vUv2.x, vUv2.y, 0.01 + transformed.z, 1.0 );
    gl_Position = projectionMatrix * viewMatrix * modelMatrix  * vec4( position.x, position.y, 0.0, 1.0 );
}
