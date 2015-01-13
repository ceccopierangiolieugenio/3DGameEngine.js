#version 100

// Input variable coming from "VertexAttribArray"
attribute vec3 position;
attribute vec2 texCoord;
attribute vec3 normal;
// I need this to avoid an optimization issue
vec3 tmp = normal;

// Variable to be used in the Fragment Shader
varying vec2 texCoord0;

uniform mat4 transform;

void main(void) {    
    gl_Position = transform * vec4(position, 1.0);
    texCoord0 = texCoord;   
}
