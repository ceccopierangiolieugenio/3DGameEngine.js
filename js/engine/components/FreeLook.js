/* 
 * Copyright 2015 Eugenio Parodi <ceccopierangiolieugenio at googlemail>.
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

function FreeLook(sensitivity, unlockMouseKey)
{
    this.sensitivity = sensitivity;
    this.unlockMouseKey = unlockMouseKey === undefined ? Input.KEY_ESCAPE : unlockMouseKey;
    this.mouseLocked = false;
    this.yAxis = new Vector3f(0, 1, 0);
}
OO.extends(FreeLook, GameComponent);

FreeLook.prototype.input = function (delta)
{
    var centerPosition = new Vector2f(Window.getWidth() / 2, Window.getHeight() / 2);

    if (Input.getKey(this.unlockMouseKey))
    {
        Input.setCursor(true);
        this.mouseLocked = false;
    }
    if (Input.getMouseDown(1))
    {
        Input.setMousePosition(centerPosition);
        Input.setCursor(false);
        this.mouseLocked = true;
    }

    if (this.mouseLocked)
    {
        var deltaPos = Input.getMousePosition().sub(centerPosition);

        var rotY = deltaPos.getX() !== 0;
        var rotX = deltaPos.getY() !== 0;

        if (rotY)
            this.getTransform().rotate(this.yAxis, Util.toRadians(deltaPos.getX() * this.sensitivity));

        if (rotX)
            this.getTransform().rotate(this.getTransform().getRot().getRight(), Util.toRadians(deltaPos.getY() * this.sensitivity));

        if (rotY || rotX)
            Input.setMousePosition(new Vector2f(Window.getWidth() / 2, Window.getHeight() / 2));
    }
};


