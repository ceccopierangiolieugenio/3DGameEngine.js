/* 
 * Copyright 2015 Eugenio Parodi <ceccopierangiolieugenio at googlemail>.
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

var Window = Window || {};
var gl = gl || {};

Window.createWindow = function (width, height, title) {
    this.width = width;
    this.height = height;
    this.title = title;
    /* TODO: Here the webgl canvas can be handled */
    this.canv = document.createElement('canvas');
    this.canv.id = 'canvas3D';
    this.canv.setAttribute('width', this.width + 'px');
    this.canv.setAttribute('height', this.height + 'px');
    document.body.appendChild(this.canv); // adds the canvas to the body element

    try {
        gl = this.canv.getContext("webgl");
        gl.viewportWidth = this.canv.width;
        gl.viewportHeight = this.canv.height;
    } catch (e) {
        throw new Error("Error: Could not initialise WebGL");
    }

    if (!gl) {
        throw new Error("Error: Could not initialise WebGL");
    }
};

Window.render = function () {};

Window.dispose = function () {};

Window.getWidth = function ()
{
    return gl.viewportWidth;
};

Window.getHeight = function ()
{
    return gl.viewportHeight;
};

Window.getTitle = function ()
{
    return this.title;
};

Window.getCenter = function ()
{
    return new Vector2f(this.getWidth() / 2, this.getHeight() / 2);
};