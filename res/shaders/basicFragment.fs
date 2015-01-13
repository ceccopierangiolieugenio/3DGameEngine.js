#version 100

#ifdef GL_ES
precision highp float;
#endif

// Input color coming from the Vertex Shader
varying vec2 texCoord0;

uniform vec3 color;
uniform sampler2D sampler;

void main(void) {
    vec4 textureColor = texture2D(sampler, texCoord0.xy);

    if(textureColor == vec4(0,0,0,0))
        gl_FragColor = vec4(color, 1);
    else
        gl_FragColor = textureColor * vec4(color, 1);
}
