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

CoreEngine.prototype.createWindow = function (title)
{
    Window.createWindow(this.width, this.height, title);
    this.renderingEngine = new RenderingEngine();
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

        unprocessedTime += passedTime;
        frameCounter += passedTime;

        while (unprocessedTime > this.frameTime) {
            render = true;
            unprocessedTime -= this.frameTime;

            this.game.input(this.frameTime);
            this.renderingEngine.input(this.frameTime);
            Input.update();

            this.game.update(this.frameTime);

            if (frameCounter >= 1.0) {
                console.log("FPS:" + frames);
                frames = 0;
                frameCounter = 0;
            }
        }
        if (render) {
            this.renderingEngine.render(this.game.getRootObject());
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
