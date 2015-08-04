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

function ShaderResource()
{
	this.program = gl.createProgram();
	this.refCount = 1;

	if(this.program === 0)
	{
		throw new Error("Shader creation failed: Could not find valid memory location in constructor");
	}

	this.uniforms = {};
	this.uniformNames = [];
	this.uniformTypes = [];
}

ShaderResource.prototype.finalize = function()
{
	gl.deleteBuffers(this.program);
};

ShaderResource.prototype.addReference = function()
{
	this.refCount++;
};

ShaderResource.prototype.removeReference = function()
{
	this.refCount--;
	return this.refCount === 0;
};

ShaderResource.prototype.getProgram = function() { return this.program; };

ShaderResource.prototype.getUniforms = function() {
	return this.uniforms;
};

ShaderResource.prototype.getUniformNames = function() {
	return this.uniformNames;
};

ShaderResource.prototype.getUniformTypes = function() {
	return this.uniformTypes;
}
