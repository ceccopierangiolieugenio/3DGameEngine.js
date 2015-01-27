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

ForwardSpot.prototype.updateUniforms = function (transform, material, renderingEngine)
{
    var worldMatrix = transform.getTransformation();
    var projectedMatrix = renderingEngine.getMainCamera().getViewProjection().mul(worldMatrix);
    material.getTexture("diffuse").bind();

    this.setUniform("model", worldMatrix);
    this.setUniform("MVP", projectedMatrix);

    this.setUniformf("specularIntensity", material.getFloat("specularIntensity"));
    this.setUniformf("specularPower", material.getFloat("specularPower"));

    this.setUniform("eyePos", renderingEngine.getMainCamera().getTransform().getTransformedPos());
    this.setUniformSpotLight("spotLight", renderingEngine.getActiveLight());
};

ForwardSpot.prototype.setUniformBaseLight = function (uniformName, baseLight)
{
    this.setUniform(uniformName + ".color", baseLight.getColor());
    this.setUniformf(uniformName + ".intensity", baseLight.getIntensity());
};

ForwardSpot.prototype.setUniformPointLight = function (uniformName, pointLight)
{
    this.setUniformBaseLight(uniformName + ".base", pointLight);
    this.setUniformf(uniformName + ".atten.constant", pointLight.getConstant());
    this.setUniformf(uniformName + ".atten.linear", pointLight.getLinear());
    this.setUniformf(uniformName + ".atten.exponent", pointLight.getExponent());
    this.setUniform(uniformName + ".position", pointLight.getTransform().getTransformedPos());
    this.setUniformf(uniformName + ".range", pointLight.getRange());
};

ForwardSpot.prototype.setUniformSpotLight = function (uniformName, spotLight)
{
    this.setUniformPointLight(uniformName + ".pointLight", spotLight);
    this.setUniform(uniformName + ".direction", spotLight.getDirection());
    this.setUniformf(uniformName + ".cutoff", spotLight.getCutoff());
};

ForwardSpot.getInstance = function ()
{
    if (this.instance === undefined)
        this.instance = new ForwardSpot();
    return this.instance;
};
