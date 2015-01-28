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

function OBJModel(fileName)
{
    this.positions = [];
    this.texCoords = [];
    this.normals = [];
    this.indices = [];
    this.hasTexCoords = false;
    this.hasNormals = false;

    var lines = Loader.files[fileName].split("\n");
    for (var li = 0; li < lines.length; li++)
    {
        var line = lines[li];
        var tokens = line.split(" ");
        tokens = Util.removeEmptyStrings(tokens);

        if (tokens.length === 0 || tokens[0] === "#")
            continue;
        else if (tokens[0] === "v")
        {
            this.positions.push(new Vector3f(
                    parseFloat(tokens[1]),
                    parseFloat(tokens[2]),
                    parseFloat(tokens[3])));
        }
        else if (tokens[0] === "vt")
        {
            this.texCoords.push(new Vector2f(
                    parseFloat(tokens[1]),
                    parseFloat(tokens[2])));
        }
        else if (tokens[0] === "vn")
        {
            this.normals.push(new Vector3f(
                    parseFloat(tokens[1]),
                    parseFloat(tokens[2]),
                    parseFloat(tokens[3])));
        }
        else if (tokens[0] === "f")
        {
            for (var i = 0; i < tokens.length - 3; i++)
            {
                this.indices.push(this.parseOBJIndex(tokens[1]));
                this.indices.push(this.parseOBJIndex(tokens[2 + i]));
                this.indices.push(this.parseOBJIndex(tokens[3 + i]));
            }
        }
    }
}

OBJModel.prototype.toIndexedModel = function ()
{
    var result = new IndexedModel();
    var normalModel = new IndexedModel();
    var resultIndexMap = {};
    var normalIndexMap = {};
    var indexMap = {};

    for (var i = 0; i < this.indices.length; i++)
    {
        var currentIndex = this.indices[i];

        var currentPosition = this.positions[currentIndex.vertexIndex];
        var currentTexCoord;
        var currentNormal;

        if (this.hasTexCoords)
            currentTexCoord = this.texCoords[currentIndex.texCoordIndex];
        else
            currentTexCoord = new Vector2f(0, 0);

        if (this.hasNormals)
            currentNormal = this.normals[currentIndex.normalIndex];
        else
            currentNormal = new Vector3f(0, 0, 0);

        var previousVertexIndex = -1;

        var modelVertexIndex = resultIndexMap[currentIndex.hashCode()];

        if (modelVertexIndex === undefined)
        {
            modelVertexIndex = result.getPositions().length;
            resultIndexMap[currentIndex.hashCode()] = modelVertexIndex;

            result.getPositions().push(currentPosition);
            result.getTexCoords().push(currentTexCoord);
            if (this.hasNormals)
                result.getNormals().push(currentNormal);
        }

        var normalModelIndex = normalIndexMap[currentIndex.vertexIndex];

        if (normalModelIndex === undefined)
        {
            normalModelIndex = normalModel.getPositions().length;
            normalIndexMap[currentIndex.vertexIndex] = normalModelIndex;

            normalModel.getPositions().push(currentPosition);
            normalModel.getTexCoords().push(currentTexCoord);
            normalModel.getNormals().push(currentNormal);
        }

        result.getIndices().push(modelVertexIndex);
        normalModel.getIndices().push(normalModelIndex);
        indexMap[modelVertexIndex] = normalModelIndex;
    }

    if (!this.hasNormals)
    {
        normalModel.calcNormals();

        for (var i = 0; i < result.getPositions().length; i++)
            result.getNormals().push(normalModel.getNormals()[indexMap[i]]);
    }

    return result;
};

OBJModel.prototype.parseOBJIndex = function (token)
{
    var values = token.split("/");

    var result = new OBJIndex();
    result.vertexIndex = parseInt(values[0]) - 1;

    if (values.length > 1)
    {
        this.hasTexCoords = true;
        result.texCoordIndex = parseInt(values[1]) - 1;

        if (values.length > 2)
        {
            this.hasNormals = true;
            result.normalIndex = parseInt(values[2]) - 1;
        }
    }

    return result;
};

//OBJModel.prototype.getPositions = function () { return positions; };
//OBJModel.prototype.getTexCoords = function () { return texCoords; };
//OBJModel.prototype.getNormals = function () { return normals; };
//OBJModel.prototype.getIndices = function () { return indices; };
