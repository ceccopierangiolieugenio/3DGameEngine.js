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
//"use strict";

function RenderingEngine()
{
    MappedValues.apply(this, []);
    this.lights = [];
    this.sampleMap = {};
    this.sampleMap["diffuse"] = 0;
    
    this.addVector3f("ambient", new Vector3f(0.1, 0.1, 0.1));
    
    this.forwardAmbient = new Shader("forward-ambient");
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.frontFace(gl.CW);
    gl.cullFace(gl.BACK);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    //gl.enable(gl.DEPTH_CLAMP);

    //gl.enable(gl.TEXTURE_2D);
 }
OO.extends(RenderingEngine, MappedValues);

RenderingEngine.prototype.updateUniformStruct = function(transform, material, shader, uniformName, uniformType)
{
    throw new Error(uniformType + " is not a supported type in RenderingEngine");
};

RenderingEngine.prototype.render = function (object)
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.lights = [];
    object.addToRenderingEngine(this);

    object.render(this.forwardAmbient, this);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.depthMask(false);
    gl.depthFunc(gl.EQUAL);

    for (var i = 0; i < this.lights.length; i++)
    {
        this.activeLight = this.lights[i];
        object.render(this.lights[i].getShader(), this);
    }

    gl.depthFunc(gl.LESS);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
};

RenderingEngine.getOpenGLVersion = function ()
{
    return gl.getParameter(gl.VERSION);
};

RenderingEngine.prototype.addLight = function (light)
{
    this.lights.push(light);
};

RenderingEngine.prototype.addCamera = function (camera)
{
    this.mainCamera = camera;
};

RenderingEngine.prototype.getSamplerSlot = function (samplerName)
{
    return this.sampleMap[samplerName];
};

RenderingEngine.prototype.getActiveLight = function ()
{
    return this.activeLight;
};

RenderingEngine.prototype.getMainCamera = function ()
{
    return this.mainCamera;
};

RenderingEngine.prototype.setMainCamera = function (mainCamera)
{
    this.mainCamera = mainCamera;
};
