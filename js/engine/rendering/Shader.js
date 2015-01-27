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

function Shader()
{
    this.program = gl.createProgram();
    this.uniforms = {};

    if (!this.program)
    {
        throw new Error("Shader creation failed: Could not find valid memory location in constructor");
    }
}

Shader.prototype.bind = function ()
{
    gl.useProgram(this.program);
};

Shader.prototype.updateUniforms = function (transform, material, renderingEngine) 
{
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

Shader.prototype.loadShader = function (id)
{
    return Loader.files[id];
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
