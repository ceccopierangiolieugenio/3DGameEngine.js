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
    Shader.apply(this, ["forward-directional"]);
}
OO.extends(ForwardDirectional, Shader);

ForwardDirectional.prototype.updateUniforms = function (transform, material, renderingEngine)
{
    var worldMatrix = transform.getTransformation();
    var projectedMatrix = renderingEngine.getMainCamera().getViewProjection().mul(worldMatrix);
    material.getTexture("diffuse").bind();

    this.setUniform("model", worldMatrix);
    this.setUniform("MVP", projectedMatrix);

    this.setUniformf("specularIntensity", material.getFloat("specularIntensity"));
    this.setUniformf("specularPower", material.getFloat("specularPower"));

    this.setUniform("eyePos", renderingEngine.getMainCamera().getTransform().getTransformedPos());
    this.setUniformDirectionalLight("directionalLight", renderingEngine.getActiveLight());
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
