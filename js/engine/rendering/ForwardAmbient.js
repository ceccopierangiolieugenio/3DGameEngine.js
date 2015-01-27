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

function ForwardAmbient()
{
    Shader.apply(this, arguments);

    this.addVertexShaderFromFile("forward-ambient.vs");
    this.addFragmentShaderFromFile("forward-ambient.fs");

    this.setAttribLocation("position", 0);
    this.setAttribLocation("texCoord", 1);

    this.compileShader();

    this.addUniform("MVP");
    this.addUniform("ambientIntensity");
}
OO.extends(ForwardAmbient, Shader);

ForwardAmbient.prototype.updateUniforms = function (transform, material, renderingEngine)
{
    var worldMatrix = transform.getTransformation();
    var projectedMatrix = renderingEngine.getMainCamera().getViewProjection().mul(worldMatrix);
    material.getTexture("diffuse").bind();

    this.setUniform("MVP", projectedMatrix);
    this.setUniform("ambientIntensity", renderingEngine.getAmbientLight());
};

ForwardAmbient.getInstance = function ()
{
    if (this.instance === undefined)
        this.instance = new ForwardAmbient();
    return this.instance;
};
