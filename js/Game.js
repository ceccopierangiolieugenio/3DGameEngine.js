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
    this.mesh = new Mesh();//ResourceLoader.loadMesh("box.obj");
    this.material = new Material(ResourceLoader.loadTexture("test.png"), new Vector3f(0, 1, 1));
    this.shader = PhongShader.getInstance();
    this.camera = new Camera();
    this.transform = new Transform();

    this.temp = 0.0;

    /* NOTE (Eugenio): Addition to fix a problem with the Shader Attrib */
    this.mesh.setShader(this.shader);

//    var vertices = [
//        new Vertex(new Vector3f(-1, -1, 0), new Vector2f(0, 0)),
//        new Vertex(new Vector3f(0, 1, 0), new Vector2f(0.5, 0)),
//        new Vertex(new Vector3f(1, -1, 0), new Vector2f(1.0, 0)),
//        new Vertex(new Vector3f(0, -1, 1), new Vector2f(0.5, 1.0))
//    ];
//
//    var indices = [
//        3, 1, 0,
//        2, 1, 3,
//        0, 1, 2,
//        0, 2, 3
//    ];

    var vertices = [
        new Vertex(new Vector3f(-1.0, -1.0, 0.5773), new Vector2f(0.0, 0.0)),
        new Vertex(new Vector3f(0.0, -1.0, -1.15475), new Vector2f(0.5, 0.0)),
        new Vertex(new Vector3f(1.0, -1.0, 0.5773), new Vector2f(1.0, 0.0)),
        new Vertex(new Vector3f(0.0, 1.0, 0.0), new Vector2f(0.5, 1.0))
    ];

    var indices = [
        0, 3, 1,
        1, 3, 2,
        2, 3, 0,
        1, 2, 0];

    this.mesh.addVertices(vertices, indices, true);

    Transform.setProjection(70, gl.viewportWidth, gl.viewportHeight, 0.1, 1000);
    Transform.setCamera(this.camera);

    PhongShader.setAmbientLight(new Vector3f(0.1, 0.1, 0.1));
    PhongShader.setDirectionalLight(new DirectionalLight(new BaseLight(new Vector3f(1, 1, 1), 0.8), new Vector3f(1, 1, 1)));

    /* Added a "bind()" here to avoid the warning:
     *       WebGL: UniformXXX: no program is currently bound
     * caused by calling any Uniform function before the first frame.
     */
    this.shader.bind();
}

Game.prototype.input = function () {
    this.camera.input();
//    if (Input.getKeyDown(Input.KEY_UP))
//        console.log("We've just pressed up!");
//    if (Input.getKeyUp(Input.KEY_UP))
//        console.log("We've just released up!");
//
//    if (Input.getMouseDown(1))
//        console.log("We've just right clicked at " + Input.getMousePosition().toString());
//    if (Input.getMouseUp(1))
//        console.log("We've just released right mouse button!");
};

Game.prototype.update = function () {
    this.temp += Time.getDelta();

    var sinTemp = Math.sin(this.temp);

    this.transform.setTranslation(0, 0, 5);
    this.transform.setRotation(0, sinTemp * 180, 0);
    //this.transform.setScale(sinTemp, sinTemp, sinTemp);
    //this.transform.setScale(0.7 * sinTemp, 0.7 * sinTemp, 0.7 * sinTemp);
};

Game.prototype.render = function () {
    RenderUtil.setClearColor(Transform.getCamera().getPos().div(2048).abs());
    this.shader.bind();
    this.shader.updateUniforms(this.transform.getTransformation(), this.transform.getProjectedTransformation(), this.material);
    this.mesh.draw();
};
