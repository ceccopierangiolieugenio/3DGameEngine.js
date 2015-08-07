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
    this.engine = undefined;
}

GameObject.prototype.addChild = function (child)
{
    this.children.push(child);
    child.setEngine(this.engine);
    child.getTransform().setParent(this.transform);
};

GameObject.prototype.addComponent = function (component)
{
    this.components.push(component);
    component.setParent(this);

    return this;
};

GameObject.prototype.inputAll = function (delta)
{
    this.input(delta);

    for (var i = 0; i < this.children.length; i++)
        this.children[i].inputAll(delta);
};

GameObject.prototype.updateAll = function (delta)
{
    this.update(delta);

    for (var i = 0; i < this.children.length; i++)
        this.children[i].updateAll(delta);
};

GameObject.prototype.renderAll = function (shader, renderingEngine)
{
    this.render(shader, renderingEngine);

    for (var i = 0; i < this.children.length; i++)
        this.children[i].renderAll(shader, renderingEngine);
};

GameObject.prototype.input = function (delta)
{
    this.transform.update();

    for (var i = 0; i < this.components.length; i++)
        this.components[i].input(delta);
};

GameObject.prototype.update = function (delta)
{
    for (var i = 0; i < this.components.length; i++)
        this.components[i].update(delta);
};

GameObject.prototype.render = function (shader, renderingEngine)
{
    for (var i = 0; i < this.components.length; i++)
        this.components[i].render(shader, renderingEngine);
};

GameObject.prototype.getAllAttached = function ()
{
    var result = [];
    
    for (var i = 0; i < this.children.length; i++)
        result.concat(this.children[i].getAllAttached());
    
    result.push(this);
    return result;
};

GameObject.prototype.getTransform = function ()
{
    return this.transform;
};

GameObject.prototype.setEngine = function (engine)
{
    if (this.engine !== engine)
    {
        this.engine = engine;

        for (var i = 0; i < this.components.length; i++)
            this.components[i].addToEngine(engine);

        for (var i = 0; i < this.children.length; i++)
            this.children[i].setEngine(engine);
    }
};
