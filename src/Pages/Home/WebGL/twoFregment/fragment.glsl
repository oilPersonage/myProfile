uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec2 click;
uniform sampler2D front;
uniform sampler2D nextFront;
uniform float waveLength;
uniform float opacity;
uniform float progress;
varying vec2 vUv;
varying vec2 vUv1;
varying vec2 vUv2;
varying vec4 vPosition;
uniform vec2 uvRate;
uniform float vWave;

float circleF(float num){
        return (num*mod((progress)*3., 5.0));
}


void main(){
    //  vec2 st = gl_FragCoord.xy/vec2(resolution.x, resolution.y) + vec2(-mouse.y , mouse.x)*0.5;
    vec2 st = gl_FragCoord.xy/resolution.xy + (vec2(-click.x, click.y)*0.5);
    st.y *= resolution.y/resolution.x;
    st.y += 0.24;
    vec3 color = vec3(0.0);
    float d = 0.0;

    // Remap the space to -1. to 1.
    st = st *2.-1.;

    // Make the distance field
    d = length( abs(st) );

    // Visualize the distance field
    float visibility = step(0.1, progress);
//    vec4 circle = vec4(vec3( step(.3,d) * step(d,.4)),0.0) * visibility;

    vec4 circleOne = vec4(vec3( smoothstep(circleF(0.448),circleF(0.704),d)* smoothstep(circleF(0.592),circleF(0.476),d)) ,0.0);
    vec4 circleTwo = vec4(vec3( smoothstep(circleF(0.808),circleF(1.124),d)* smoothstep(circleF(1.292),circleF(0.7176),d)) ,0.0);

    float c = 0.;
    c /= 190.;
    c = 1.2 - sqrt( c );
    vec4 one = texture2D(front, vec2(vUv2.s + mouse.y * 0.005, vUv2.t - mouse.x * 0.005)) + ((circleOne + circleTwo)*visibility);
    vec4 two = texture2D(nextFront, vec2(vUv2.s + mouse.y * 0.005, vUv2.t - mouse.x * 0.005)) + ((circleOne + circleTwo)*visibility) ;

    float delay = smoothstep(circleF(0.808), circleF(0.484), d) * smoothstep(circleF(1.732), circleF(0.7176), d);
    vec4 finish = mix(one, two, delay);
    gl_FragColor = finish;
//    gl_FragColor = vec3(delay);
}








//void main()	{
////    float c = 0.;
//    float d = 0.0;
////    c /= 190.;
////    c = 1.2 - sqrt( c );
////    vec4 one = texture2D(front, vec2(vUv2.s + mouse.y * 0.005, vUv2.t - mouse.x * 0.005));
////    vec4 ct = one;
//
//    vec2 st = (vUv2.xy/vUv2.xy) + (mouse.xy);
//    st = st *1. - 0.5;
//    d = length( abs(st) );
////    vec4 circleOne = vec4(vec3( smoothstep(circle(0.448),circle(0.704),d)* smoothstep(circle(0.592),circle(0.476),d)) ,1.0);
////    vec4 circleTwo = vec4(vec3( smoothstep(circle(0.808),circle(1.124),d)* smoothstep(circle(0.992),circle(0.876),d)) ,1.0);
////    gl_FragColor = circleOne + circleTwo;
//    gl_FragColor = vec4(vec3( step(.3,d) * step(d,.4)),1.0);
////    gl_FragColor = vec4(vec2(st), 0., 1.0);
//
////    gl_FragColor = vec4(ct.rgb, one.a * 1.);
////    gl_FragColor = vec4(vUv2.s + x, vUv.t, vUv.s, one.a * 1.);
//}
