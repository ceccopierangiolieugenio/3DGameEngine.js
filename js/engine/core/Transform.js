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
    this.translation = new Vector3f(0, 0, 0);
    this.rotation = new Vector3f(0, 0, 0);
    this.scale = new Vector3f(1, 1, 1);
}

Transform.camera = null;

Transform.zNear = 0;
Transform.zFar = 0;
Transform.width = 0;
Transform.height = 0;
Transform.fov = 0;

Transform.prototype.getTransformation = function ()
{
    var translationMatrix = new Matrix4f().initTranslation(this.translation.getX(), this.translation.getY(), this.translation.getZ());
    var rotationMatrix = new Matrix4f().initRotation(this.rotation.getX(), this.rotation.getY(), this.rotation.getZ());
    var scaleMatrix = new Matrix4f().initScale(this.scale.getX(), this.scale.getY(), this.scale.getZ());

    return translationMatrix.mul(rotationMatrix.mul(scaleMatrix));
};

Transform.prototype.getProjectedTransformation = function ()
{
    var transformationMatrix = this.getTransformation();
    var projectionMatrix = new Matrix4f().initProjection(Transform.fov, Transform.width, Transform.height, Transform.zNear, Transform.zFar);

    var cameraRotation = new Matrix4f().initCamera(Transform.camera.getForward(), Transform.camera.getUp());
    var cameraTranslation = new Matrix4f().initTranslation(-Transform.camera.getPos().getX(), -Transform.camera.getPos().getY(), -Transform.camera.getPos().getZ());

    //return projectionMatrix.mul(transformationMatrix);
    return projectionMatrix.mul(cameraRotation.mul(cameraTranslation.mul(transformationMatrix)));
};

Transform.setProjection = function (fov, width, height, zNear, zFar)
{
    Transform.fov = fov;
    Transform.width = width;
    Transform.height = height;
    Transform.zNear = zNear;
    Transform.zFar = zFar;
};

Transform.prototype.getTranslation = function ()
{
    return this.translation;
};

Transform.prototype.setTranslation = function (rx, y, z)
{
    if (y === undefined)
        this.translation = rx;
    if (y !== undefined && z !== undefined)
        this.translation = new Vector3f(rx, y, z);
};

Transform.prototype.getRotation = function ()
{
    return this.rotation;
};

Transform.prototype.setRotation = function (rx, y, z)
{
    if (y === undefined)
        this.rotation = rx;
    if (y !== undefined && z !== undefined)
        this.rotation = new Vector3f(rx, y, z);
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

Transform.getCamera = function()
{
    return Transform.camera;
};

Transform.setCamera = function(camera)
{
    Transform.camera = camera;
};