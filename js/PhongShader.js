/* 
 * Copyright 2014 Eugenio Parodi <ceccopierangiolieugenio at googlemail>.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";

function PhongShader()
{
    Shader.apply(this, arguments);

    PhongShader.MAX_POINT_LIGHTS = PhongShader.MAX_POINT_LIGHTS || 4;
    PhongShader.ambientLight = PhongShader.ambientLight || new Vector3f(0.1, 0.1, 0.1);
    PhongShader.directionalLight = PhongShader.directionalLight || new DirectionalLight(new BaseLight(new Vector3f(0, 0, 0), 0), new Vector3f(0, 0, 0));
    PhongShader.pointLights = PhongShader.pointLights || [];

    this.addVertexShader(ResourceLoader.loadShader("phongVertex.vs"));
    this.addFragmentShader(ResourceLoader.loadShader("phongFragment.fs"));
    this.compileShader();

    this.addUniform("transform");
    this.addUniform("transformProjected");
    this.addUniform("baseColor");
    this.addUniform("ambientLight");

    this.addUniform("specularIntensity");
    this.addUniform("specularPower");
    this.addUniform("eyePos");

    this.addUniform("directionalLight.base.color");
    this.addUniform("directionalLight.base.intensity");
    this.addUniform("directionalLight.direction");

    for (var i = 0; i < PhongShader.MAX_POINT_LIGHTS; i++)
    {
        // This "Hack" is due to an issue I'm having using Firefox + Uniform Array of Structs corruption
        //this.addUniform("pointLights[" + i + "].base.color");
        //this.addUniform("pointLights[" + i + "].base.intensity");
        //this.addUniform("pointLights[" + i + "].atten.constant");
        //this.addUniform("pointLights[" + i + "].atten.linear");
        //this.addUniform("pointLights[" + i + "].atten.exponent");
        //this.addUniform("pointLights[" + i + "].position");
        { // HACK
            this.addUniform("pointLights" + i + ".base.color");
            this.addUniform("pointLights" + i + ".base.intensity");
            this.addUniform("pointLights" + i + ".atten.constant");
            this.addUniform("pointLights" + i + ".atten.linear");
            this.addUniform("pointLights" + i + ".atten.exponent");
            this.addUniform("pointLights" + i + ".position");
        }
    }
}

PhongShader.prototype = new Shader();

PhongShader.prototype.updateUniforms = function (worldMatrix, projectedMatrix, material)
{
    if (material.getTexture() !== null)
        material.getTexture().bind();
    else
        RenderUtil.unbindTextures();

    this.setUniform("transformProjected", projectedMatrix);
    this.setUniform("transform", worldMatrix);
    this.setUniform("baseColor", material.getColor());
    this.setUniform("ambientLight", PhongShader.ambientLight);
    this.setUniform("directionalLight", PhongShader.directionalLight);

    // This "Hack" is due to an issue I'm having using Firefox + Uniform Array of Structs corruption
    //for (var i = 0; i < PhongShader.pointLights.length; i++)
    //    this.setUniform("pointLights[" + i + "]", PhongShader.pointLights[i]);
    { // HACK
        for (var i = 0; i < PhongShader.pointLights.length; i++)
            this.setUniform("pointLights" + i, PhongShader.pointLights[i]);
    }

    this.setUniformf("specularIntensity", material.getSpecularIntensity());
    this.setUniformf("specularPower", material.getSpecularPower());

    this.setUniform("eyePos", Transform.getCamera().getPos());
};

PhongShader.getAmbientLight = function ()
{
    return PhongShader.ambientLight;
};

PhongShader.setAmbientLight = function (ambientLight)
{
    PhongShader.ambientLight = ambientLight;
};

PhongShader.setDirectionalLight = function (directionalLight)
{
    PhongShader.directionalLight = directionalLight;
};

PhongShader.setPointLight = function (pointLights)
{
    if (pointLights.length > PhongShader.MAX_POINT_LIGHTS)
    {
        throw new Error("Error: You passed in too many point lights. Max allowed is " + PhongShader.MAX_POINT_LIGHTS + ", you passed in " + pointLights.length);

    }

    PhongShader.pointLights = pointLights;
};

PhongShader.prototype.setUniform = function (uniformName, light)
{
    if (light instanceof BaseLight) {
        this.setUniform(uniformName + ".color", light.getColor());
        this.setUniformf(uniformName + ".intensity", light.getIntensity());
    } else if (light instanceof DirectionalLight) {
        this.setUniform(uniformName + ".base", light.getBase());
        this.setUniform(uniformName + ".direction", light.getDirection());
    } else if (light instanceof PointLight) {
        this.setUniform(uniformName + ".base", light.getBaseLight());
        this.setUniformf(uniformName + ".atten.constant", light.getAtten().getConstant());
        this.setUniformf(uniformName + ".atten.linear", light.getAtten().getLinear());
        this.setUniformf(uniformName + ".atten.exponent", light.getAtten().getExponent());
        this.setUniform(uniformName + ".position", light.getPosition());
    } else {
        Shader.prototype.setUniform.apply(this, arguments);
    }
};

Util.addPostLoadCallback(function () {
    PhongShader.instance = new PhongShader();
});

PhongShader.getInstance = function ()
{
    return this.instance;
};