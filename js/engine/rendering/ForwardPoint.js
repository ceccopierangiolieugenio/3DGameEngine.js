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

function ForwardPoint()
{
    Shader.apply(this, arguments);

    this.addVertexShaderFromFile("forward-point.vs");
    this.addFragmentShaderFromFile("forward-point.fs");

    this.setAttribLocation("position", 0);
    this.setAttribLocation("texCoord", 1);
    this.setAttribLocation("normal", 2);

    this.compileShader();

    this.addUniform("model");
    this.addUniform("MVP");

    this.addUniform("specularIntensity");
    this.addUniform("specularPower");
    this.addUniform("eyePos");

    this.addUniform("pointLight.base.color");
    this.addUniform("pointLight.base.intensity");
    this.addUniform("pointLight.atten.constant");
    this.addUniform("pointLight.atten.linear");
    this.addUniform("pointLight.atten.exponent");
    this.addUniform("pointLight.position");
    this.addUniform("pointLight.range");
}
OO.extends(ForwardPoint, Shader);

ForwardPoint.prototype.updateUniforms = function (transform, material)
{
    var worldMatrix = transform.getTransformation();
    var projectedMatrix = this.getRenderingEngine().getMainCamera().getViewProjection().mul(worldMatrix);
    material.getTexture().bind();

    this.setUniform("model", worldMatrix);
    this.setUniform("MVP", projectedMatrix);

    this.setUniformf("specularIntensity", material.getSpecularIntensity());
    this.setUniformf("specularPower", material.getSpecularPower());

    this.setUniform("eyePos", this.getRenderingEngine().getMainCamera().getTransform().getTransformedPos());
    this.setUniformPointLight("pointLight", this.getRenderingEngine().getActiveLight());
};

ForwardPoint.prototype.setUniformBaseLight = function (uniformName, baseLight)
{
    this.setUniform(uniformName + ".color", baseLight.getColor());
    this.setUniformf(uniformName + ".intensity", baseLight.getIntensity());
};

ForwardPoint.prototype.setUniformPointLight = function (uniformName, pointLight)
{
    this.setUniformBaseLight(uniformName + ".base", pointLight);
    this.setUniformf(uniformName + ".atten.constant", pointLight.getConstant());
    this.setUniformf(uniformName + ".atten.linear", pointLight.getLinear());
    this.setUniformf(uniformName + ".atten.exponent", pointLight.getExponent());
    this.setUniform(uniformName + ".position", pointLight.getTransform().getTransformedPos());
    this.setUniformf(uniformName + ".range", pointLight.getRange());
};

ForwardPoint.getInstance = function ()
{
    if (this.instance === undefined)
        this.instance = new ForwardPoint();
    return this.instance;
};
