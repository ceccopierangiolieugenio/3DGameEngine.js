#version 100

#ifdef GL_ES
precision highp float;
#endif

const int MAX_POINT_LIGHTS = 4;

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

struct Attenuation
{
    float constant;
    float linear;
    float exponent;
};

struct PointLight
{
    BaseLight base;
    Attenuation atten;
    vec3 position;
};

uniform vec3 baseColor;
uniform vec3 eyePos;
uniform vec3 ambientLight;
uniform sampler2D sampler;
 
uniform float specularIntensity;
uniform float specularPower;

uniform DirectionalLight directionalLight;
// This "Hack" is due to an issue I'm having using Firefox + Uniform Array of Structs corruption
//     uniform PointLight pointLights[MAX_POINT_LIGHTS];
// The array is divided in 4 different variables:
   uniform PointLight pointLights0;
   uniform PointLight pointLights1;
   uniform PointLight pointLights2;
   uniform PointLight pointLights3;


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

vec4 calcPointLight(PointLight pointLight, vec3 normal)
{
    vec3 lightDirection = worldPos0 - pointLight.position;
    float distanceToPoint = length(lightDirection);
    lightDirection = normalize(lightDirection);
    
    vec4 color = calcLight(pointLight.base, lightDirection, normal);
    
    float attenuation = pointLight.atten.constant +
                         pointLight.atten.linear * distanceToPoint +
                         pointLight.atten.exponent * distanceToPoint * distanceToPoint +
                         0.0001;
                         
    return color / attenuation;
}

void main(void) {
    vec4 totalLight = vec4(ambientLight,1);
    vec4 color = vec4(baseColor, 1);
    vec4 textureColor = texture2D(sampler, texCoord0.xy);
    
    if(textureColor != vec4(0,0,0,0))
        color *= textureColor;

    vec3 normal = normalize(normal0);

    totalLight += calcDirectionalLight(directionalLight, normal);

    // This "Hack" is due to an issue I'm having using Firefox + Uniform Array of Structs corruption
    //    for(int i = 0; i < MAX_POINT_LIGHTS; i++)
    //        totalLight += calcPointLight(pointLights[i], normal);
    // The array is divided in 4 different variables:
          totalLight += calcPointLight(pointLights0, normal);
          totalLight += calcPointLight(pointLights1, normal);    
          totalLight += calcPointLight(pointLights2, normal);    
          totalLight += calcPointLight(pointLights3, normal);    

    gl_FragColor = color * totalLight;
}

