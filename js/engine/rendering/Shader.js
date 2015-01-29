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

function Shader(fileName)
{
    this.program = gl.createProgram();
    this.uniforms = {};

    if (!this.program)
    {
        throw new Error("Shader creation failed: Could not find valid memory location in constructor");
    }

    var vertexShaderText = this.loadShader(fileName + ".vs");
    var fragmentShaderText = this.loadShader(fileName + ".fs");

    this.addVertexShader(vertexShaderText);
    this.addFragmentShader(fragmentShaderText);

    this.addAllAttributes(vertexShaderText);

    this.compileShader();

    this.addAllUniforms(vertexShaderText);
    this.addAllUniforms(fragmentShaderText);
}

Shader.prototype.bind = function ()
{
    gl.useProgram(this.program);
};

Shader.prototype.updateUniforms = function (transform, material, renderingEngine)
{
};

Shader.prototype.addAllAttributes = function (shaderText)
{
    var ATTRIBUTE_KEYWORD = "attribute";
    var attributeStartLocation = shaderText.indexOf(ATTRIBUTE_KEYWORD);
    var attribNumber = 0;
    while (attributeStartLocation !== -1)
    {
        var begin = attributeStartLocation + ATTRIBUTE_KEYWORD.length + 1;
        var end = shaderText.indexOf(";", begin);

        var attributeLine = shaderText.substring(begin, end);
        var attributeName = attributeLine.substring(attributeLine.indexOf(' ') + 1, attributeLine.length);

        this.setAttribLocation(attributeName, attribNumber);
        attribNumber++;

        attributeStartLocation = shaderText.indexOf(ATTRIBUTE_KEYWORD, attributeStartLocation + ATTRIBUTE_KEYWORD.length);
    }
};

function GLSLStruct()
{
    this.name = "";
    this.type = "";
}

Shader.prototype.findUniformStructs = function (shaderText)
{
    var result = {};

    var STRUCT_KEYWORD = "struct";
    var structStartLocation = shaderText.indexOf(STRUCT_KEYWORD);
    while (structStartLocation != -1)
    {
        var nameBegin = structStartLocation + STRUCT_KEYWORD.length + 1;
        var braceBegin = shaderText.indexOf("{", nameBegin);
        var braceEnd = shaderText.indexOf("}", braceBegin);

        var structName = shaderText.substring(nameBegin, braceBegin).trim();
        var glslStructs = [];

        var componentSemicolonPos = shaderText.indexOf(";", braceBegin);
        while (componentSemicolonPos != -1 && componentSemicolonPos < braceEnd)
        {
            var componentNameStart = componentSemicolonPos;

            while (!/\s/.test(shaderText.charAt(componentNameStart - 1)))
                componentNameStart--;

            var componentTypeEnd = componentNameStart - 1;
            var componentTypeStart = componentTypeEnd;

            while (!/\s/.test(shaderText.charAt(componentTypeStart - 1)))
                componentTypeStart--;

            var componentName = shaderText.substring(componentNameStart, componentSemicolonPos);
            var componentType = shaderText.substring(componentTypeStart, componentTypeEnd);

            var glslStruct = new GLSLStruct();
            glslStruct.name = componentName;
            glslStruct.type = componentType;

            glslStructs.push(glslStruct);

            componentSemicolonPos = shaderText.indexOf(";", componentSemicolonPos + 1);
        }

        result[structName] = glslStructs;

        structStartLocation = shaderText.indexOf(STRUCT_KEYWORD, structStartLocation + STRUCT_KEYWORD.length);
    }

    return result;
};

Shader.prototype.addAllUniforms = function (shaderText)
{
    var structs = this.findUniformStructs(shaderText);

    var UNIFORM_KEYWORD = "uniform";
    var uniformStartLocation = shaderText.indexOf(UNIFORM_KEYWORD);
    while (uniformStartLocation != -1)
    {
        var begin = uniformStartLocation + UNIFORM_KEYWORD.length + 1;
        var end = shaderText.indexOf(";", begin);

        var uniformLine = shaderText.substring(begin, end);

        var whiteSpacePos = uniformLine.indexOf(' ');
        var uniformName = uniformLine.substring(whiteSpacePos + 1, uniformLine.length);
        var uniformType = uniformLine.substring(0, whiteSpacePos);

        this.addUniformWithStructCheck(uniformName, uniformType, structs);

        uniformStartLocation = shaderText.indexOf(UNIFORM_KEYWORD, uniformStartLocation + UNIFORM_KEYWORD.length);
    }
};

