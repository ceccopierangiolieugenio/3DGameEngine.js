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

Matrix4f.prototype.initRotation = function (_a, _b, _c)
{
    if (typeof _a === 'number' && typeof _b === 'number' && typeof _c === 'number') {
        var x = _a;
        var y = _b;
        var z = _c;
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
    } else if (_a instanceof Vector3f && _b instanceof Vector3f && _c === undefined) {
        var forward = _a;
        var up = _b;
        var f = forward.normalized();

        var r = up.normalized();
        r = r.cross(f);

        var u = f.cross(r);
        return this.initRotation(f, u, r);
    } else if (_a instanceof Vector3f && _b instanceof Vector3f && _c instanceof Vector3f) {
        var f = _a;
        var r = _c;
        var u = _b;
        
        this.m[0][0] = r.getX();    this.m[0][1] = r.getY();    this.m[0][2] = r.getZ();    this.m[0][3] = 0;
        this.m[1][0] = u.getX();    this.m[1][1] = u.getY();    this.m[1][2] = u.getZ();    this.m[1][3] = 0;
        this.m[2][0] = f.getX();    this.m[2][1] = f.getY();    this.m[2][2] = f.getZ();    this.m[2][3] = 0;
        this.m[3][0] = 0;           this.m[3][1] = 0;           this.m[3][2] = 0;           this.m[3][3] = 1;
    
        return this;
    }
};

Matrix4f.prototype.initScale = function (x, y, z)
{
    this.m[0][0] = x;    this.m[0][1] = 0;    this.m[0][2] = 0;    this.m[0][3] = 0;
    this.m[1][0] = 0;    this.m[1][1] = y;    this.m[1][2] = 0;    this.m[1][3] = 0;
    this.m[2][0] = 0;    this.m[2][1] = 0;    this.m[2][2] = z;    this.m[2][3] = 0;
    this.m[3][0] = 0;    this.m[3][1] = 0;    this.m[3][2] = 0;    this.m[3][3] = 1;

    return this;
};

Matrix4f.prototype.initPerspective = function (fov, aspectRatio, zNear, zFar)
{
    var tanHalfFOV = Math.tan(fov / 2);
    var zRange = zNear - zFar;

    this.m[0][0] = 1.0 / (tanHalfFOV * aspectRatio);    this.m[0][1] = 0;                   this.m[0][2] = 0;                           this.m[0][3] = 0;
    this.m[1][0] = 0;                                   this.m[1][1] = 1.0 / tanHalfFOV;    this.m[1][2] = 0;                           this.m[1][3] = 0;
    this.m[2][0] = 0;                                   this.m[2][1] = 0;                   this.m[2][2] = (-zNear - zFar) / zRange;    this.m[2][3] = 2 * zFar * zNear / zRange;
    this.m[3][0] = 0;                                   this.m[3][1] = 0;                   this.m[3][2] = 1;                           this.m[3][3] = 0;

    return this;
};

Matrix4f.prototype.initOrthographc = function (left, right, bottom, top, near, far)
{
    var width = right - left;
    var height = top - bottom;
    var depth = far - near;

    this.m[0][0] = 2/width; this.m[0][1] = 0;       this.m[0][2] = 0;       this.m[0][3] = -(right + left)/width;
    this.m[1][0] = 0;       this.m[1][1] = 2/height;this.m[1][2] = 0;       this.m[1][3] = -(top + bottom)/height;
    this.m[2][0] = 0;       this.m[2][1] = 0;       this.m[2][2] = 2/depth; this.m[2][3] = -(far + near)/depth;
    this.m[3][0] = 0;       this.m[3][1] = 0;       this.m[3][2] = 0;       this.m[3][3] = 1;

    return this;
};

Matrix4f.prototype.transform = function (r)
{
    return new Vector3f(this.m[0][0] * r.getX() + this.m[0][1] * r.getY() + this.m[0][2] * r.getZ() + this.m[0][3],
                        this.m[1][0] * r.getX() + this.m[1][1] * r.getY() + this.m[1][2] * r.getZ() + this.m[1][3],
                        this.m[2][0] * r.getX() + this.m[2][1] * r.getY() + this.m[2][2] * r.getZ() + this.m[2][3]);
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
    var res = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            res[i][j] = this.m[i][j];

    return res;
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