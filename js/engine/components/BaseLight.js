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

function BaseLight(color, intensity)
{
    GameComponent.apply(this, arguments);

    this.color = color;
    this.intensity = intensity;
}
OO.extends(BaseLight, GameComponent);

BaseLight.prototype.addToRenderingEngine = function (renderingEngine)
{
    renderingEngine.addLight(this);
};

BaseLight.prototype.setShader = function (shader)
{
    this.shader = shader;
};

BaseLight.prototype.getShader = function ()
{
    return this.shader;
};

BaseLight.prototype.getColor = function ()
{
    return this.color;
};

BaseLight.prototype.setColor = function (color)
{
    this.color = color;
};

BaseLight.prototype.getIntensity = function ()
{
    return this.intensity;
};

BaseLight.prototype.setIntensity = function (intensity)
{
    this.intensity = intensity;
};
