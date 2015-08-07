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

function FreeMove(speed, forwardKey, backKey, leftKey, rightKey)
{
    this.speed = speed;
    this.forwardKey = forwardKey === undefined ? Input.KEY_W : forwardKey;
    this.backKey = backKey === undefined ? Input.KEY_S : backKey;
    this.leftKey = leftKey === undefined ? Input.KEY_A : leftKey;
    this.rightKey = rightKey === undefined ? Input.KEY_D : rightKey;
}
OO.extends(FreeMove, GameComponent);

FreeMove.prototype.input = function (delta)
{
    var movAmt = this.speed * delta;

    if (Input.getKey(this.forwardKey))
        this.move(this.getTransform().getRot().getForward(), movAmt);
    if (Input.getKey(this.backKey))
        this.move(this.getTransform().getRot().getForward(), -movAmt);
    if (Input.getKey(this.leftKey))
        this.move(this.getTransform().getRot().getLeft(), movAmt);
    if (Input.getKey(this.rightKey))
        this.move(this.getTransform().getRot().getRight(), movAmt);
};

FreeMove.prototype.move = function (dir, amt)
{
    this.getTransform().setPos(this.getTransform().getPos().add(dir.mul(amt)));
};
