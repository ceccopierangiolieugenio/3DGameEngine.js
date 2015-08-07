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
    this.filename = fileName;
    
    var oldResource = Shader.loadedShaders[fileName];

    if(oldResource !== undefined)
    {
        this.resource = oldResource;
        this.resource.addReference();
    }
    else
    {
        this.resource = new ShaderResource();
        
        var vertexShaderText = this.loadShader(fileName + ".vs");
        var fragmentShaderText = this.loadShader(fileName + ".fs");

        this.addVertexShader(vertexShaderText);
        this.addFragmentShader(fragmentShaderText);

        this.addAllAttributes(vertexShaderText);

        this.compileShader();

        this.addAllUniforms(vertexShaderText);
        this.addAllUniforms(fragmentShaderText);
    }
}

Shader.loadedShaders = {};

Shader.prototype.bind = function ()
{
    gl.useProgram(this.resource.getProgram());
};

Shader.prototype.updateUniforms = function (transform, material, renderingEngine)
{
    var worldMatrix = transform.getTransformation();
    var MVPMatrix = renderingEngine.getMainCamera().getViewProjection().mul(worldMatrix);

    for (var i = 0; i < this.resource.getUniformNames().length; i++)
    {
        var uniformName = this.resource.getUniformNames()[i];
        var uniformType = this.resource.getUniformTypes()[i];

        if (uniformType === ("sampler2D"))
        {
            var samplerSlot = renderingEngine.getSamplerSlot(uniformName);
            material.getTexture(uniformName).bind(samplerSlot);
            this.setUniformi(uniformName, samplerSlot);
        }
        else if (uniformName.startsWith("T_"))
        {
            if (uniformName === "T_MVP")
                this.setUniform(uniformName, MVPMatrix);
            else if (uniformName === "T_model")
                this.setUniform(uniformName, worldMatrix);
            else
                throw new Error(uniformName + " is not a valid component of Transform");
        }
        else if (uniformName.startsWith("R_"))
        {
            var unprefixedUniformName = uniformName.substring(2);
            if (uniformType === "vec3")
                this.setUniform(uniformName, renderingEngine.getVector3f(unprefixedUniformName));
            else if (uniformType === "float")
                this.setUniformf(uniformName, renderingEngine.getFloat(unprefixedUniformName));
            else if (uniformType === "DirectionalLight")
                this.setUniformDirectionalLight(uniformName, renderingEngine.getActiveLight());
            else if (uniformType === "PointLight")
                this.setUniformPointLight(uniformName, renderingEngine.getActiveLight());
            else if (uniformType === "SpotLight")
                this.setUniformSpotLight(uniformName, renderingEngine.getActiveLight());
            else
                renderingEngine.updateUniformStruct(transform, material, this, uniformName, uniformType);
        }
        else if (uniformName.startsWith("C_"))
        {
            if (uniformName === "C_eyePos")
                this.setUniform(uniformName, renderingEngine.getMainCamera().getTransform().getTransformedPos());
            else
                throw new Error(uniformName + " is not a valid component of Camera");
        }
        else
        {
            if (uniformType === "vec3")
                this.setUniform(uniformName, material.getVector3f(uniformName));
            else if (uniformType === "float")
                this.setUniformf(uniformName, material.getFloat(uniformName));
            else
                throw new Error(uniformType + " is not a supported type in Material");
        }
    }
};

