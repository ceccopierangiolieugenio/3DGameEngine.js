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

function TextureResource(id)
{
    this.id = id;
    this.refCount = 1;
}

TextureResource.prototype.finalize = function ()
{
    gl.deleteBuffers(this.id);
};

TextureResource.prototype.addReference = function ()
{
    this.refCount++;
};

TextureResource.prototype.removeReference = function ()
{
    this.refCount--;
    return this.refCount === 0;
};

TextureResource.prototype.getId = function () { return this.id; };
