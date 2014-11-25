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

    var data = [
        new Vertex(new Vector3f(-1, -1, 0)),
        new Vertex(new Vector3f(0, 1, 0)),
        new Vertex(new Vector3f(1, -1, 0))
    ];

    this.mesh.addVertices(data);

    this.shader.addVertexShader(ResourceLoader.loadShader("basicVertex.vs"));
    this.shader.addFragmentShader(ResourceLoader.loadShader("basicFragment.fs"));
    this.shader.compileShader();
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

};

Game.prototype.render = function () {
    this.shader.bind();
    this.mesh.draw();
};
