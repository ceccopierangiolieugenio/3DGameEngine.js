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
    this.rot = new Quaternion(0, 0, 0, 1);
    this.scale = new Vector3f(1, 1, 1);

    this.parentMatrix = new Matrix4f().initIdentity();
}

Transform.prototype.update = function ()
{
    if (this.oldPos !== undefined) {
        this.oldPos.set(this.pos);
        this.oldRot.set(this.rot);
        this.oldScale.set(this.scale);
    } else {
        this.oldPos = new Vector3f(0, 0, 0).set(this.pos).add(1);
        this.oldRot = new Quaternion(0, 0, 0, 0).set(this.rot).mul(0.5);
        this.oldScale = new Vector3f(0, 0, 0).set(this.scale).add(1);
    }
};

Transform.prototype.rotate = function (axis, angle)
{
    this.rot = new Quaternion(axis, angle).mul(this.rot).normalized();
};

Transform.prototype.lookAt = function (point, up)
{
    this.rot = this.getLookAtRotation(point, up);
};

Transform.prototype.getLookAtRotation = function (point, up)
{
    return new Quaternion(new Matrix4f().initRotation(point.sub(this.pos).normalized(), up));
};

Transform.prototype.hasChanged = function ()
{
    if (this.parent !== undefined && this.parent.hasChanged())
        return true;

    if (!this.pos.equals(this.oldPos))
        return true;

    if (!this.rot.equals(this.oldRot))
        return true;

    if (!this.scale.equals(this.oldScale))
        return true;

    return false;
};

Transform.prototype.getTransformation = function ()
{
    var translationMatrix = new Matrix4f().initTranslation(this.pos.getX(), this.pos.getY(), this.pos.getZ());
    var rotationMatrix = this.rot.toRotationMatrix();
    var scaleMatrix = new Matrix4f().initScale(this.scale.getX(), this.scale.getY(), this.scale.getZ());

    return this.getParentMatrix().mul(translationMatrix.mul(rotationMatrix.mul(scaleMatrix)));
};

Transform.prototype.getParentMatrix = function ()
{
    if (this.parent !== undefined && this.parent.hasChanged())
        this.parentMatrix = this.parent.getTransformation();

    return this.parentMatrix;
};

Transform.prototype.setParent = function (parent)
{
    this.parent = parent;
};

Transform.prototype.getTransformedPos = function ()
{
    return this.getParentMatrix().transform(this.pos);
};

Transform.prototype.getTransformedRot = function ()
{
    var parentRotation = new Quaternion(0, 0, 0, 1);

    if (this.parent !== undefined)
        parentRotation = this.parent.getTransformedRot();

    return parentRotation.mul(this.rot);
};

Transform.prototype.getPos = function ()
{
    return this.pos;
};

Transform.prototype.setPos = function (pos)
{
    this.pos = pos;
};

Transform.prototype.getRot = function ()
{
    return this.rot;
};

Transform.prototype.setRot = function (rot)
{
    this.rot = rot;
};

Transform.prototype.getScale = function ()
{
    return this.scale;
};

Transform.prototype.setScale = function (scale)
{
    this.scale = scale;
};
