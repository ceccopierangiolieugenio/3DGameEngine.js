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

function Vector2f(x, y)
{
    this.x = x || 0;
    this.y = y || 0;
}
;

Vector2f.prototype.length = function ()
{
    return Math.sqrt(this.x * this.x + this.y * this.y);
}

Vector2f.prototype.dot = function (r)
{
    return this.x * r.getX() + this.y * r.getY();
};

Vector2f.prototype.normalize = function ()
{
    var length = this.length();
    this.x /= length;
    this.y /= length;
    return this;
};

Vector2f.prototype.rotate = function (angle)
{
    var rad = Util.toRadians(angle);
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    return new Vector2f( (this.x*cos - this.y*sin) , (this.x*sin + this.y*cos) );
};

Vector2f.prototype.add = function (r)
{
    if (typeof r === 'number') {
        return new Vector2f(this.x + r, this.y + r);
    } else {
        return new Vector2f(this.x + r.getX(), this.y + r.getY());
    }
};

Vector2f.prototype.sub = function (r)
{
    if (typeof r === 'number') {
        return new Vector2f(this.x - r, this.y - r);
    } else {
        return new Vector2f(this.x - r.getX(), this.y - r.getY());
    }
};

Vector2f.prototype.mul = function (r)
{
    if (typeof r === 'number') {
        return new Vector2f(this.x * r, this.y * r);
    } else {
        return new Vector2f(this.x * r.getX(), this.y * r.getY());
    }
};

Vector2f.prototype.div = function (r)
{
    if (typeof r === 'number') {
        return new Vector2f(this.x / r, this.y / r);
    } else {
        return new Vector2f(this.x / r.getX(), this.y / r.getY());
    }
};

Vector2f.prototype.toString = function ()
{
    return "(" + this.x + " " + this.y + ")";
};

Vector2f.prototype.getX = function () {
    return this.x;
};

Vector2f.prototype.setX = function (x) {
    this.x = x || 0;
    ;
};

Vector2f.prototype.getY = function () {
    return this.y;
};

Vector2f.prototype.setY = function (y) {
    this.y = y || 0;
    ;
};
