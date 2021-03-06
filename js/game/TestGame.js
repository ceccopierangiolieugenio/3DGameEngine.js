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

function TestGame() {
}
OO.extends(TestGame, Game);

TestGame.prototype.init = function ()
{
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

    var vertices2 = [
        new Vertex(new Vector3f(-fieldWidth / 10, 0.0, -fieldDepth / 10), new Vector2f(0.0, 0.0)),
        new Vertex(new Vector3f(-fieldWidth / 10, 0.0, fieldDepth / 10 * 3), new Vector2f(0.0, 1.0)),
        new Vertex(new Vector3f(fieldWidth / 10 * 3, 0.0, -fieldDepth / 10), new Vector2f(1.0, 0.0)),
        new Vertex(new Vector3f(fieldWidth / 10 * 3, 0.0, fieldDepth / 10 * 3), new Vector2f(1.0, 1.0))
    ];

    var indices2 = [
        0, 1, 2,
        2, 1, 3
    ];

    var mesh2 = new Mesh(vertices2, indices2, true);
    var mesh = new Mesh(vertices, indices, true);
    var material = new Material();//new Texture("test.png"), new Vector3f(1,1,1), 1, 8);
    material.addTexture("diffuse", new Texture("bricks.jpg"));
    material.addFloat("specularIntensity", 1);
    material.addFloat("specularPower", 8);

    var material2 = new Material();//new Texture("test.png"), new Vector3f(1,1,1), 1, 8);
    material2.addTexture("diffuse", new Texture("test.png"));
    material2.addFloat("specularIntensity", 1);
    material2.addFloat("specularPower", 8);

    var tempMesh = new Mesh("monkey3.obj");

    var meshRenderer = new MeshRenderer(mesh, material);

    var planeObject = new GameObject();
    planeObject.addComponent(meshRenderer);
    planeObject.getTransform().getPos().set(0, -1, 5);

    var directionalLightObject = new GameObject();
    var directionalLight = new DirectionalLight(new Vector3f(0, 0, 1), 0.4);
    directionalLightObject.addComponent(directionalLight);

    var pointLightObject = new GameObject();
    pointLightObject.addComponent(new PointLight(new Vector3f(0, 1, 0), 0.4, new Attenuation(0, 0, 1)));

    var spotLight = new SpotLight(new Vector3f(0, 1, 1), 0.4,
            new Attenuation(0, 0, 0.1), 0.7);

    var spotLightObject = new GameObject();
    spotLightObject.addComponent(spotLight);

    spotLightObject.getTransform().getPos().set(5, 0, 5);
    spotLightObject.getTransform().setRot(new Quaternion(new Vector3f(0, 1, 0), Util.toRadians(90.0)));

    this.addObject(planeObject);
    this.addObject(directionalLightObject);
    this.addObject(pointLightObject);
    this.addObject(spotLightObject);

    //this.getRootObject().addChild(new GameObject().addComponent(new Camera(Util.toRadians(70.0), Window.getWidth() / Window.getHeight(), 0.01, 1000.0)));

    var testMesh1 = new GameObject().addComponent(new MeshRenderer(mesh2, material));
    var testMesh2 = new GameObject().addComponent(new MeshRenderer(mesh2, material));
    var testMesh3 = new GameObject().addComponent(new LookAtComponent()).addComponent(new MeshRenderer(tempMesh, material));

    testMesh1.getTransform().getPos().set(0, 2, 0);
    testMesh1.getTransform().setRot(new Quaternion(new Vector3f(0, 1, 0), 0.4));

    testMesh2.getTransform().getPos().set(0, 0, 5);

    testMesh1.addChild(testMesh2);
    testMesh2.addChild(
            //addObject(
            new GameObject().addComponent(new FreeLook(0.5)).addComponent(new FreeMove(10.0)).addComponent(new Camera(Util.toRadians(70.0), Window.getWidth() / Window.getHeight(), 0.01, 1000.0)));

    this.addObject(testMesh1);
    this.addObject(testMesh3);

    testMesh3.getTransform().getPos().set(5, 5, 5);
    testMesh3.getTransform().setRot(new Quaternion(new Vector3f(0, 1, 0), Util.toRadians(-70.0)));

    this.addObject(new GameObject().addComponent(new MeshRenderer(new Mesh("monkey3.obj"), material2)));

    directionalLight.getTransform().setRot(new Quaternion(new Vector3f(1, 0, 0), Util.toRadians(-45)));
};
