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
}

Transform.prototype.getTransformation = function ()
{
     var translationMatrix = new Matrix4f().initTranslation(this.translation.getX(), this.translation.getY(), this.translation.getZ());
     var rotationMatrix = new Matrix4f().initRotation(this.rotation.getX(), this.rotation.getY(), this.rotation.getZ());
     
     return translationMatrix.mul(rotationMatrix);
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
