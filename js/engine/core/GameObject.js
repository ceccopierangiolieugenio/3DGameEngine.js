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

function GameObject()
{
    this.children = [];
    this.components = [];
    this.transform = new Transform();
}

GameObject.prototype.addChild = function (child)
{
    this.children.push(child);
};

GameObject.prototype.addComponent = function (component)
{
    this.components.push(component);
    component.setParent(this);
    
    return this;
};

GameObject.prototype.input = function (delta)
{
    for (var i = 0; i < this.components.length; i++)
        this.components[i].input(delta);

    for (var i = 0; i < this.children.length; i++)
        this.children[i].input(delta);
};

GameObject.prototype.update = function (delta)
{
    for (var i = 0; i < this.components.length; i++)
        this.components[i].update(delta);

    for (var i = 0; i < this.children.length; i++)
        this.children[i].update(delta);
};

GameObject.prototype.render = function (shader)
{
    for (var i = 0; i < this.components.length; i++)
        this.components[i].render(shader);

    for (var i = 0; i < this.children.length; i++)
        this.children[i].render(shader);
};

GameObject.prototype.addToRenderingEngine = function (renderingEngine)
{
    for (var i = 0; i < this.components.length; i++)
        this.components[i].addToRenderingEngine(renderingEngine);

    for (var i = 0; i < this.children.length; i++)
        this.children[i].addToRenderingEngine(renderingEngine);
};

GameObject.prototype.getTransform = function ()
{
    return this.transform;
};
