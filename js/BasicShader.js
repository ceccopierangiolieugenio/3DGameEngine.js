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

function BasicShader()
{
    Shader.apply(this, arguments);
    this.addVertexShader(ResourceLoader.loadShader("basicVertex.vs"));
    this.addFragmentShader(ResourceLoader.loadShader("basicFragment.fs"));
    this.compileShader();

    this.addUniform("transform");
    this.addUniform("color");
}

BasicShader.prototype = new Shader();

BasicShader.prototype.updateUniforms = function (worldMatrix, projectedMatrix, material)
{
    if (material.getTexture() !== null)
        material.getTexture().bind();
    else
        RenderUtil.unbindTextures();

    this.setUniform("transform", projectedMatrix);
    this.setUniform("color", material.getColor());
};

BasicShader.instance = new BasicShader();

BasicShader.getInstance = function () 
{
    return this.instance;
};
