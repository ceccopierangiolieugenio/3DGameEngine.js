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

function Matrix4f()
{
    this.m = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
}

Matrix4f.prototype.initIdentity = function ()
{
    this.m[0][0] = 1;    this.m[0][1] = 0;    this.m[0][2] = 0;    this.m[0][3] = 0;
    this.m[1][0] = 0;    this.m[1][1] = 1;    this.m[1][2] = 0;    this.m[1][3] = 0;
    this.m[2][0] = 0;    this.m[2][1] = 0;    this.m[2][2] = 1;    this.m[2][3] = 0;
    this.m[3][0] = 0;    this.m[3][1] = 0;    this.m[3][2] = 0;    this.m[3][3] = 1;
    return this;
};

Matrix4f.prototype.mul = function (r)
{
    res = new Matrix4f();

    for (var i = 0; i < 4; i++)
    {
        for (var j = 0; j < 4; j++)
        {
            r.set(i, j, this.m[i][0] * r.get(0, j) +
                        this.m[i][1] * r.get(1, j) +
                        this.m[i][2] * r.get(2, j) +
                        this.m[i][3] * r.get(3, j));
        }
    }

    return res;
};

Matrix4f.prototype.getM = function ()
{
    return this.m;
};

Matrix4f.prototype.get = function (x, y)
{
    return this.m[x][y];
};

Matrix4f.prototype.setM = function (m)
{
    this.m = m;
};

Matrix4f.prototype.set = function (x, y, value)
{
    this.m[x][y] = value;
};