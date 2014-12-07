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

    this.ambientLight = new Vector3f(0.1, 0.1, 0.1);
    this.directionalLight = new DirectionalLight(new BaseLight(new Vector3f(0, 0, 0), 0), new Vector3f(0, 0, 0));

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

PhongShader.prototype.setUniform = function (uniformName, light)
{
    if (light instanceof BaseLight) {
        this.setUniform(uniformName + ".color", light.getColor());
        this.setUniformf(uniformName + ".intensity", light.getIntensity());
    } else if (light instanceof DirectionalLight) {
        this.setUniform(uniformName + ".base", light.getBase());
        this.setUniform(uniformName + ".direction", light.getDirection());
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