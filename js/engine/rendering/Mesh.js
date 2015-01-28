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

function Mesh(_a, _b, _c) {
    /* TODO: 
     *    define a better Mesh Constructor 
     */
    if (typeof _a === 'string' && _b === undefined && _c === undefined) {
        this.fileName = _a;
        var oldResource = Mesh.loadedModels[this.fileName];

        if (oldResource !== undefined)
        {
            this.resource = oldResource;
            this.resource.addReference();
        }
        else
        {
            this.loadMesh(this.fileName);
            Mesh.loadedModels[this.fileName] = this.resource;
        }
        return;
    }
    else
    {
        var vertices = _a;
        var indices = _b;
        var calcNormals = _c;
        if (calcNormals === undefined) {
            calcNormals = false;
        }
        this.fileName = undefined;
        this.addVertices(vertices, indices, calcNormals);
        return;
    }
}

Mesh.loadedModels = {};

Mesh.prototype.finalize = function ()
{
    if (this.resource.removeReference() && this.fileName !== undefined)
    {
        delete this.loadedModels[this.fileName];
    }
};

Mesh.prototype.addVertices = function (vertices, indices, calcNormals)
{
    if (calcNormals)
    {
        this.calcNormals(vertices, indices);
    }
    this.resource = new MeshResource(indices.length);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.resource.getVbo());
    gl.bufferData(gl.ARRAY_BUFFER, Util.Vertices2Float32Array(vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.resource.getIbo());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
};

Mesh.prototype.draw = function ()
{
    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
    gl.enableVertexAttribArray(2);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.resource.getVbo());
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, Vertex.SIZE * 4, 0);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, Vertex.SIZE * 4, 12);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, false, Vertex.SIZE * 4, 20);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.resource.getIbo());
    gl.drawElements(gl.TRIANGLES, this.resource.getSize(), gl.UNSIGNED_SHORT, 0);

    gl.disableVertexAttribArray(0);
    gl.disableVertexAttribArray(1);
    gl.disableVertexAttribArray(2);
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

Mesh.prototype.loadMesh = function (fileName)
{
    if (fileName.match("\.obj$") != "\.obj") {
        throw new Error("Error: File format not supported for mesh data: " + fileName);
    }

    var test = new OBJModel(fileName);
    var model = test.toIndexedModel();
    model.calcNormals();
    var vertices = [];

    for (var i = 0; i < model.getPositions().length; i++)
    {
        vertices.push(new Vertex(model.getPositions()[i],
                model.getTexCoords()[i],
                model.getNormals()[i]));
    }

    var vertexData = vertices;

    var indexData = model.getIndices();

    this.addVertices(vertexData, indexData, false);

    return null;
};
