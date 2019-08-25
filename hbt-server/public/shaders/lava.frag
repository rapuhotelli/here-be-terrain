precision highp float;

uniform float time;
uniform vec2 resolution;
uniform float zoomLevel;

// Simplex noise function from: https://github.com/ashima/webgl-noise

#define NOISE_SIMPLEX_1_DIV_289 0.00346020761245674740484429065744
float mod289(float x) {
	return x - floor(x * NOISE_SIMPLEX_1_DIV_289) * 289.0;
}

vec2 mod289(vec2 x) {
	return x - floor(x * NOISE_SIMPLEX_1_DIV_289) * 289.0;
}

vec3 mod289(vec3 x) {
	return x - floor(x * NOISE_SIMPLEX_1_DIV_289) * 289.0;
}

float permute(float x) {
	return mod289(x*x*34.0 + x);
}

vec3 permute(vec3 x) {
	return mod289(
		x*x*34.0 + x
	);
}

float snoise(vec2 v)
{
	const vec4 C = vec4(
		0.211324865405187, // (3.0-sqrt(3.0))/6.0
		0.366025403784439, // 0.5*(sqrt(3.0)-1.0)
	 -0.577350269189626, // -1.0 + 2.0 * C.x
		0.024390243902439  // 1.0 / 41.0
	);
	
	vec2 i = floor( v + dot(v, C.yy) );
	vec2 x0 = v - i + dot(i, C.xx);

	vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
	vec4 x12 = x0.xyxy + C.xxzz;
	x12.xy -= i1;
	
	i = mod289(i); // Avoid truncation effects in permutation
	vec3 p = permute(
		permute(
				i.y + vec3(0.0, i1.y, 1.0 )
		) + i.x + vec3(0.0, i1.x, 1.0 )
	);
	
	vec3 m = max(
		0.5 - vec3(
			dot(x0, x0),
			dot(x12.xy, x12.xy),
			dot(x12.zw, x12.zw)
		),
		0.0
	);
	m = m*m ;
	m = m*m ;
	
	vec3 x = 2.0 * fract(p * C.www) - 1.0;
	vec3 h = abs(x) - 0.5;
	vec3 ox = floor(x + 0.5);
	vec3 a0 = x - ox;

	m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

	vec3 g;
	g.x = a0.x * x0.x + h.x * x0.y;
	g.yz = a0.yz * x12.xz + h.yz * x12.yw;
	return 130.0 * dot(m, g);
}

vec3 add_saturation(vec3 rgb, float adjustment) {
  const vec3 lumCoeff = vec3(0.2125, 0.7154, 0.0721);
  vec3 intensity = vec3(dot(rgb, lumCoeff));
  return mix(intensity, rgb, adjustment);
}

void main() {
	vec2 uv = gl_FragCoord.xy / resolution; // iResolution.xy;

  float zoom = zoomLevel > 0.0 ? zoomLevel : 4.0;
  float timeDilation = 20.0;

  float lavaPart1 = (snoise(uv * 40.0 / zoom + time / timeDilation) + 1.0) / 2.0;
  float lavaPart2 = (snoise(uv * 40.0 / zoom - (time + 40.0) / timeDilation) + 1.0) / 2.0;

  float lava = mix(lavaPart1, lavaPart2, 0.5);
  lava += 0.1;

  float lava2 = lava * lava;
  float lava3 = lava2 * lava;
  float lava6 = lava3 * lava3;

  vec3 color = vec3(lava2, lava6 * 0.7, 0.0);
  color = add_saturation(color, 1.5);

  gl_FragColor = vec4(color, 1.0);
}