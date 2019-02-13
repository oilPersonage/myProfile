uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec2 click;
uniform float progress;
uniform sampler2D img;
uniform sampler2D nextImg;
uniform float waveLength;
uniform float opacity;
uniform float ratio;
varying vec2 vUv;
varying vec2 vUv1;
varying vec2 vUv2;
varying vec4 vPosition;
uniform float vWave;

float circleF(float num){
        return (num*mod((progress)*3., 300.0));
}

void main()	{
	vec2 p = 10.68*(gl_FragCoord.xy/resolution.xy - vec2(0.5,1.0)) - vec2(mouse.x,-15);
	vec2 i = p;
	float c = 0.;

    for(int n = 0; n<4; n++) {
        float t = ( 1.0 - ( 8.0 / float( n + 10 ) ) ) * time*0.3;
        float ix = i.x + mouse.x;
        float iy = i.y + mouse.y;
        i = vec2( cos( t - ix ) + sin( t + iy ), sin( t - iy ) + cos( t + ix ) ) + p;
        c += float( n ) / length( vec2( p.x / ( sin( t + i.x ) / 1.1 ), p.y / ( cos( t + i.y ) / 1.1 ) ) ) * 20.0;
    }

    c /= 110.;
    c = 1.8 - sqrt( c );

    // images
    vec4 tx = texture2D( img, vec2(vUv.s, vUv.t)) *
    texture2D( img, vec2( vUv.s + cos(c) * mouse.x * 0.2, vUv.t + cos(c) * mouse.y * 0.2 ) )
    * 0.25 ;
    vec4 txTwo = texture2D( nextImg, vec2(vUv.s, vUv.t)) *
                     texture2D( nextImg, vec2( vUv.s + cos(c) * mouse.x * 0.2, vUv.t + cos(c) * mouse.y * 0.2 ) )
                     * 0.25 ;

    vec4 newTxTwo = vec4(txTwo.rgb, txTwo.a * ratio);
    vec4 newTx = vec4(tx.rgb, tx.a * ratio);
    vec4 ctTwo = c * c * c * c * newTxTwo;
    vec4 ct = c * c * c * c * newTx;

    /// circle
    vec2 st = gl_FragCoord.xy/resolution.xy + (vec2(-click.x, click.y)*0.5);
    st.y *= resolution.y/resolution.x;
    st.y += 0.24;
    float d = 0.0;

    // Remap the space to -1. to 1.
    st = st *2.-1.;
    // Make the distance field
    d = length( abs(st) );

    // Visualize the distance field
    float visibility = step(0.1, progress);

    vec4 circleOne = vec4(vec3( smoothstep(circleF(0.448), circleF(0.704), d) * smoothstep(circleF(0.592), circleF(0.476), d)) ,0.0);
    vec4 circleTwo = vec4(vec3( smoothstep(circleF(0.808), circleF(1.124), d) * smoothstep(circleF(1.292), circleF(0.7176), d)) ,0.0);

    vec4 circleFirstImg = (ct - newTx * newTx - vec4( txTwo.rgb * 0.5, txTwo.a * vPosition.z ))*ratio + ((circleOne + circleTwo)*visibility);
    vec4 circleTwoImg = (ctTwo - newTxTwo * newTxTwo - vec4( txTwo.rgb * 0.5, txTwo.a * vPosition.z ))*ratio + ((circleOne + circleTwo)*visibility);

    float delay = smoothstep(circleF(0.808), circleF(0.484), d) * smoothstep(circleF(1.732), circleF(0.7176), d);
    delay = clamp(delay, 0.1, 1.);
    vec4 finish = mix(circleFirstImg, circleTwoImg, delay);
    gl_FragColor = finish;
}
