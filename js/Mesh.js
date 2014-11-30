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

function Mesh() {
    this.vbo = gl.createBuffer();
    this.ibo = gl.createBuffer();
    this.size = 0;
    /* NOTE (Eugenio): Addition to fix a problem with the Shader Attrib */
    this.shader = null;
}

Mesh.prototype.addVertices = function (vertices, indices)
{
    this.size = indices.length;    

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, Util.Vertices2Float32Array(vertices), gl.STATIC_DRAW);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
};

Mesh.prototype.draw = function ()
{
    /* NOTE (Eugenio): Addition to fix a problem with the Shader Attrib */
    var positionLocation = this.shader.getAttribLocation("position");
    var texCoordLocation = this.shader.getAttribLocation("texCoord");
    gl.enableVertexAttribArray(positionLocation);
    gl.enableVertexAttribArray(texCoordLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, Vertex.SIZE * 4, 0);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, Vertex.SIZE * 4, 12);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    gl.drawElements(gl.TRIANGLES, this.size, gl.UNSIGNED_SHORT, 0);

    gl.disableVertexAttribArray(positionLocation);
    gl.disableVertexAttribArray(texCoordLocation);
};

/* NOTE (Eugenio): Addition to fix a problem with the Shader Attrib */
Mesh.prototype.setShader = function(shader)
{
    this.shader = shader;
};

/* NOTE (Eugenio): Addition to fix a problem with the Shader Attrib */
Mesh.prototype.getShader = function()
{
    return this.shader;
};