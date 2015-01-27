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

function Material()
{
    this.textureHashMap = {};
    this.vector3fHashMap = {};
    this.floatHashMap = {};
}

Material.prototype.addTexture  = function(name, texture)    { this.textureHashMap[name] = texture;    };
Material.prototype.addVector3f = function(name, vector3f)   { this.vector3fHashMap[name]= vector3f;   };
Material.prototype.addFloat    = function(name, floatValue) { this.floatHashMap[name]   = floatValue; };

Material.prototype.getTexture = function (name)
{
    var result = this.textureHashMap[name];
    if (result !== undefined)
        return result;

    return new Texture("test.png");
};

Material.prototype.getVector3f = function (name)
{
    var result = this.vector3fHashMap[name];
    if (result !== undefined)
        return result;

    return new Vector3f(0, 0, 0);
};

Material.prototype.getFloat = function (name)
{
    var result = this.floatHashMap[name];
    if (result !== undefined)
        return result;

    return 0;
};
