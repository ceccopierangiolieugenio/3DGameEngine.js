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

function ForwardDirectional()
{
    Shader.apply(this, arguments);

    this.addVertexShaderFromFile("forward-directional.vs");
    this.addFragmentShaderFromFile("forward-directional.fs");

    this.setAttribLocation("position", 0);
    this.setAttribLocation("texCoord", 1);
    this.setAttribLocation("normal", 2);

    this.compileShader();

    this.addUniform("model");
    this.addUniform("MVP");

    this.addUniform("specularIntensity");
    this.addUniform("specularPower");
    this.addUniform("eyePos");

    this.addUniform("directionalLight.base.color");
    this.addUniform("directionalLight.base.intensity");
    this.addUniform("directionalLight.direction");
}
OO.extends(ForwardDirectional, Shader);

ForwardDirectional.prototype.updateUniforms = function (transform, material)
{
    var worldMatrix = transform.getTransformation();
    var projectedMatrix = this.getRenderingEngine().getMainCamera().getViewProjection().mul(worldMatrix);
    material.getTexture().bind();

    this.setUniform("model", worldMatrix);
    this.setUniform("MVP", projectedMatrix);

    this.setUniformf("specularIntensity", material.getSpecularIntensity());
    this.setUniformf("specularPower", material.getSpecularPower());

    this.setUniform("eyePos", this.getRenderingEngine().getMainCamera().getPos());
    this.setUniformDirectionalLight("directionalLight", this.getRenderingEngine().getActiveLight());
};

ForwardDirectional.prototype.setUniformBaseLight = function (uniformName, baseLight)
{
    this.setUniform(uniformName + ".color", baseLight.getColor());
    this.setUniformf(uniformName + ".intensity", baseLight.getIntensity());
};

ForwardDirectional.prototype.setUniformDirectionalLight = function (uniformName, directionalLight)
{
    this.setUniformBaseLight(uniformName + ".base", directionalLight);
    this.setUniform(uniformName + ".direction", directionalLight.getDirection());
};

ForwardDirectional.getInstance = function ()
{
    if (this.instance === undefined)
        this.instance = new ForwardDirectional();
    return this.instance;
};
