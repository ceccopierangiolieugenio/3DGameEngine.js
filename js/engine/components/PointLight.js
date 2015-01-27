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

function PointLight(color, intensity, constant, linear, exponent, position, range)
{
    BaseLight.apply(this, [color, intensity]);
    this.constant = constant;
    this.linear = linear;
    this.exponent = exponent;
    this.position = position;
    this.range = range;
    this.setShader(ForwardPoint.getInstance());
}
OO.extends(PointLight, BaseLight);

PointLight.prototype.getBaseLight = function ()
{
    return this.baseLight;
};

PointLight.prototype.setBaseLight = function (baseLight)
{
    this.baseLight = baseLight;
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
};

PointLight.prototype.getConstant = function ()
{
    return this.constant;
};

PointLight.prototype.setConstant = function (constant)
{
    this.constant = constant;
};

PointLight.prototype.getLinear = function ()
{
    return this.linear;
};

PointLight.prototype.setLinear = function (linear)
{
    this.linear = linear;
};

PointLight.prototype.getExponent = function ()
{
    return this.exponent;
};

PointLight.prototype.setExponent = function (exponent)
{
    this.exponent = exponent;
};
