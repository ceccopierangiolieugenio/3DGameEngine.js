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

function Camera(pos, forward, up)
{
    this.yAxis = new Vector3f(0, 1, 0);
    if (pos === undefined)
    {
        this.pos = new Vector3f(0, 0, 0);
        this.forward = new Vector3f(0, 0, 0);
        this.up = new Vector3f(0, 0, 0);
    }
    else
    {
        this.pos = pos;
        this.forward = forward;
        this.up = up;

        this.up.normalize();
        this.forward.normalize();
    }
}

Camera.prototype.move = function (dir, amt)
{
    this.pos = this.pos.add(dir.mul(amt));
};

Camera.prototype.rotateY = function (angle)
{
    var Haxis = this.yAxis.cross(this.forward);
    Haxis.normalize();

    this.forward.rotate(angle, this.yAxis);
    this.forward.normalize();

    this.up = this.forward.cross(Haxis);
    this.up.normalize();
};

Camera.prototype.rotateX = function (angle)
{
    var Haxis = this.yAxis.cross(this.forward);
    Haxis.normalize();

    this.forward.rotate(angle, Haxis);
    this.forward.normalize();

    this.up = this.forward.cross(Haxis);
    this.up.normalize();
};

Camera.prototype.getLeft = function ()
{
    var left = this.forward.cross(this.up);
    left.normalize();
    return left;
};

Camera.prototype.getRight = function ()
{
    var right = this.up.cross(this.forward);
    right.normalize();
    return right;
};

Camera.prototype.getPos = function ()
{
    return this.pos;
};

Camera.prototype.setPos = function (pos)
{
    this.pos = pos;
};

Camera.prototype.getForward = function ()
{
    return this.forward;
};

Camera.prototype.setForward = function (forward)
{
    this.forward = forward;
};

Camera.prototype.getUp = function ()
{
    return this.up;
};

Camera.prototype.setUp = function (up)
{
    this.up = up;
};

