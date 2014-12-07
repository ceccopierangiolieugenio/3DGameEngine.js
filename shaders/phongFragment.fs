#version 100

#ifdef GL_ES
precision highp float;
#endif

// Input color coming from the Vertex Shader
varying vec2 texCoord0;
varying vec3 normal0;
varying vec3 worldPos0;

struct BaseLight
{
    vec3 color;
    float intensity;
};

struct DirectionalLight
{
    BaseLight base;
    vec3 direction;
};

uniform vec3 baseColor;
uniform vec3 eyePos;
uniform vec3 ambientLight;
uniform sampler2D sampler;
 
uniform float specularIntensity;
uniform float specularPower;

uniform DirectionalLight directionalLight;

vec4 calcLight(BaseLight base, vec3 direction, vec3 normal)
{
    float diffuseFactor = dot(normal, -direction);
    
    vec4 diffuseColor = vec4(0,0,0,0);
    vec4 specularColor = vec4(0,0,0,0);
    
    if(diffuseFactor > 0.0)
    {
        diffuseColor = vec4(base.color, 1.0) * base.intensity * diffuseFactor;
        
        vec3 directionToEye = normalize(eyePos - worldPos0);
        vec3 reflectDirection = normalize(reflect(direction, normal));
        
        float specularFactor = dot(directionToEye, reflectDirection);
                
        if(specularFactor > 0.0)
        {
            specularFactor = pow(specularFactor, specularPower);
            specularColor = vec4(base.color, 1.0) * specularIntensity * specularFactor;
        }
    }
    
    return diffuseColor + specularColor;
}

vec4 calcDirectionalLight(DirectionalLight directionalLight, vec3 normal)
{
    return calcLight(directionalLight.base, -directionalLight.direction, normal);
}

void main(void) {
    vec4 totalLight = vec4(ambientLight,1);
    vec4 color = vec4(baseColor, 1);
    vec4 textureColor = texture2D(sampler, texCoord0.xy);
    
    if(textureColor != vec4(0,0,0,0))
        color *= textureColor;

    vec3 normal = normalize(normal0);

    totalLight += calcDirectionalLight(directionalLight, normal);

    gl_FragColor = color * totalLight;
}
