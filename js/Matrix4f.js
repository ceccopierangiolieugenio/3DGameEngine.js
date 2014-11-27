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

function Matrix4f() {
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

Matrix4f.prototype.initTranslation = function (x, y, z)
{
    this.m[0][0] = 1;    this.m[0][1] = 0;    this.m[0][2] = 0;    this.m[0][3] = x;
    this.m[1][0] = 0;    this.m[1][1] = 1;    this.m[1][2] = 0;    this.m[1][3] = y;
    this.m[2][0] = 0;    this.m[2][1] = 0;    this.m[2][2] = 1;    this.m[2][3] = z;
    this.m[3][0] = 0;    this.m[3][1] = 0;    this.m[3][2] = 0;    this.m[3][3] = 1;

    return this;
};

Matrix4f.prototype.initRotation = function (x,y,z)
{
    var rx = new Matrix4f();
    var ry = new Matrix4f();
    var rz = new Matrix4f();

    x = Util.toRadians(x);
    y = Util.toRadians(y);
    z = Util.toRadians(z);

    rz.m[0][0] = Math.cos(z);   rz.m[0][1] = -Math.sin(z);  rz.m[0][2] = 0;             rz.m[0][3] = 0;
    rz.m[1][0] = Math.sin(z);   rz.m[1][1] =  Math.cos(z);  rz.m[1][2] = 0;             rz.m[1][3] = 0;
    rz.m[2][0] = 0;             rz.m[2][1] = 0;             rz.m[2][2] = 1;             rz.m[2][3] = 0;
    rz.m[3][0] = 0;             rz.m[3][1] = 0;             rz.m[3][2] = 0;             rz.m[3][3] = 1;

    rx.m[0][0] = 1;             rx.m[0][1] = 0;             rx.m[0][2] = 0;             rx.m[0][3] = 0;
    rx.m[1][0] = 0;             rx.m[1][1] = Math.cos(x);   rx.m[1][2] = -Math.sin(x);  rx.m[1][3] = 0;
    rx.m[2][0] = 0;             rx.m[2][1] = Math.sin(x);   rx.m[2][2] =  Math.cos(x);  rx.m[2][3] = 0;
    rx.m[3][0] = 0;             rx.m[3][1] = 0;             rx.m[3][2] = 0;             rx.m[3][3] = 1;

    ry.m[0][0] = Math.cos(y);   ry.m[0][1] = 0;             ry.m[0][2] = -Math.sin(y);  ry.m[0][3] = 0;
    ry.m[1][0] = 0;             ry.m[1][1] = 1;             ry.m[1][2] = 0;             ry.m[1][3] = 0;
    ry.m[2][0] = Math.sin(y);   ry.m[2][1] = 0;             ry.m[2][2] =  Math.cos(y);  ry.m[2][3] = 0;
    ry.m[3][0] = 0;             ry.m[3][1] = 0;             ry.m[3][2] = 0;             ry.m[3][3] = 1;

    this.m = rz.mul(ry.mul(rx)).getM();

    return this;
};

Matrix4f.prototype.initScale = function (x, y, z)
{
    this.m[0][0] = x;    this.m[0][1] = 0;    this.m[0][2] = 0;    this.m[0][3] = 0;
    this.m[1][0] = 0;    this.m[1][1] = y;    this.m[1][2] = 0;    this.m[1][3] = 0;
    this.m[2][0] = 0;    this.m[2][1] = 0;    this.m[2][2] = z;    this.m[2][3] = 0;
    this.m[3][0] = 0;    this.m[3][1] = 0;    this.m[3][2] = 0;    this.m[3][3] = 1;

    return this;
};

Matrix4f.prototype.initProjection = function (fov, width, height, zNear, zFar)
{
    var ar = width / height;
    var tanHalfFOV = Math.tan(Util.toRadians(fov / 2));
    var zRange = zNear - zFar;

    this.m[0][0] = 1.0 / (tanHalfFOV * ar); this.m[0][1] = 0;                   this.m[0][2] = 0;                           this.m[0][3] = 0;
    this.m[1][0] = 0;                       this.m[1][1] = 1.0 / tanHalfFOV;    this.m[1][2] = 0;                           this.m[1][3] = 0;
    this.m[2][0] = 0;                       this.m[2][1] = 0;                   this.m[2][2] = (-zNear - zFar) / zRange;    this.m[2][3] = 2 * zFar * zNear / zRange;
    this.m[3][0] = 0;                       this.m[3][1] = 0;                   this.m[3][2] = 1;    this.m[3][3] = 0;

    return this;
};

Matrix4f.prototype.initCamera = function (forward, up)
{
    var f = forward;
    f.normalize();

    var r = up;
    r.normalize();
    r = r.cross(f);

    var u = f.cross(r);
    
    this.m[0][0] = r.getX();    this.m[0][1] = r.getY();    this.m[0][2] = r.getZ();    this.m[0][3] = 0;
    this.m[1][0] = u.getX();    this.m[1][1] = u.getY();    this.m[1][2] = u.getZ();    this.m[1][3] = 0;
    this.m[2][0] = f.getX();    this.m[2][1] = f.getY();    this.m[2][2] = f.getZ();    this.m[2][3] = 0;
    this.m[3][0] = 0;           this.m[3][1] = 0;           this.m[3][2] = 0;           this.m[3][3] = 1;
    
    return this;
};

Matrix4f.prototype.mul = function (r)
{
    var res = new Matrix4f();

    for (var i = 0; i < 4; i++)
    {
        for (var j = 0; j < 4; j++)
        {
            res.set(i, j, this.m[i][0] * r.get(0, j) +
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