Shader.prototype.addUniformWithStructCheck = function (uniformName, uniformType, structs)
{
    var addThis = true;
    var structComponents = structs[uniformType];

    if (structComponents != null)
    {
        addThis = false;
        for (var i = 0; i < structComponents.length; i++)
        {
            var struct = structComponents[i]
            this.addUniformWithStructCheck(uniformName + "." + struct.name, struct.type, structs);
        }
    }

    if (addThis)
        this.addUniform(uniformName);
};

Shader.prototype.addUniform = function (uniform)
{
    var uniformLocation = gl.getUniformLocation(this.program, uniform);

    if (uniformLocation === 0xFFFFFFFF)
    {
        throw new Error("Error: Could not find uniform: " + uniform);
    }

    this.uniforms[uniform] = uniformLocation;
};

Shader.prototype.addVertexShaderFromFile = function (text)
{
    this.addProgram(this.loadShader(text), gl.VERTEX_SHADER);
};

Shader.prototype.addGeometryShaderFromFile = function (text)
{
    this.addProgram(this.loadShader(text), gl.GEOMETRY_SHADER);
};

Shader.prototype.addFragmentShaderFromFile = function (text)
{
    this.addProgram(this.loadShader(text), gl.FRAGMENT_SHADER);
};

Shader.prototype.addVertexShader = function (text)
{
    this.addProgram(text, gl.VERTEX_SHADER);
};

Shader.prototype.addGeometryShader = function (text)
{
    this.addProgram(text, gl.GEOMETRY_SHADER);
};

Shader.prototype.addFragmentShader = function (text)
{
    this.addProgram(text, gl.FRAGMENT_SHADER);
};

Shader.prototype.setAttribLocation = function (attributeName, location)
{
    gl.bindAttribLocation(this.program, location, attributeName);
};

Shader.prototype.compileShader = function ()
{
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
    {
        throw new Error(gl.getProgramInfoLog(this.program, 1024));
    }

    gl.validateProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.VALIDATE_STATUS))
    {
        throw new Error(gl.getProgramInfoLog(this.program, 1024));
    }
};

Shader.prototype.addProgram = function (text, type)
{
    var shader = gl.createShader(type);
    if (!shader)
    {
        throw new Error("Shader creation failed: Could not find valid memory location when adding shader");
    }

    gl.shaderSource(shader, text);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        throw new Error(gl.getShaderInfoLog(shader, 1024));
    }

    gl.attachShader(this.program, shader);
};

Shader.prototype.loadShader = function (fileName)
{
    var ret = "";
    var lines = Loader.files[fileName].split("\n");

    for (var li = 0; li < lines.length; li++)
    {
        var line = lines[li];
        var regex = /#include\s*"([^"]+)"/;
        var match = line.match(regex);
        if (match !== null){
            ret += this.loadShader( match[1] ) + "\n";
        } else {
            ret += line + "\n";
        }
    }
    return ret;
};

Shader.prototype.setUniformi = function (uniformName, value)
{
    gl.uniform1i(this.uniforms[uniformName], value);
};

Shader.prototype.setUniformf = function (uniformName, value)
{
    gl.uniform1f(this.uniforms[uniformName], value);
};

Shader.prototype.setUniform = function (uniformName, value)
{
    if (value instanceof Vector3f)
        gl.uniform3f(this.uniforms[uniformName], value.getX(), value.getY(), value.getZ());

    if (value instanceof Matrix4f) /* uniformMatrix4fv transpose parameter must be false in Opengl ES 2.0 */
        gl.uniformMatrix4fv(this.uniforms[uniformName], false, Util.Matrix4f2Float32ArrayTransposed(value));
};
