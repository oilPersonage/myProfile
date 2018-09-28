uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform sampler2D img;
uniform sampler2D front;
uniform sampler2D map;
uniform float waveLength;
uniform float opacity;
uniform float ratio;
varying vec2 vUv;
varying vec2 vUv1;
varying vec2 vUv2;
varying vec4 vPosition;
uniform float vWave;

void main()	{
	vec2 p = 10.68*(gl_FragCoord.xy/resolution.xy - vec2(0.5,1.0)) - vec2(mouse.x,-15);
	vec2 i = p;
    float map = texture2D(map, vec2(vUv2)).r;
    vec4 fr = texture2D(front, vec2(vUv2));
	float c = 0.;
    for(int n = 0; n<4; n++){
        float t = ( 1.0 - ( 8.0 / float( n + 10 ) ) ) * time*0.3;
        float ix = i.x + mouse.x;
        float iy = i.y + mouse.y;
        i = vec2( cos( t - ix ) *map + sin( t + iy ) *map, sin( t - iy ) *map + cos( t + ix ) *map ) + p;
        c += float( n ) / length( vec2( p.x / ( sin( t + i.x ) / 1.1 ), p.y / ( cos( t + i.y ) / 1.1 ) ) ) * 40.0;
    }

    c /= 190.;
    c = 1.8 - sqrt( c );
    vec4 tx = texture2D( img, vec2(vUv.s, vUv.t)) *
    texture2D( img, vec2( vUv.s + cos(c) * mouse.x * 0.2, vUv.t + cos(c) * mouse.y * 0.2 ) )
    * 0.25 * map;
    vec4 newTx = vec4(tx.rgb, tx.a * ratio);
    vec4 ct = c * c * c * newTx;
    gl_FragColor = texture2D( img, vec2( vUv.s + c*mouse.x * 0.75, vUv.t +  c*mouse.y * 0.75 ) );
    gl_FragColor = (ct - newTx * newTx - vec4( tx.rgb * 0.5, tx.a * vPosition.z ))*ratio+vec4(fr.rgb-fr.rgb*0.5, fr.a = 1.);
//    gl_FragColor = fr;
}
