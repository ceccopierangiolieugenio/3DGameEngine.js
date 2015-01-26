#version 100

attribute vec3 position;
attribute vec2 texCoord;
attribute vec3 normal;
// I need this to avoid an optimization issue
vec3 tmp = normal;

varying vec2 texCoord0;

uniform mat4 MVP;

void main()
{
    gl_Position = MVP * vec4(position, 1.0);
    texCoord0 = texCoord;   
}
