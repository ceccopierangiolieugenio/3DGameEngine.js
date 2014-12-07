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

var ResourceLoader = ResourceLoader || {};

ResourceLoader.loadTexture = function(imageName)
{
    var textureId = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureId);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Util.images[imageName]);
    /* OpenGL ES 2.0.24 spec section 3.8.2 */
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    return new Texture(textureId);
};

ResourceLoader.loadShader = function (id)
{
    return Util.files[id];
};

ResourceLoader.loadMesh = function (id)
{
    if (id.match("\.obj$") == "\.obj") {

        var vertices = [];
        var indices = [];
        var textCoords = [];

        var lines = Util.files[id].split("\n");
        for (var i = 0; i < lines.length; i++)
        {
            var line = lines[i];
            var tokens = line.split(" ");

            tokens = Util.removeEmptyStrings(tokens);
            if (tokens.length === 0 || tokens[0] === "#")
                continue;
            else if (tokens[0] === "v")
            {
                vertices.push(new Vertex(new Vector3f(
                        parseFloat(tokens[1]),
                        parseFloat(tokens[2]),
                        parseFloat(tokens[3]))));
            }
            else if (tokens[0] === "vt")
            {
                /* TODO: At the current stage of the Tutorial
                 * it is not possible to use this information (vt)
                 * because the texture coordinate should not be
                 * included in the Vertex object but int the face definition.
                 */
                textCoords.push(new Vector2f(
                        parseFloat(tokens[1]),
                        parseFloat(tokens[2])));
            }
            else if (tokens[0] === "f")
            {
                indices.push(parseInt(tokens[1].split("/")[0]) - 1);
                indices.push(parseInt(tokens[2].split("/")[0]) - 1);
                indices.push(parseInt(tokens[3].split("/")[0]) - 1);
                
                if (tokens.length > 4)
                {
                    indices.push(parseInt(tokens[1].split("/")[0]) - 1);
                    indices.push(parseInt(tokens[3].split("/")[0]) - 1);
                    indices.push(parseInt(tokens[4].split("/")[0]) - 1);
                }
            }
        }
        var res = new Mesh();
        res.addVertices(vertices, indices, true);
        
        return res;
    } else {
        throw new Error("Error: File format not supported for mesh data: " + id);
    }

};

