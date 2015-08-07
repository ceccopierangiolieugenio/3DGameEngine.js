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


function LookAtComponent() {
}
OO.extends(LookAtComponent, GameComponent);

LookAtComponent.prototype.update = function (delta)
{
    if (this.renderingEngine !== undefined)
    {
        var newRot = this.getTransform().getLookAtRotation(this.renderingEngine.getMainCamera().getTransform().getTransformedPos(),
                new Vector3f(0, 1, 0));
        //getTransform().getRot().getUp());

        this.getTransform().setRot(this.getTransform().getRot().nlerp(newRot, delta * 5.0, true));
        //this.getTransform().setRot(this.getTransform().getRot().slerp(newRot, delta * 5.0, true));
    }
};

LookAtComponent.prototype.render = function (shader, renderingEngine)
{
    this.renderingEngine = renderingEngine;
};
