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
    if (!this.program)
    {
        throw new Error("Shader creation failed: Could not find valid memory location in constructor");
    }
}


Shader.prototype.bind = function ()
{
    gl.useProgram(this.program);
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

