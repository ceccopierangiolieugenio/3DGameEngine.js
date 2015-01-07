#version 100

#ifdef GL_ES
precision highp float;
#endif

const int MAX_POINT_LIGHTS = 4;
const int MAX_SPOT_LIGHTS = 4;

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
    // The position is here because of a (glsl compilation?) issue I have with Chrome
    vec3 position;
    BaseLight base;
    Attenuation atten;
    // vec3 position;
    float range;
};

struct SpotLight
{
    PointLight pointLight;
    vec3 direction;
    float cutoff;
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

//     uniform SpotLight spotLights[MAX_SPOT_LIGHTS];
// The array is divided in 4 different variables:
   uniform SpotLight spotLights0;
   uniform SpotLight spotLights1;
   uniform SpotLight spotLights2;
   uniform SpotLight spotLights3;

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
    if(distanceToPoint > pointLight.range)
        return vec4(0,0,0,0);
    lightDirection = normalize(lightDirection);
    
    vec4 color = calcLight(pointLight.base, lightDirection, normal);
    
    float attenuation = pointLight.atten.constant +
                         pointLight.atten.linear * distanceToPoint +
                         pointLight.atten.exponent * distanceToPoint * distanceToPoint +
                         0.0001;
                         
    return color / attenuation;
}

vec4 calcSpotLight(SpotLight spotLight, vec3 normal)
{
    vec3 lightDirection = normalize(worldPos0 - spotLight.pointLight.position);
    float spotFactor = dot(lightDirection, spotLight.direction);
    
    vec4 color = vec4(0,0,0,0);
    
    if(spotFactor > spotLight.cutoff)
    {
        color = calcPointLight(spotLight.pointLight, normal) *
                (1.0 - (1.0 - spotFactor)/(1.0 - spotLight.cutoff));
    }
    
    return color;
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
    //        if(pointLights[i].base.intensity > 0.0)
    //            totalLight += calcPointLight(pointLights[i], normal);
    // The array is divided in 4 different variables:
        if(pointLights0.base.intensity > 0.0)
            totalLight += calcPointLight(pointLights0, normal);
        if(pointLights1.base.intensity > 0.0)
            totalLight += calcPointLight(pointLights1, normal);
        if(pointLights2.base.intensity > 0.0)
            totalLight += calcPointLight(pointLights2, normal);
        if(pointLights3.base.intensity > 0.0)
            totalLight += calcPointLight(pointLights3, normal);

    // This "Hack" is due to an issue I'm having using Firefox + Uniform Array of Structs corruption
    //    for(int i = 0; i < MAX_SPOT_LIGHTS; i++)
    //        if(spotLights[i].pointLight.base.intensity > 0.0)
    //            totalLight += calcSpotLight(spotLights[i], normal);
    // The array is divided in 4 different variables:
        if(spotLights0.pointLight.base.intensity > 0.0)
            totalLight += calcSpotLight(spotLights0, normal);
        if(spotLights1.pointLight.base.intensity > 0.0)
            totalLight += calcSpotLight(spotLights1, normal);
        if(spotLights2.pointLight.base.intensity > 0.0)
            totalLight += calcSpotLight(spotLights2, normal);
        if(spotLights3.pointLight.base.intensity > 0.0)
            totalLight += calcSpotLight(spotLights3, normal);

    gl_FragColor = color * totalLight;
}

