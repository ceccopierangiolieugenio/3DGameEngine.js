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

function Mesh(arg0, indices, calcNormals) {
    if (indices === undefined && calcNormals === undefined) {
        var fileName = arg0;
        this.initMeshData();
        this.loadMesh(filename);
    } else {
        var vertices = arg0;
        if (calcNormals === undefined) {
            calcNormals = false;
        }
        this.initMeshData();
        this.addVertices(vertices,indices,calcNormals);
    }
}

Mesh.prototype.initMeshData = function ()
{
    this.vbo = gl.createBuffer();
    this.ibo = gl.createBuffer();
    this.size = 0;
    /* NOTE (Eugenio): Addition to fix a problem with the Shader Attrib */
    this.shader = null;
};

Mesh.prototype.addVertices = function (vertices, indices, calcNormals)
{
    if (calcNormals)
    {
        this.calcNormals(vertices, indices);
    }
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
    var normalLocation = this.shader.getAttribLocation("normal");
    gl.enableVertexAttribArray(positionLocation);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.enableVertexAttribArray(normalLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, Vertex.SIZE * 4, 0);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, Vertex.SIZE * 4, 12);
    gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, Vertex.SIZE * 4, 20);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    gl.drawElements(gl.TRIANGLES, this.size, gl.UNSIGNED_SHORT, 0);

    gl.disableVertexAttribArray(positionLocation);
    gl.disableVertexAttribArray(texCoordLocation);
    gl.disableVertexAttribArray(normalLocation);
};

Mesh.prototype.calcNormals = function (vertices, indices)
{
    for (var i = 0; i < indices.length; i += 3)
    {
        var i0 = indices[i];
        var i1 = indices[i + 1];
        var i2 = indices[i + 2];

        var v1 = vertices[i1].getPos().sub(vertices[i0].getPos());
        var v2 = vertices[i2].getPos().sub(vertices[i0].getPos());

        var normal = v1.cross(v2).normalized();

        vertices[i0].setNormal(vertices[i0].getNormal().add(normal));
        vertices[i1].setNormal(vertices[i1].getNormal().add(normal));
        vertices[i2].setNormal(vertices[i2].getNormal().add(normal));
    }

    for (var i = 0; i < vertices.length; i++)
        vertices[i].setNormal(vertices[i].getNormal().normalized());
};

Mesh.prototype.loadMesh = function (id)
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