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

function PointLight(color, intensity, attenuation)
{
    BaseLight.apply(this, [color, intensity]);
    this.attenuation = attenuation;

    var a = attenuation.getExponent();
    var b = attenuation.getLinear();
    var c = attenuation.getConstant() - PointLight.COLOR_DEPTH * this.getIntensity() * this.getColor().max();

    this.range = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);

    this.setShader(new Shader("forward-point"));
}
OO.extends(PointLight, BaseLight);

PointLight.COLOR_DEPTH = 256;

PointLight.prototype.getRange = function ()
{
    return this.range;
};

PointLight.prototype.setRange = function (range)
{
    this.range = range;
};

PointLight.prototype.getAttenuation = function ()
{
    return this.attenuation;
};
