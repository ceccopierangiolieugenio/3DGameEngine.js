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

function Quaternion(x, y, z, w)
{
    if (x === undefined) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;
    } else {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}

Quaternion.prototype.initRotation = function (axis, angle)
{
    var sinHalfAngle = Math.sin(angle / 2);
    var cosHalfAngle = Math.cos(angle / 2);

    this.x = axis.getX() * sinHalfAngle;
    this.y = axis.getY() * sinHalfAngle;
    this.z = axis.getZ() * sinHalfAngle;
    this.w = cosHalfAngle;

    return this;
};

Quaternion.prototype.length = function ()
{
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
};

Quaternion.prototype.normalized = function ()
{
    var length = this.length();

    return new Quaternion(this.x / length, this.y / length, this.z / length, this.w / length);
};

Quaternion.prototype.conjugate = function ()
{
    return new Quaternion(-this.x, -this.y, -this.z, this.w);
};

Quaternion.prototype.mul = function (r)
{
    if (r instanceof Quaternion) {
        var w_ = this.w * r.getW() - this.x * r.getX() - this.y * r.getY() - this.z * r.getZ();
        var x_ = this.x * r.getW() + this.w * r.getX() + this.y * r.getZ() - this.z * r.getY();
        var y_ = this.y * r.getW() + this.w * r.getY() + this.z * r.getX() - this.x * r.getZ();
        var z_ = this.z * r.getW() + this.w * r.getZ() + this.x * r.getY() - this.y * r.getX();
        return new Quaternion(x_, y_, z_, w_);
    }
    if (r instanceof Vector3f) {
        var w_ = -this.x * r.getX() - this.y * r.getY() - this.z * r.getZ();
        var x_ = this.w * r.getX() + this.y * r.getZ() - this.z * r.getY();
        var y_ = this.w * r.getY() + this.z * r.getX() - this.x * r.getZ();
        var z_ = this.w * r.getZ() + this.x * r.getY() - this.y * r.getX();
        return new Quaternion(x_, y_, z_, w_);
    }
};

Quaternion.prototype.toRotationMatrix = function ()
{
    return new Matrix4f().initRotation(this.getForward(), this.getUp(), this.getRight());
};

Quaternion.prototype.getForward = function ()
{
    return new Vector3f(2.0 * (this.x * this.z - this.w * this.y), 2.0 * (this.y * this.z + this.w * this.x), 1.0 - 2.0 * (this.x * this.x + this.y * this.y));
};

Quaternion.prototype.getBack = function ()
{
    return new Vector3f(-2.0 * (this.x * this.z - this.w * this.y), -2.0 * (this.y * this.z + this.w * this.x), -(1.0 - 2.0 * (this.x * this.x + this.y * this.y)));
};

Quaternion.prototype.getUp = function ()
{
    return new Vector3f(2.0 * (this.x * this.y + this.w * this.z), 1.0 - 2.0 * (this.x * this.x + this.z * this.z), 2.0 * (this.y * this.z - this.w * this.x));
};

Quaternion.prototype.getDown = function ()
{
    return new Vector3f(-2.0 * (this.x * this.y + this.w * this.z), -(1.0 - 2.0 * (this.x * this.x + this.z * this.z)), -2.0 * (this.y * this.z - this.w * this.x));
};

Quaternion.prototype.getRight = function ()
{
    return new Vector3f(1.0 - 2.0 * (this.y * this.y + this.z * this.z), 2.0 * (this.x * this.y - this.w * this.z), 2.0 * (this.x * this.z + this.w * this.y));
};

Quaternion.prototype.getLeft = function ()
{
    return new Vector3f(-(1.0 - 2.0 * (this.y * this.y + this.z * this.z)), -2.0 * (this.x * this.y - this.w * this.z), -2.0 * (this.x * this.z + this.w * this.y));
};

Quaternion.prototype.getX = function ()
{
    return this.x;
};

Quaternion.prototype.setX = function (x)
{
    this.x = x;
};

Quaternion.prototype.getY = function ()
{
    return this.y;
};

Quaternion.prototype.setY = function (y)
{
    this.y = y;
};

Quaternion.prototype.getZ = function ()
{
    return this.z;
};

Quaternion.prototype.setZ = function (z)
{
    this.z = z;
};

Quaternion.prototype.getW = function ()
{
    return this.w;
};

Quaternion.prototype.setW = function (w)
{
    this.w = w;
};