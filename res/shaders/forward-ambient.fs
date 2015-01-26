#version 100

#ifdef GL_ES
precision highp float;
#endif

varying vec2 texCoord0;

uniform vec3 ambientIntensity;
uniform sampler2D sampler;

void main() 
{
    gl_FragColor = texture2D(sampler, texCoord0.xy) * vec4(ambientIntensity, 1);
}
