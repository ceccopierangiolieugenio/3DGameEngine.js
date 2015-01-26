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

function Game() {}

Game.prototype.init = function () {};

Game.prototype.input = function () {
    this.getRootObject().input();
};

Game.prototype.update = function () {
    this.getRootObject().update();
};

Game.prototype.getRootObject = function () {
    if (this.root === undefined)
        this.root = new GameObject();
    return this.root;
};
