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

function Quaternion(_a, _b, _c, _d) {
    if (typeof _a === 'number' && typeof _b === 'number' && typeof _c === 'number' && typeof _d === 'number') {
        this.x = _a;
        this.y = _b;
        this.z = _c;
        this.w = _d;
    } else if (_a instanceof Vector3f && typeof _b === 'number' && typeof _c === 'undefined' && typeof _d === 'undefined') {
        var axis = _a;
        var angle = _b;
        var sinHalfAngle = Math.sin(angle / 2);
        var cosHalfAngle = Math.cos(angle / 2);

        this.x = axis.getX() * sinHalfAngle;
        this.y = axis.getY() * sinHalfAngle;
        this.z = axis.getZ() * sinHalfAngle;
        this.w = cosHalfAngle;
    } else if (_a instanceof Matrix4f) {
        var rot = _a;
        var trace = rot.get(0, 0) + rot.get(1, 1) + rot.get(2, 2);

        if (trace > 0)
        {
            var s = 0.5 / Math.sqrt(trace + 1.0);
            this.w = 0.25 / s;
            this.x = (rot.get(1, 2) - rot.get(2, 1)) * s;
            this.y = (rot.get(2, 0) - rot.get(0, 2)) * s;
            this.z = (rot.get(0, 1) - rot.get(1, 0)) * s;
        }
        else
        {
            if (rot.get(0, 0) > rot.get(1, 1) && rot.get(0, 0) > rot.get(2, 2))
            {
                var s = 2.0 * Math.sqrt(1.0 + rot.get(0, 0) - rot.get(1, 1) - rot.get(2, 2));
                this.w = (rot.get(1, 2) - rot.get(2, 1)) / s;
                this.x = 0.25 * s;
                this.y = (rot.get(1, 0) + rot.get(0, 1)) / s;
                this.z = (rot.get(2, 0) + rot.get(0, 2)) / s;
            }
            else if (rot.get(1, 1) > rot.get(2, 2))
            {
                var s = 2.0 * Math.sqrt(1.0 + rot.get(1, 1) - rot.get(0, 0) - rot.get(2, 2));
                this.w = (rot.get(2, 0) - rot.get(0, 2)) / s;
                this.x = (rot.get(1, 0) + rot.get(0, 1)) / s;
                this.y = 0.25 * s;
                this.z = (rot.get(2, 1) + rot.get(1, 2)) / s;
            }
            else
            {
                var s = 2.0 * Math.sqrt(1.0 + rot.get(2, 2) - rot.get(0, 0) - rot.get(1, 1));
                this.w = (rot.get(0, 1) - rot.get(1, 0)) / s;
                this.x = (rot.get(2, 0) + rot.get(0, 2)) / s;
                this.y = (rot.get(1, 2) + rot.get(2, 1)) / s;
                this.z = 0.25 * s;
            }
        }

        var length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        this.x /= length;
        this.y /= length;
        this.z /= length;
        this.w /= length;
    }
}

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
    if (typeof r === 'number') {
        return new Quaternion(this.x * r, this.y * r, this.z * r, this.w * r);
    }
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

Quaternion.prototype.sub = function (r)
{
    return new Quaternion(this.x - r.getX(), this.y - r.getY(), this.z - r.getZ(), this.w - r.getW());
};

Quaternion.prototype.add = function (r)
{
    return new Quaternion(this.x + r.getX(), this.y + r.getY(), this.z + r.getZ(), this.w + r.getW());
};

Quaternion.prototype.toRotationMatrix = function ()
{
    var forward = new Vector3f(2.0 * (this.x * this.z - this.w * this.y), 2.0 * (this.y * this.z + this.w * this.x), 1.0 - 2.0 * (this.x * this.x + this.y * this.y));
    var up = new Vector3f(2.0 * (this.x * this.y + this.w * this.z), 1.0 - 2.0 * (this.x * this.x + this.z * this.z), 2.0 * (this.y * this.z - this.w * this.x));
    var right = new Vector3f(1.0 - 2.0 * (this.y * this.y + this.z * this.z), 2.0 * (this.x * this.y - this.w * this.z), 2.0 * (this.x * this.z + this.w * this.y));
    return new Matrix4f().initRotation(forward, up, right);
};


Quaternion.prototype.dot = function (r)
{
    return this.x * r.getX() + this.y * r.getY() + this.z * r.getZ() + this.w * r.getW();
};

Quaternion.prototype.nlerp = function (dest, lerpFactor, shortest)
{
    var correctedDest = dest;

    if (shortest && this.dot(dest) < 0)
        correctedDest = new Quaternion(-dest.getX(), -dest.getY(), -dest.getZ(), -dest.getW());

    return correctedDest.sub(this).mul(lerpFactor).add(this).normalized();
};

Quaternion.prototype.slerp = function (dest, lerpFactor, shortest)
{
    var EPSILON = 1000.0;

    var cos = this.dot(dest);
    var correctedDest = dest;

    if (shortest && cos < 0)
    {
        cos = -cos;
        correctedDest = new Quaternion(-dest.getX(), -dest.getY(), -dest.getZ(), -dest.getW());
    }

    if (Math.abs(cos) >= 1 - EPSILON)
        return this.nlerp(correctedDest, lerpFactor, false);

    var sin = Math.sqrt(1.0 - cos * cos);
    var angle = Math.atan2(sin, cos);
    var invSin = 1.0 / sin;

    var srcFactor = Math.sin((1.0 - lerpFactor) * angle) * invSin;
    var destFactor = Math.sin((lerpFactor) * angle) * invSin;

    return this.mul(srcFactor).add(correctedDest.mul(destFactor));
};

Quaternion.prototype.getForward = function ()
{
    return new Vector3f(0, 0, 1).rotate(this);
};

Quaternion.prototype.getBack = function ()
{
    return new Vector3f(0, 0, -1).rotate(this);
};

Quaternion.prototype.getUp = function ()
{
    return new Vector3f(0, 1, 0).rotate(this);
};

Quaternion.prototype.getDown = function ()
{
    return new Vector3f(0, -1, 0).rotate(this);
};

Quaternion.prototype.getRight = function ()
{
    return new Vector3f(1, 0, 0).rotate(this);
};

Quaternion.prototype.getLeft = function ()
{
    return new Vector3f(-1, 0, 0).rotate(this);
};

Quaternion.prototype.set = function (_a, _b, _c, _d)
{
    if (typeof _a === 'number' && typeof _b === 'number' && typeof _c === 'number' && typeof _d === 'number') {
        this.x = _a;
        this.y = _b;
        this.z = _c;
        this.w = _d;
        return this;
    }
    if (_a instanceof Quaternion && typeof _b === 'undefined' && typeof _c === 'undefined' && typeof _d === 'undefined') {
        var r = _a;
        this.set(r.getX(), r.getY(), r.getZ(), r.getW());
        return this;
    }
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

Quaternion.prototype.equals = function (r)
{
    return this.x === r.getX() && this.y === r.getY() && this.z === r.getZ() && this.w === r.getW();
};
