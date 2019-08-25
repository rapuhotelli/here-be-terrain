precision highp float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

float nrand(vec2 uv) {
  return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 lightning() {
  float intensity = sin(time * .6)*.5 + .5;
  intensity = smoothstep(0.999, 0.9998, intensity) - step(0.9999, intensity);
  return vec3(intensity) * 0.25;
}

vec3 rain(vec2 uvOrig) {
  vec3 sum = vec3(0.0);

  float gridSize = 10.0;
  vec2 uv = fract((uvOrig + 0.5) * gridSize) - 0.5;
  vec2 gridPos = floor((uvOrig + 0.5) * gridSize);

  float rand = nrand(gridPos);
  float rand2 = nrand(gridPos * vec2(113.3, 11.4));
  float rand3 = sin(time + rand * 100.0) * 0.5 + 0.5;

  // exclude some drops periodically at random
  if (rand3 < 0.4) {
    return sum;
  }

  // de-sync drops on different grid positions
  float rainTime = time * 1.5 + nrand(gridPos * rand2);

  // position the drop at random-ish position
  vec2 dropPos = vec2(-0.5 / 1.5 + rand / 1.5, -0.5 / 1.5 + rand2 / 1.5);

  vec2 distV = uv - dropPos;
  float dist = length(distV);

  // -----------
  // rain streak
  // -----------
  float speedMult = 5.0;
  float movingX = mod(rainTime * speedMult, speedMult) - speedMult;

  if (abs(distV.x) < 0.002 * sqrt(gridSize)) {
    // base drop color
    vec3 drop = vec3(0.4);
    // keep only drop streak
    drop *= step(movingX, -distV.y) - step(movingX + 0.3, -distV.y);

    drop *= smoothstep(-0.7, 0.0, movingX);

    // stop it at center
    drop *= 1.0 - step(0.0, -distV.y);
    
    sum += drop;
  }

  // ------------
  // rain ripples
  // ------------
  float timingY = step(0.6, mod(rainTime - 0.3, 1.0)) - step(0.9, mod(rainTime - 0.3, 1.0));
  // circle diameter
  float diameter = 0.06 * mod(rainTime - 0.3, 1.0);
  // circle width
  float width = 0.001 * gridSize;
  if (dist < diameter + width && dist > diameter - width) {
    sum += vec3(0.15) * timingY;
  }

  return sum;
}

void main() {
	vec2 uv = outTexCoord - 0.5;
  uv.y *= -1.0;

  gl_FragColor = texture2D(uMainSampler, outTexCoord); 
  gl_FragColor.xyz += lightning();
  gl_FragColor.xyz += rain(uv);
}