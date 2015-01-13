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

var Util = Util || {};

Util.removeEmptyStrings = function (data)
{
    var result = [];

    for (var i = 0; i < data.length; i++)
        if (data[i].length !== 0)
            result.push(data[i]);

    return result;
};


Util.Vertices2Float32Array = function (vertices)
{
    var ret = new Float32Array(vertices.length * Vertex.SIZE);
    for (var i = 0; i < vertices.length; i++)
    {
        ret[i * Vertex.SIZE + 0] = vertices[i].getPos().getX();
        ret[i * Vertex.SIZE + 1] = vertices[i].getPos().getY();
        ret[i * Vertex.SIZE + 2] = vertices[i].getPos().getZ();
        ret[i * Vertex.SIZE + 3] = vertices[i].getTexCoord().getX();
        ret[i * Vertex.SIZE + 4] = vertices[i].getTexCoord().getY();
        ret[i * Vertex.SIZE + 5] = vertices[i].getNormal().getX();
        ret[i * Vertex.SIZE + 6] = vertices[i].getNormal().getY();
        ret[i * Vertex.SIZE + 7] = vertices[i].getNormal().getZ();
    }
    return ret;
};

Util.Matrix4f2Float32Array = function (matrix)
{
    var ret = new Float32Array(4 * 4);
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            ret[i * 4 + j] = matrix.get(i, j);
    return ret;
};

Util.Matrix4f2Float32ArrayTransposed = function (matrix)
{
    var ret = new Float32Array(4 * 4);
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            ret[i * 4 + j] = matrix.get(j, i);
    return ret;
};

Util.toRadians = function (x)
{
    return x * Math.PI / 180;
};