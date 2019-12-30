precision mediump float;

uniform vec2 resolution;
uniform float time;

vec2 hash(vec2 x) {
  const vec2 k = vec2( 0.3183099, 0.3678794 );
  x = x*k + k.yx;
  return -1.0 + 2.0*fract( 16.0 * k*fract( x.x*x.y*(x.x+x.y)) );
}

float noise(vec2 p) {
  vec2 i = floor( p );
  vec2 f = fract( p );

	vec2 u = f*f*(3.0-2.0*f);

  return mix( mix( dot( hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                   dot( hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
              mix( dot( hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                   dot( hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

float smoke(vec2 uv) {
    float total = 0.;
    float amplitude = 1.;
    float freq = 1.;

    for(float i=0.; i<3.; i += 1.) {
        total += noise(uv*freq) * amplitude;
        amplitude /= 2.;
    	freq *= 2.;
    }
    total /= 2.;
    return total;
}

void main() {
  // Normalized pixel coordinates (from 0 to 1)
  vec2 uv = (gl_FragCoord.xy-0.5*resolution.xy)/resolution.y;
  uv /= 3.;

  // After a long time the effect breaks, so temp fix by moving time between -120 and 120
  // Causes a slowdown->stop->reversal so prolly a better fix can be found
  float time = sin(time / 120.) * 120.;

	float smoke1 = smoke(uv*13. + vec2(-time*0.1, time*0.4));
  float smoke2 = smoke(uv*21. + vec2(time*0.4, -time*0.3));
  vec3 col = vec3(mix(smoke1, smoke2, .5));
  col = .5 + .5*col;
  col *= .3;

  // Output to screen
  gl_FragColor = vec4(col,1.0);
}
