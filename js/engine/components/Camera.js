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
    this.yAxis = new Vector3f(0, 1, 0);
    this.mouseLocked = false;
    this.centerPosition = new Vector2f(Window.getWidth() / 2, Window.getHeight() / 2);
    this.projection = new Matrix4f().initPerspective(fov, aspect, zNear, zFar);
}
OO.extends(Camera, GameComponent);

Camera.prototype.getViewProjection = function ()
{
    var cameraRotation = this.getTransform().getRot().toRotationMatrix();
    var cameraTranslation = new Matrix4f().initTranslation(-this.getTransform().getPos().getX(), -this.getTransform().getPos().getY(), -this.getTransform().getPos().getZ());

    return this.projection.mul(cameraRotation.mul(cameraTranslation));
};

Camera.prototype.addToRenderingEngine = function (renderingEngine)
{
    renderingEngine.addCamera(this);
};

Camera.prototype.input = function (delta)
{
    var sensitivity = -0.5;
    var movAmt = 10 * delta;
    //var rotAmt = 100 * Time.getDelta();

    if (Input.getKey(Input.KEY_ESCAPE))
    {
        Input.setCursor(true);
        this.mouseLocked = false;
    }
    if (Input.getMouseDown(1))
    {
        Input.setMousePosition(this.centerPosition);
        Input.setCursor(false);
        this.mouseLocked = true;
    }

    if (Input.getKey(Input.KEY_W))
        this.move(this.getTransform().getRot().getForward(), movAmt);
    if (Input.getKey(Input.KEY_S))
        this.move(this.getTransform().getRot().getForward(), -movAmt);
    if (Input.getKey(Input.KEY_A))
        this.move(this.getTransform().getRot().getLeft(), movAmt);
    if (Input.getKey(Input.KEY_D))
        this.move(this.getTransform().getRot().getRight(), movAmt);

    if (this.mouseLocked)
    {
        var deltaPos = Input.getMousePosition().sub(this.centerPosition);

        var rotY = deltaPos.getX() !== 0;
        var rotX = deltaPos.getY() !== 0;

        if (rotY)
            this.getTransform().setRot(this.getTransform().getRot().mul(new Quaternion().initRotation(this.yAxis, Util.toRadians(deltaPos.getX() * sensitivity))).normalized());
        if (rotX)
            this.getTransform().setRot(this.getTransform().getRot().mul(new Quaternion().initRotation(this.getTransform().getRot().getRight(), (Util.toRadians(deltaPos.getY() * sensitivity)))).normalized());

        if (rotY || rotX)
            Input.setMousePosition(new Vector2f(Window.getWidth() / 2, Window.getHeight() / 2));
    }
//    if (Input.getKey(Input.KEY_UP))
//        this.rotateX(-rotAmt);
//    if (Input.getKey(Input.KEY_DOWN))
//        this.rotateX(rotAmt);
//    if (Input.getKey(Input.KEY_LEFT))
//        this.rotateY(-rotAmt);
//    if (Input.getKey(Input.KEY_RIGHT))
//        this.rotateY(rotAmt);
};

Camera.prototype.move = function (dir, amt)
{
    this.getTransform().setPos(this.getTransform().getPos().add(dir.mul(amt)));
};
