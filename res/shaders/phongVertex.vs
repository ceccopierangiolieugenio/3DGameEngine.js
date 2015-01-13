#version 100

// Input variable coming from "VertexAttribArray"
attribute vec3 position;
attribute vec2 texCoord;
attribute vec3 normal;

// Variable to be used in the Fragment Shader
varying vec2 texCoord0;
varying vec3 normal0;
varying vec3 worldPos0;

// "Global" Variable defined by glUniformXXX
uniform mat4 transform;
uniform mat4 transformProjected;

void main(void) {    
    gl_Position = transformProjected * vec4(position, 1.0);
    texCoord0 = texCoord;
    normal0 = (transform * vec4(normal, 0.0)).xyz;
    worldPos0 = (transform * vec4(position, 1.0)).xyz;
}
