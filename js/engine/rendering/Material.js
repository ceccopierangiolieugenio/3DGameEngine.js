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

function Material(texture, color, specularIntensity, specularPower)
{
    this.texture = texture;

    if (color === undefined)
        this.color = new Vector3f(1, 1, 1);
    else
        this.color = color;

    if (specularIntensity === undefined)
        this.specularIntensity = 2;
    else
        this.specularIntensity = specularIntensity;

    if (specularPower === undefined)
        this.specularPower = 32;
    else
        this.specularPower = specularPower;
}

Material.prototype.getTexture = function ()
{
    return this.texture;
};

Material.prototype.setTexture = function (texture)
{
    this.texture = texture;
};

Material.prototype.getColor = function ()
{
    return this.color;
};

Material.prototype.setColor = function (color)
{
    this.color = color;
};

Material.prototype.getSpecularIntensity = function ()
{
    return this.specularIntensity;
};

Material.prototype.setSpecularIntensity = function (specularIntensity)
{
    this.specularIntensity = specularIntensity;
};

Material.prototype.getSpecularPower = function ()
{
    return this.specularPower;
};

Material.prototype.setSpecularPower = function (specularPower)
{
    this.specularPower = specularPower;
};
