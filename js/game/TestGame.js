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

function TestGame() {}
OO.extends(TestGame, Game);

TestGame.prototype.init = function ()
{
    // this.camera = new Camera();

    var fieldDepth = 10.0;
    var fieldWidth = 10.0;

    var vertices = [
        new Vertex(new Vector3f(-fieldWidth, 0.0, -fieldDepth), new Vector2f(0.0, 0.0)),
        new Vertex(new Vector3f(-fieldWidth, 0.0, fieldDepth * 3), new Vector2f(0.0, 1.0)),
        new Vertex(new Vector3f(fieldWidth * 3, 0.0, -fieldDepth), new Vector2f(1.0, 0.0)),
        new Vertex(new Vector3f(fieldWidth * 3, 0.0, fieldDepth * 3), new Vector2f(1.0, 1.0))
    ];

    var indices = [
        0, 1, 2,
        2, 1, 3
    ];

    var mesh = new Mesh(vertices, indices, true);
    var material = new Material(new Texture("test.png"), new Vector3f(1, 1, 1), 1, 8);

    var meshRenderer = new MeshRenderer(mesh, material);

    var planeObject = new GameObject();
    planeObject.addComponent(meshRenderer);
    planeObject.getTransform().setTranslation(0, -1, 5);

    this.getRootObject().addChild(planeObject);

    // Transform.setProjection(70, gl.viewportWidth, gl.viewportHeight, 0.1, 1000);
    // Transform.setCamera(this.camera);
};

//TestGame.prototype.input = function ()
//{
//    this.camera.input();
//    this.root.input();
//};
//
//TestGame.prototype.update = function ()
//{
//    this.root.getTransform().setTranslation(0, -1, 5);
//    this.root.update();
//};
//
//TestGame.prototype.render = function ()
//{
//    this.root.render();
//};
