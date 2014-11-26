#version 100

// Input variable coming from "VertexAttribArray"
attribute vec3 position;

// Variable to be used in the Fragment Shader
varying vec4 color;
uniform float uniformFloat;

void main(void) {
    color = vec4(clamp(position, 0.0, uniformFloat), 1.0);
    gl_Position = vec4(position, 1.0);
}
