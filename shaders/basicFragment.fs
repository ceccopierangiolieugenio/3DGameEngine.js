#version 100

#ifdef GL_ES
precision highp float;
#endif

// Input color coming from the Vertex Shader
varying vec4 color;

void main(void) {
  gl_FragColor = color;
}
