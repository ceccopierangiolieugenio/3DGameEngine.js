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

function Camera(fov, aspect, zNear, zFar)
{
    this.mouseLocked = false;
    this.projection = new Matrix4f().initPerspective(fov, aspect, zNear, zFar);
}
OO.extends(Camera, GameComponent);

Camera.prototype.getViewProjection = function ()
{
    var cameraRotation = this.getTransform().getTransformedRot().conjugate().toRotationMatrix();
    var cameraPos = this.getTransform().getTransformedPos().mul(-1);

    var cameraTranslation = new Matrix4f().initTranslation(cameraPos.getX(), cameraPos.getY(), cameraPos.getZ());

    return this.projection.mul(cameraRotation.mul(cameraTranslation));
};

Camera.prototype.addToEngine = function (engine)
{
    engine.getRenderingEngine().addCamera(this);
};
