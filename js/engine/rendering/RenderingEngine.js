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
    this.lights = [];
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.frontFace(gl.CW);
    gl.cullFace(gl.BACK);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    //gl.enable(gl.DEPTH_CLAMP);

    //gl.enable(gl.TEXTURE_2D);

    //this.mainCamera = new Camera(Util.toRadians(70.0), Window.getWidth() / Window.getHeight(), 0.01, 1000.0);

    this.ambientLight = new Vector3f(0.1, 0.1, 0.1);
//    this.directionalLight = new DirectionalLight(new BaseLight(new Vector3f(0, 0, 1), 0.4), new Vector3f(1, 1, 1));
//    this.directionalLight2 = new DirectionalLight(new BaseLight(new Vector3f(1, 0, 0), 0.4), new Vector3f(-1, 1, -1));
//
//
//    var lightFieldWidth = 5;
//    var lightFieldDepth = 5;
//
//    var lightFieldStartX = 0;
//    var lightFieldStartY = 0;
//    var lightFieldStepX = 7;
//    var lightFieldStepY = 7;
//
//    this.pointLightList = [];
//
//    for (var i = 0; i < lightFieldWidth; i++)
//    {
//        for (var j = 0; j < lightFieldDepth; j++)
//        {
//            this.pointLightList[i * lightFieldWidth + j] = new PointLight(new BaseLight(new Vector3f(0, 1, 0), 0.4),
//                            new Attenuation(0, 0, 1),
//                            new Vector3f(lightFieldStartX + lightFieldStepX * i, 0, lightFieldStartY + lightFieldStepY * j), 100);
//        }
//    }
//
//    this.pointLight = this.pointLightList[0];//new PointLight(new BaseLight(new Vector3f(0,1,0), 0.4f), new Attenuation(0,0,1), new Vector3f(5,0,5), 100);
//
//    this.spotLight = new SpotLight(new PointLight(new BaseLight(new Vector3f(0, 1, 1), 0.4),
//                            new Attenuation(0, 0, 0.1),
//                            new Vector3f(lightFieldStartX, 0, lightFieldStartY), 100),
//                            new Vector3f(1, 0, 0), 0.7);
}

RenderingEngine.prototype.getAmbientLight = function ()
{
    return this.ambientLight;
};

RenderingEngine.prototype.render = function (object)
{
    RenderingEngine.clearScreen();

    this.lights = [];
    object.addToRenderingEngine(this);

    var forwardAmbient = ForwardAmbient.getInstance();
    forwardAmbient.setRenderingEngine(this);

    object.render(forwardAmbient);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.depthMask(false);
    gl.depthFunc(gl.EQUAL);

    for (var i = 0; i < this.lights.length; i++)
    {
        this.lights[i].getShader().setRenderingEngine(this);
        this.activeLight = this.lights[i];
        object.render(this.lights[i].getShader());
    }
    
    gl.depthFunc(gl.LESS);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
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

RenderingEngine.prototype.addLight = function (light)
{
    this.lights.push(light);
};

RenderingEngine.prototype.addCamera = function (camera)
{
    this.mainCamera = camera;
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
