#version 100

#ifdef GL_ES
precision highp float;
#endif

// Input color coming from the Vertex Shader
varying vec4 color;
varying vec2 texCoord0;

uniform sampler2D sampler;

void main(void) {
  gl_FragColor = texture2D(sampler, texCoord0.xy);
}
