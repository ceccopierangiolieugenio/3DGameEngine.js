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

function Vertex(pos)
{
    this.pos = pos;
}

Vertex.prototype.SIZE = 3;
Vertex.SIZE = 3;

Vertex.prototype.getPos = function ()
{
    return this.pos;
};

Vertex.prototype.setPos = function (pos)
{
    this.pos = pos;
};