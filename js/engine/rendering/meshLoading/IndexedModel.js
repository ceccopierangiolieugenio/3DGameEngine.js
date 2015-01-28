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

function IndexedModel() {
    this.positions = [];
    this.texCoords = [];
    this.normals = [];
    this.indices = [];
}

IndexedModel.prototype.calcNormals = function ()
{
    for (var i = 0; i < this.indices.length; i += 3)
    {
        var i0 = this.indices[i];
        var i1 = this.indices[i + 1];
        var i2 = this.indices[i + 2];
        var v1 = this.positions[i1].sub(this.positions[i0]);
        var v2 = this.positions[i2].sub(this.positions[i0]);
        var normal = v1.cross(v2).normalized();
        this.normals[i0].set(this.normals[i0].add(normal));
        this.normals[i1].set(this.normals[i1].add(normal));
        this.normals[i2].set(this.normals[i2].add(normal));
    }

    for (var i = 0; i < this.normals.length; i++)
        this.normals[i].set(this.normals[i].normalized());
};

IndexedModel.prototype.getPositions = function () { return this.positions; };
IndexedModel.prototype.getTexCoords = function () { return this.texCoords; };
IndexedModel.prototype.getNormals = function () { return this.normals; };
IndexedModel.prototype.getIndices = function () { return this.indices; };
