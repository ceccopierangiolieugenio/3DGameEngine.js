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

function RenderingEngine()
{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.frontFace(gl.CW);
    gl.cullFace(gl.BACK);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    //gl.enable(gl.DEPTH_CLAMP);

    //gl.enable(gl.TEXTURE_2D);

    this.mainCamera = new Camera(Util.toRadians(70.0), Window.getWidth() / Window.getHeight(), 0.01, 1000.0);
}
RenderingEngine.prototype.input = function (delta)
{
    this.mainCamera.input(delta);
};

RenderingEngine.prototype.render = function (object)
{
    RenderingEngine.clearScreen();
    
    var shader = BasicShader.getInstance();
    shader.setRenderingEngine(this);
    
    object.render(BasicShader.getInstance());
};

RenderingEngine.clearScreen = function ()
{
    //TODO: Stencil Buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

RenderingEngine.setTexture = function (enabled)
{
    if (enabled)
        gl.enable(gl.TEXTURE_2D);
    else
        gl.disable(gl.TEXTURE_2D);
};

RenderingEngine.unbindTextures = function ()
{
    gl.bindTexture(GL_TEXTURE_2D, 0);
};

RenderingEngine.setClearColor = function (color)
{
    gl.clearColor(color.getX(), color.getY(), color.getZ(), 1.0);
};

RenderingEngine.getOpenGLVersion = function ()
{
    return gl.getParameter(gl.VERSION);
};

RenderingEngine.prototype.getMainCamera = function ()
{
    return this.mainCamera;
};

RenderingEngine.prototype.setMainCamera = function (mainCamera)
{
    this.mainCamera = mainCamera;
};