Shader.prototype.addAllAttributes = function (shaderText)
{
    var ATTRIBUTE_KEYWORD = "attribute";
    var attributeStartLocation = shaderText.indexOf(ATTRIBUTE_KEYWORD);
    var attribNumber = 0;
    while (attributeStartLocation !== -1)
    {
        if (!(attributeStartLocation !== 0
                && (/\s/.test(shaderText.charAt(attributeStartLocation - 1)) || shaderText.charAt(attributeStartLocation - 1) === ';')
                && /\s/.test(shaderText.charAt(attributeStartLocation + ATTRIBUTE_KEYWORD.length))))
            continue;

        var begin = attributeStartLocation + ATTRIBUTE_KEYWORD.length + 1;
        var end = shaderText.indexOf(";", begin);

        var attributeLine = shaderText.substring(begin, end).trim();
        var attributeName = attributeLine.substring(attributeLine.indexOf(' ') + 1, attributeLine.length).trim();

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
    while (structStartLocation !== -1)
    {
        if (!(structStartLocation !== 0
                && (/\s/.test(shaderText.charAt(structStartLocation - 1)) || shaderText.charAt(structStartLocation - 1) === ';')
                && /\s/.test(shaderText.charAt(structStartLocation + STRUCT_KEYWORD.length))))
            continue;

        var nameBegin = structStartLocation + STRUCT_KEYWORD.length + 1;
        var braceBegin = shaderText.indexOf("{", nameBegin);
        var braceEnd = shaderText.indexOf("}", braceBegin);

        var structName = shaderText.substring(nameBegin, braceBegin).trim();
        var glslStructs = [];

        var componentSemicolonPos = shaderText.indexOf(";", braceBegin);
        while (componentSemicolonPos !== -1 && componentSemicolonPos < braceEnd)
        {
            var componentNameEnd = componentSemicolonPos + 1;

            while (/\s/.test(shaderText.charAt(componentNameEnd - 1)) || shaderText.charAt(componentNameEnd - 1) === ';')
                componentNameEnd--;

            var componentNameStart = componentSemicolonPos;

            while (!/\s/.test(shaderText.charAt(componentNameStart - 1)))
                componentNameStart--;

            var componentTypeEnd = componentNameStart;

            while (/\s/.test(shaderText.charAt(componentTypeEnd - 1)))
                componentTypeEnd--;

            var componentTypeStart = componentTypeEnd;

            while (!/\s/.test(shaderText.charAt(componentTypeStart - 1)))
                componentTypeStart--;

            var componentName = shaderText.substring(componentNameStart, componentNameEnd);
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
    while (uniformStartLocation !== -1)
    {
        if (!(uniformStartLocation !== 0
                && (/\s/.test(shaderText.charAt(uniformStartLocation - 1)) || shaderText.charAt(uniformStartLocation - 1) === ';')
                && /\s/.test(shaderText.charAt(uniformStartLocation + UNIFORM_KEYWORD.length))))
            continue;

        var begin = uniformStartLocation + UNIFORM_KEYWORD.length + 1;
        var end = shaderText.indexOf(";", begin);

        var uniformLine = shaderText.substring(begin, end).trim();

        var whiteSpacePos = uniformLine.indexOf(' ');
        var uniformName = uniformLine.substring(whiteSpacePos + 1, uniformLine.length).trim();
        var uniformType = uniformLine.substring(0, whiteSpacePos).trim();

        this.resource.getUniformNames().push(uniformName);
        this.resource.getUniformTypes().push(uniformType);
        this.addUniform(uniformName, uniformType, structs);

        uniformStartLocation = shaderText.indexOf(UNIFORM_KEYWORD, uniformStartLocation + UNIFORM_KEYWORD.length);
    }
};

Shader.prototype.addUniform = function (uniformName, uniformType, structs)
{
    var addThis = true;
    var structComponents = structs[uniformType];

    if (structComponents !== undefined)
    {
        addThis = false;
        for (var i = 0; i < structComponents.length; i++)
        {
            var struct = structComponents[i];
            this.addUniform(uniformName + "." + struct.name, struct.type, structs);
        }
    }

    if (!addThis)
        return;
    
    var uniformLocation = gl.getUniformLocation(this.resource.getProgram(), uniformName);

    if (uniformLocation === 0xFFFFFFFF)
    {
        throw new Error("Error: Could not find uniform: " + uniformName);
    }

    this.resource.getUniforms()[uniformName] = uniformLocation;
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
    gl.bindAttribLocation(this.resource.getProgram(), location, attributeName);
};

Shader.prototype.compileShader = function ()
{
    gl.linkProgram(this.resource.getProgram());
    if (!gl.getProgramParameter(this.resource.getProgram(), gl.LINK_STATUS))
    {
        throw new Error(gl.getProgramInfoLog(this.resource.getProgram(), 1024));
    }

    gl.validateProgram(this.resource.getProgram());
    if (!gl.getProgramParameter(this.resource.getProgram(), gl.VALIDATE_STATUS))
    {
        throw new Error(gl.getProgramInfoLog(this.resource.getProgram(), 1024));
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

    gl.attachShader(this.resource.getProgram(), shader);
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
    gl.uniform1i(this.resource.getUniforms()[uniformName], value);
};

Shader.prototype.setUniformf = function (uniformName, value)
{
    gl.uniform1f(this.resource.getUniforms()[uniformName], value);
};

Shader.prototype.setUniform = function (uniformName, value)
{
    if (value instanceof Vector3f)
        gl.uniform3f(this.resource.getUniforms()[uniformName], value.getX(), value.getY(), value.getZ());

    if (value instanceof Matrix4f) /* uniformMatrix4fv transpose parameter must be false in Opengl ES 2.0 */
        gl.uniformMatrix4fv(this.resource.getUniforms()[uniformName], false, Util.Matrix4f2Float32ArrayTransposed(value));
};

Shader.prototype.setUniformBaseLight = function (uniformName, baseLight)
{
    this.setUniform(uniformName + ".color", baseLight.getColor());
    this.setUniformf(uniformName + ".intensity", baseLight.getIntensity());
};

Shader.prototype.setUniformDirectionalLight = function (uniformName, directionalLight)
{
    this.setUniformBaseLight(uniformName + ".base", directionalLight);
    this.setUniform(uniformName + ".direction", directionalLight.getDirection());
};

Shader.prototype.setUniformPointLight = function (uniformName, pointLight)
{
    this.setUniformBaseLight(uniformName + ".base", pointLight);
    this.setUniformf(uniformName + ".atten.constant", pointLight.getAttenuation().getConstant());
    this.setUniformf(uniformName + ".atten.linear", pointLight.getAttenuation().getLinear());
    this.setUniformf(uniformName + ".atten.exponent", pointLight.getAttenuation().getExponent());
    this.setUniform(uniformName + ".position", pointLight.getTransform().getTransformedPos());
    this.setUniformf(uniformName + ".range", pointLight.getRange());
};

Shader.prototype.setUniformSpotLight = function (uniformName, spotLight)
{
    this.setUniformPointLight(uniformName + ".pointLight", spotLight);
    this.setUniform(uniformName + ".direction", spotLight.getDirection());
    this.setUniformf(uniformName + ".cutoff", spotLight.getCutoff());
};
