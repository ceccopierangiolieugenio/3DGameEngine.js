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

function PointLight(baseLight, atten, position, range)
{
    GameComponent.apply(this, arguments);

    this.baseLight = baseLight;
    this.atten = atten;
    this.position = position;
    this.range = range;
}
OO.extends(PointLight, GameComponent);

PointLight.prototype.addToRenderingEngine = function (renderingEngine)
{
    renderingEngine.addPointLight(this);
};

PointLight.prototype.getBaseLight = function ()
{
    return this.baseLight;
};

PointLight.prototype.setBaseLight = function (baseLight)
{
    this.baseLight = baseLight;
};

PointLight.prototype.getAtten = function ()
{
    return this.atten;
};

PointLight.prototype.setAtten = function (atten)
{
    this.atten = atten;
};

PointLight.prototype.getPosition = function ()
{
    return this.position;
};

PointLight.prototype.setPosition = function (position)
{
    this.position = position;
};

PointLight.prototype.getRange = function ()
{
    return this.range;
};

PointLight.prototype.setRange = function (range)
{
    this.range = range;
}
