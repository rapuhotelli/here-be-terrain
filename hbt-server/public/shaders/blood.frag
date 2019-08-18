// Found this on GLSL sandbox. I really liked it, changed a few things and made it tileable.
// :)
// by David Hoskins.


// Water turbulence effect by joltz0r 2013-07-04, improved 2013-07-07

#ifdef GL_ES
precision mediump float;
#endif

#define SUPPORT_GLSL_CANVAS
#define TAU 6.28318530718
#define MAX_ITER 20

uniform vec2      resolution;
uniform float     time;

# ifdef SUPPORT_GLSL_CANVAS
uniform vec2 u_resolution;
uniform float u_time;
# endif

void main(void)
{
    # ifdef SUPPORT_GLSL_CANVAS
    vec2 resolution = max(resolution, u_resolution);
    float time = max(time, u_time);
    # endif

    float ptime = time * .05+23.0;
    // uv should be the 0-1 uv of texture...
    vec2 uv = gl_FragCoord.xy / resolution; // iResolution.xy;
    
    vec2 p = mod(uv*TAU, TAU)-250.0;

    vec2 i = vec2(p);
    float c = 1.0;
    float inten = .005;

    for (int n = 0; n < MAX_ITER; n++) 
    {
        float t = ptime * (1.0 - (3.5 / float(n+1)));
        i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
        c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
    }
    c /= float(MAX_ITER);
    c -= 1.2;
    vec3 colour = vec3(pow(abs(c), 12.0));
    colour = clamp(vec3(0.3, 0.0, 0.05) - colour*0.3, 0.0, 1.0);
    
    gl_FragColor = vec4(colour, 1.0);
}
