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

function Texture(fileName)
{
    this.fileName = fileName;
    var oldResource = Texture.loadedTextures[this.fileName];

    if (oldResource !== undefined)
    {
        this.resource = oldResource;
        this.resource.addReference();
    }
    else
    {
        this.resource = new TextureResource(this.loadTexture(this.fileName));
        Texture.loadedTextures[this.fileName] = this.resource;
    }
}

Texture.loadedTextures = {};

Texture.prototype.finalize = function ()
{
    if (this.resource.removeReference() && this.fileName !== undefined)
    {
        delete Texture.loadedTextures[this.fileName];
    }
};

Texture.prototype.bind = function ()
{
    gl.bindTexture(gl.TEXTURE_2D, this.resource.getId());
};

Texture.prototype.getId = function ()
{
    return this.resource.getId();
};

Texture.prototype.loadTexture = function (imageName)
{
    this.id = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.id);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Loader.images[imageName]);

    return this.id;
};