#version 100

#ifdef GL_ES
precision highp float;
#endif

// Input color coming from the Vertex Shader
varying vec2 texCoord0;

uniform vec3 baseColor;
uniform vec3 ambientLight;
uniform sampler2D sampler;

void main(void) {
    vec4 totalLight = vec4(ambientLight,1);
    vec4 color = vec4(baseColor, 1);
    vec4 textureColor = texture2D(sampler, texCoord0.xy);
    
    if(textureColor != vec4(0,0,0,0))
        color *= textureColor;
        
    gl_FragColor = color * totalLight;
}
