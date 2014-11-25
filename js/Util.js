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

var Util = Util || {};

Util.include = function (filename)
{
    document.write('<script type="text/javascript" src="' + filename +
            '"><' + '/script>');
};

Util.Vertices2Float32Array = function(vertices)
{
    var ret = new Float32Array(vertices.length * Vertex.SIZE);
    for (var i=0 ; i < vertices.length ; i++)
    {
        ret[i*Vertex.SIZE+0] = vertices[i].getPos().getX();
        ret[i*Vertex.SIZE+1] = vertices[i].getPos().getY();
        ret[i*Vertex.SIZE+2] = vertices[i].getPos().getZ();
    }
    return ret;
};