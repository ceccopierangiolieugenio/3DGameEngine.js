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

function Vector3f(x, y, z)
{
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}
;

Vector3f.prototype.length = function ()
{
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
}

Vector3f.prototype.dot = function (r)
{
    return this.x * r.getX() + this.y * r.getY() + this.z * r.getZ();
};

Vector3f.prototype.cross = function (r)
{
    var _x = this.y * r.getZ() - this.z * r.getY();
    var _y = this.z * r.getX() - this.x * r.getZ();
    var _z = this.x * r.getY() - this.y * r.getX();

    return new Vector3f(_x, _y, _z);
};

Vector3f.prototype.normalize = function ()
{
    var length = this.length();

    this.x /= length;
    this.y /= length;
    this.z /= length;

    return this;
};

Vector3f.prototype.rotate = function (angle, axis)
{
    return null
};

Vector3f.prototype.add = function (r)
{
    if (typeof r === 'number') {
        return new Vector3f(this.x + r, this.y + r, this.z + r);
    } else {
        return new Vector3f(this.x + r.getX(), this.y + r.getY(), this.z + r.getZ());
    }
};

Vector3f.prototype.sub = function (r)
{
    if (typeof r === 'number') {
        return new Vector3f(this.x - r, this.y - r, this.z - r);
    } else {
        return new Vector3f(this.x - r.getX(), this.y - r.getY(), this.z - r.getZ());
    }
};

Vector3f.prototype.mul = function (r)
{
    if (typeof r === 'number') {
        return new Vector3f(this.x * r, this.y * r, this.z * r);
    } else {
        return new Vector3f(this.x * r.getX(), this.y * r.getY(), this.z * r.getZ());
    }
};

Vector3f.prototype.div = function (r)
{
    if (typeof r === 'number') {
        return new Vector3f(this.x / r, this.y / r, this.z / r);
    } else {
        return new Vector3f(this.x / r.getX(), this.y / r.getY(), this.z / r.getZ());
    }
};

Vector3f.prototype.toString = function ()
{
    return "(" + this.x + " " + this.y + " " + this.z + ")";
};

Vector3f.prototype.getX = function () {
    return this.x;
};

Vector3f.prototype.setX = function (x) {
    this.x = x || 0;
    ;
};

Vector3f.prototype.getY = function () {
    return this.y;
};

Vector3f.prototype.setY = function (y) {
    this.y = y || 0;
    ;
};

Vector3f.prototype.getZ = function () {
    return this.z;
};

Vector3f.prototype.setZ = function (y) {
    this.z = z || 0;
    ;
};
