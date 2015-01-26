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

function Transform() {
    this.pos = new Vector3f(0, 0, 0);
    this.rot = new Vector3f(0, 0, 0);
    this.scale = new Vector3f(1, 1, 1);
}

Transform.prototype.getTransformation = function ()
{
    var translationMatrix = new Matrix4f().initTranslation(this.pos.getX(), this.pos.getY(), this.pos.getZ());
    var rotationMatrix = new Matrix4f().initRotation(this.rot.getX(), this.rot.getY(), this.rot.getZ());
    var scaleMatrix = new Matrix4f().initScale(this.scale.getX(), this.scale.getY(), this.scale.getZ());

    return translationMatrix.mul(rotationMatrix.mul(scaleMatrix));
};

Transform.prototype.getPos = function ()
{
    return this.pos;
};

Transform.prototype.setPos = function (rx, y, z)
{
    if (y === undefined)
        this.pos = rx;
    if (y !== undefined && z !== undefined)
        this.pos = new Vector3f(rx, y, z);
};

Transform.prototype.getRot = function ()
{
    return this.rot;
};

Transform.prototype.setRot = function (rx, y, z)
{
    if (y === undefined)
        this.rot = rx;
    if (y !== undefined && z !== undefined)
        this.rot = new Vector3f(rx, y, z);
};

Transform.prototype.getScale = function ()
{
    return this.scale;
};

Transform.prototype.setScale = function (rx, y, z)
{
    if (y === undefined)
        this.scale = rx;
    if (y !== undefined && z !== undefined)
        this.scale = new Vector3f(rx, y, z);
};
