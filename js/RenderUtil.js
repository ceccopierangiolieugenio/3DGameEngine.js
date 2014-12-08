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

var RenderUtil = RenderUtil || {};

RenderUtil.clearScreen = function ()
{
    //TODO: Stencil Buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

RenderUtil.setTexture = function (enabled)
{
    if (enabled)
        gl.enable(gl.TEXTURE_2D);
    else
        gl.disable(gl.TEXTURE_2D);
};

RenderUtil.unbindTextures = function ()
{
    gl.bindTexture(GL_TEXTURE_2D, 0);
};

RenderUtil.setClearColor = function (color)
{
    gl.clearColor(color.getX(), color.getY(), color.getZ(), 1.0);
};

RenderUtil.initGraphics = function ()
{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.frontFace(gl.CW);
    gl.cullFace(gl.BACK);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    //gl.enable(gl.DEPTH_CLAMP);

    //gl.enable(gl.TEXTURE_2D);
};

RenderUtil.getOpenGLVersion = function ()
{
    return gl.getParameter(gl.VERSION);
};
