
precision mediump float;

uniform vec2 resolution;
uniform float time;

float polygonDistance(vec2 p,float radius,float angleOffset,int sideCount){
  float a=atan(p.x,p.y)+angleOffset;
  float b=6.28319/float(sideCount);
  return cos(floor(.5+a/b)*b-a)*length(p)-radius;
}

// from https://www.shadertoy.com/view/4djSRW
#define HASHSCALE1 443.8975
float hash11(float p)// assumes p in ~0-1 range
{
  vec3 p3=fract(vec3(p)*HASHSCALE1);
  p3+=dot(p3,p3.yzx+19.19);
  return fract((p3.x+p3.y)*p3.z);
}

#define HASHSCALE3 vec3(.1031,.1030,.0973)
vec2 hash21(float p)// assumes p in larger integer range
{
  vec3 p3=fract(vec3(p)*HASHSCALE3);
  p3+=dot(p3,p3.yzx+19.19);
  return fract(vec2((p3.x+p3.y)*p3.z,(p3.x+p3.z)*p3.y));
}

void main(void)
{
  vec2 uv=vec2(.5)-(gl_FragCoord.xy/resolution.xy);
  uv.x*=resolution.x/resolution.y;
  
  float accum=0.;
  for(int i=0;i<83;i++){
    float fi=float(i);
    float thisYOffset=mod(hash11(fi*.017)*(time+19.)*.2,4.)-2.;
    vec2 center=(hash21(fi)*2.-1.)*vec2(1.1,1.)-vec2(0.,thisYOffset);
    float radius=.5;
    vec2 offset=uv-center;
    float twistFactor=(hash11(fi*.0347)*2.-1.)*1.9;
    float rotation=.1+time*.2+sin(time*.1)*.9+(length(offset)/radius)*twistFactor;
    accum+=pow(smoothstep(radius,0.,polygonDistance(uv-center,.1+hash11(fi*2.3)*.2,rotation,5)+.1),3.);
  }
  
  vec3 subColor=vec3(.4,.8,.2);//vec3(0.4, 0.2, 0.8);
  vec3 addColor=vec3(.3,.2,.1);//vec3(0.3, 0.1, 0.2);
  
  gl_FragColor=vec4(vec3(1.)-accum*subColor+addColor,.1);
}