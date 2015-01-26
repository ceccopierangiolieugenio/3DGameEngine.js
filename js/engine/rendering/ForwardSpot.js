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

function ForwardSpot()
{
    Shader.apply(this, arguments);

    this.addVertexShaderFromFile("forward-spot.vs");
    this.addFragmentShaderFromFile("forward-spot.fs");

    this.setAttribLocation("position", 0);
    this.setAttribLocation("texCoord", 1);
    this.setAttribLocation("normal", 2);

    this.compileShader();

    this.addUniform("model");
    this.addUniform("MVP");

    this.addUniform("specularIntensity");
    this.addUniform("specularPower");
    this.addUniform("eyePos");

    this.addUniform("spotLight.pointLight.base.color");
    this.addUniform("spotLight.pointLight.base.intensity");
    this.addUniform("spotLight.pointLight.atten.constant");
    this.addUniform("spotLight.pointLight.atten.linear");
    this.addUniform("spotLight.pointLight.atten.exponent");
    this.addUniform("spotLight.pointLight.position");
    this.addUniform("spotLight.pointLight.range");
    this.addUniform("spotLight.direction");
    this.addUniform("spotLight.cutoff");
}
OO.extends(ForwardSpot, Shader);

ForwardSpot.prototype.updateUniforms = function (transform, material)
{
    var worldMatrix = transform.getTransformation();
    var projectedMatrix = this.getRenderingEngine().getMainCamera().getViewProjection().mul(worldMatrix);
    material.getTexture().bind();

    this.setUniform("model", worldMatrix);
    this.setUniform("MVP", projectedMatrix);

    this.setUniformf("specularIntensity", material.getSpecularIntensity());
    this.setUniformf("specularPower", material.getSpecularPower());

    this.setUniform("eyePos", this.getRenderingEngine().getMainCamera().getPos());
    this.setUniform("spotLight", this.getRenderingEngine().getSpotLight());
};

ForwardSpot.prototype.setUniform = function (uniformName, light)
{
    if (light instanceof BaseLight) {
        this.setUniform(uniformName + ".color", light.getColor());
        this.setUniformf(uniformName + ".intensity", light.getIntensity());
    } else if (light instanceof PointLight) {
        this.setUniform(uniformName + ".base", light.getBaseLight());
        this.setUniformf(uniformName + ".atten.constant", light.getAtten().getConstant());
        this.setUniformf(uniformName + ".atten.linear", light.getAtten().getLinear());
        this.setUniformf(uniformName + ".atten.exponent", light.getAtten().getExponent());
        this.setUniform(uniformName + ".position", light.getPosition());
        this.setUniformf(uniformName + ".range", light.getRange());
    } else if (light instanceof SpotLight) {
        this.setUniform(uniformName + ".pointLight", light.getPointLight());
        this.setUniform(uniformName + ".direction", light.getDirection());
        this.setUniformf(uniformName + ".cutoff", light.getCutoff());
    } else {
        Shader.prototype.setUniform.apply(this, arguments);
    }
};

ForwardSpot.getInstance = function ()
{
    if (this.instance === undefined)
        this.instance = new ForwardSpot();
    return this.instance;
};
