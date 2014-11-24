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

function Vector2f(x,y)
{
    this.x = x || 0;
    this.y = y || 0;
};

Vector2f.prototype.toString = function()
{
    return "(" + this.x + " " + this.y + ")" ;
};

Vector2f.prototype.getX = function(){
    return this.x;
};

Vector2f.prototype.setX = function(x){
    this.x = x || 0;;
};

Vector2f.prototype.getY = function(){
    return this.y;
};

Vector2f.prototype.setY = function(y){
    this.x = y || 0;;
};
