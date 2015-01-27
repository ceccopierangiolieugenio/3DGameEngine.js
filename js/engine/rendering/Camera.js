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
    this.mouselooked = false;
    this.centerPosition = new Vector2f(Window.getWidth() / 2, Window.getHeight() / 2);
    this.pos = new Vector3f(0, 0, 0);
    this.forward = new Vector3f(0, 0, 1).normalized();
    this.up = new Vector3f(0, 1, 0).normalized();
    this.projection = new Matrix4f().initPerspective(fov, aspect, zNear, zFar);
}

Camera.prototype.getViewProjection = function ()
{
    var cameraRotation = new Matrix4f().initRotation(this.forward, this.up);
    var cameraTranslation = new Matrix4f().initTranslation(-this.pos.getX(), -this.pos.getY(), -this.pos.getZ());
    
    return this.projection.mul(cameraRotation.mul(cameraTranslation));
};

Camera.prototype.input = function (delta)
{
    var sensitivity = 0.5;
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
        this.move(this.getForward(), movAmt);
    if (Input.getKey(Input.KEY_S))
        this.move(this.getForward(), -movAmt);
    if (Input.getKey(Input.KEY_A))
        this.move(this.getLeft(), movAmt);
    if (Input.getKey(Input.KEY_D))
        this.move(this.getRight(), movAmt);

    if (this.mouseLocked)
    {
        var deltaPos = Input.getMousePosition().sub(this.centerPosition);

        var rotY = deltaPos.getX() !== 0;
        var rotX = deltaPos.getY() !== 0;

        if (rotY)
            this.rotateY(Util.toRadians(deltaPos.getX() * sensitivity));
        if (rotX)
            this.rotateX(Util.toRadians(deltaPos.getY() * sensitivity));

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
    this.pos = this.pos.add(dir.mul(amt));
};

Camera.prototype.rotateY = function (angle)
{
    var Haxis = this.yAxis.cross(this.forward).normalized();

    this.forward = this.forward.rotate(angle, this.yAxis).normalized();

    this.up = this.forward.cross(Haxis).normalized();
};

Camera.prototype.rotateX = function (angle)
{
    var Haxis = this.yAxis.cross(this.forward).normalized();

    this.forward = this.forward.rotate(angle, Haxis).normalized();

    this.up = this.forward.cross(Haxis).normalized();
};

Camera.prototype.getLeft = function ()
{
    return this.forward.cross(this.up).normalized();
};

Camera.prototype.getRight = function ()
{
    return this.up.cross(this.forward).normalized();
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

