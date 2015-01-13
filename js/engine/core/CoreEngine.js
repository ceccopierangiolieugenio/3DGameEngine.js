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

function CoreEngine(width, height, framerate, game) {
    this.isRunning = false;
    this.game = game;
    this.width = width;
    this.height = height;
    this.frameTime = 1.0 / framerate;
}

CoreEngine.prototype.initializeRenderingSystem = function ()
{
    RenderUtil.initGraphics(this.canv);
    console.log(RenderUtil.getOpenGLVersion());
};

CoreEngine.prototype.createWindow = function (title)
{
    /* TODO: Here the webgl canvas can be handled */
    this.canv = document.createElement('canvas');
    this.canv.id = 'canvas3D';
    this.canv.setAttribute('width', this.width+'px');
    this.canv.setAttribute('height', this.height+'px');    
    document.body.appendChild(this.canv); // adds the canvas to the body element

    this.initializeRenderingSystem();
};

CoreEngine.prototype.start = function ()
{
    if (this.isRunning)
        return;

    this.run();
};

CoreEngine.prototype.stop = function ()
{
    if (!this.isRunning)
        return;
    this.isRunning = false;
};

CoreEngine.prototype.run = function ()
{
    this.isRunning = true;

    var frames = 0;
    var frameCounter = 0;

    this.game.init();

    var lastTime = Time.getTime();
    var unprocessedTime = 0;

    var mainLoop = function (timestamp) {
        var render = false;
        var startTime = Time.getTime();
        var passedTime = startTime - lastTime;
        lastTime = startTime;

        unprocessedTime += passedTime / Time.SECOND;
        frameCounter += passedTime;

        while (unprocessedTime > this.frameTime) {
            render = true;
            unprocessedTime -= this.frameTime;

            Time.setDelta(this.frameTime);

            this.game.input();
            Input.update();

            this.game.update();

            if (frameCounter >= Time.SECOND) {
                console.log("FPS:" + frames);
                frames = 0;
                frameCounter = 0;
            }
        }
        if (render) {
            this.render();
            frames++;
        } else {
            // Sleep 1
            ;
        }
        if (this.isRunning) {
            requestAnimationFrame(mainLoop.bind(this));
        } else {
            return;
        }
    };

    requestAnimationFrame(mainLoop.bind(this));
};

CoreEngine.prototype.render = function ()
{
    RenderUtil.clearScreen();
    this.game.render();
};