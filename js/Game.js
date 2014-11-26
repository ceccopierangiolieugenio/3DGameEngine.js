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

function Game() {
    this.mesh = new Mesh();
    this.shader = new Shader();
    this.temp = 0.0;

    var vertices = [
        new Vertex(new Vector3f(-1, -1, 0)),
        new Vertex(new Vector3f( 0,  1, 0)),
        new Vertex(new Vector3f( 1, -1, 0)),
        new Vertex(new Vector3f( 0, -1, 1))
    ];

    var indices = [ 0, 1, 3,
                    3, 1, 2,
                    2, 1, 0,
                    0, 2, 3 ];

    this.mesh.addVertices(vertices, indices);

    this.transform = new Transform();

    this.shader.addVertexShader(ResourceLoader.loadShader("basicVertex.vs"));
    this.shader.addFragmentShader(ResourceLoader.loadShader("basicFragment.fs"));
    this.shader.compileShader();

    this.shader.addUniform("transform");
    /* Added a "bind()" here to avoid the warning:
     *       WebGL: UniformXXX: no program is currently bound
     * caused by calling any Uniform function before the first frame.
     */
    this.shader.bind();
}

Game.prototype.input = function () {
    if (Input.getKeyDown(Input.KEY_UP))
        console.log("We've just pressed up!");
    if (Input.getKeyUp(Input.KEY_UP))
        console.log("We've just released up!");

    if (Input.getMouseDown(1))
        console.log("We've just right clicked at " + Input.getMousePosition().toString());
    if (Input.getMouseUp(1))
        console.log("We've just released right mouse button!");
};

Game.prototype.update = function () {
    this.temp += Time.getDelta();

    var sinTemp = Math.sin(this.temp);
		
    this.transform.setTranslation(sinTemp, 0, 0);
    this.transform.setRotation(0, sinTemp * 180, 0);
    //this.transform.setScale(sinTemp, sinTemp, sinTemp);
};

Game.prototype.render = function () {
    this.shader.bind();
    this.shader.setUniform("transform", this.transform.getTransformation());

    this.mesh.draw();
};
