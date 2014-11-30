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

var Input = Input || {
    _getKey: [],
    _getMouse: [],
    _mousePos: {x: 0, y: 0},
    _mouseSavedPos: {x: 0, y: 0},
    NUM_KEYCODES: 256,
    NUM_MOUSEBUTTONS: 5,
    KEY_CANCEL: 3,
    KEY_HELP: 6,
    KEY_BACK_SPACE: 8,
    KEY_TAB: 9,
    KEY_CLEAR: 12,
    KEY_RETURN: 13,
    KEY_ENTER: 14,
    KEY_SHIFT: 16,
    KEY_CONTROL: 17,
    KEY_ALT: 18,
    KEY_PAUSE: 19,
    KEY_CAPS_LOCK: 20,
    KEY_ESCAPE: 27,
    KEY_SPACE: 32,
    KEY_PAGE_UP: 33,
    KEY_PAGE_DOWN: 34,
    KEY_END: 35,
    KEY_HOME: 36,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,
    KEY_PRINTSCREEN: 44,
    KEY_INSERT: 45,
    KEY_DELETE: 46,
    KEY_0: 48,
    KEY_1: 49,
    KEY_2: 50,
    KEY_3: 51,
    KEY_4: 52,
    KEY_5: 53,
    KEY_6: 54,
    KEY_7: 55,
    KEY_8: 56,
    KEY_9: 57,
    KEY_COLON: 58,
    KEY_SEMICOLON: 59,
    KEY_LESS_THAN: 60,
    KEY_EQUALS: 61,
    KEY_GREATER_THAN: 62,
    KEY_QUESTION_MARK: 63,
    KEY_AT: 64,
    KEY_A: 65,
    KEY_B: 66,
    KEY_C: 67,
    KEY_D: 68,
    KEY_E: 69,
    KEY_F: 70,
    KEY_G: 71,
    KEY_H: 72,
    KEY_I: 73,
    KEY_J: 74,
    KEY_K: 75,
    KEY_L: 76,
    KEY_M: 77,
    KEY_N: 78,
    KEY_O: 79,
    KEY_P: 80,
    KEY_Q: 81,
    KEY_R: 82,
    KEY_S: 83,
    KEY_T: 84,
    KEY_U: 85,
    KEY_V: 86,
    KEY_W: 87,
    KEY_X: 88,
    KEY_Y: 89,
    KEY_Z: 90,
    KEY_CONTEXT_MENU: 93,
    KEY_NUMPAD0: 96,
    KEY_NUMPAD1: 97,
    KEY_NUMPAD2: 98,
    KEY_NUMPAD3: 99,
    KEY_NUMPAD4: 100,
    KEY_NUMPAD5: 101,
    KEY_NUMPAD6: 102,
    KEY_NUMPAD7: 103,
    KEY_NUMPAD8: 104,
    KEY_NUMPAD9: 105,
    KEY_MULTIPLY: 106,
    KEY_ADD: 107,
    KEY_SEPARATOR: 108,
    KEY_SUBTRACT: 109,
    KEY_DECIMAL: 110,
    KEY_DIVIDE: 111,
    KEY_F1: 112,
    KEY_F2: 113,
    KEY_F3: 114,
    KEY_F4: 115,
    KEY_F5: 116,
    KEY_F6: 117,
    KEY_F7: 118,
    KEY_F8: 119,
    KEY_F9: 120,
    KEY_F10: 121,
    KEY_F11: 122,
    KEY_F12: 123,
    KEY_F13: 124,
    KEY_F14: 125,
    KEY_F15: 126,
    KEY_F16: 127,
    KEY_F17: 128,
    KEY_F18: 129,
    KEY_F19: 130,
    KEY_F20: 131,
    KEY_F21: 132,
    KEY_F22: 133,
    KEY_F23: 134,
    KEY_F24: 135,
    KEY_NUM_LOCK: 144,
    KEY_SCROLL_LOCK: 145,
    KEY_CIRCUMFLEX: 160,
    KEY_EXCLAMATION: 161,
    KEY_DOUBLE_QUOTE: 162,
    KEY_HASH: 163,
    KEY_DOLLAR: 164,
    KEY_PERCENT: 165,
    KEY_AMPERSAND: 166,
    KEY_UNDERSCORE: 167,
    KEY_OPEN_PAREN: 168,
    KEY_CLOSE_PAREN: 169,
    KEY_ASTERISK: 170,
    KEY_PLUS: 171,
    KEY_PIPE: 172,
    KEY_HYPHEN_MINUS: 173,
    KEY_OPEN_CURLY_BRACKET: 174,
    KEY_CLOSE_CURLY_BRACKET: 175,
    KEY_TILDE: 176,
    KEY_COMMA: 188,
    KEY_PERIOD: 190,
    KEY_SLASH: 191,
    KEY_BACK_QUOTE: 192,
    KEY_OPEN_BRACKET: 219,
    KEY_BACK_SLASH: 220,
    KEY_CLOSE_BRACKET: 221,
    KEY_QUOTE: 222,
    KEY_META: 224,
    KEY_ALTGR: 225,
    KEY_WIN: 91,
    KEY_KANA: 21,
    KEY_HANGUL: 21,
    KEY_EISU: 22,
    KEY_JUNJA: 23,
    KEY_FINAL: 24,
    KEY_HANJA: 25,
    KEY_KANJI: 25,
    KEY_CONVERT: 28,
    KEY_NONCONVERT: 29,
    KEY_ACCEPT: 30,
    KEY_MODECHANGE: 31,
    KEY_SELECT: 41,
    KEY_PRINT: 42,
    KEY_EXECUTE: 43,
    KEY_SLEEP: 95,
    lastKeys: [],
    lastMouse: []
};

Input.update = function ()
{
    for (var i = 0; i < this.NUM_KEYCODES; i++)
        this.lastKeys[i] = this.getKey(i);

    for (var i = 0; i < this.NUM_MOUSEBUTTONS; i++)
        this.lastMouse[i] = this.getMouse(i);
};

Input.getKey = function (keyCode) {
    return this._getKey[keyCode];
};

Input.getKeyDown = function (keyCode) {
    return this.getKey(keyCode) && !this.lastKeys[keyCode];
};

Input.getKeyUp = function (keyCode) {
    return !this.getKey(keyCode) && !this.lastKeys[keyCode];
};

Input.getMouse = function (keyCode) {
    return this._getMouse[keyCode];
};

Input.getMouseDown = function (mouseButton) {
    return this.getMouse(mouseButton) && !this.lastMouse[mouseButton];
};

Input.getMouseUp = function (mouseButton) {
    return !this.getMouse(mouseButton) && this.lastMouse[mouseButton];
};

Input.getMousePosition = function () {
    return new Vector2f(this._mousePos.x - this._mouseSavedPos.x, this._mousePos.y - this._mouseSavedPos.y);
};

Input.setMousePosition = function (pos)
{
    //Element.setMousePosition(pos.getX(), pos.getY());
    //console.log("TBD: Mouse Position - x:" + pos.getX() + " y:" + pos.getY());
    this._mouseSavedPos.x = this._mousePos.x - pos.getX();
    this._mouseSavedPos.y = this._mousePos.y - pos.getY();
};

Input.setCursor = function (enabled)
{
    if (enabled)
        console.log("TBD: Mouse Enabled");//Element.unlockMouse();
    else
        console.log("TBD: Mouse Disabled");//Element.lockMouse();
};

Input.handleEvent = function (e) {
    if (e.type == "mousemove") {
        this._mousePos.x = 0 | e.clientX || e.pageX;
        this._mousePos.y = 0 | e.clientY || e.pageY;
    } else {
        var code = 0 | e.keyCode | e.which;
        if (e.type == "keydown") {
            this._getKey[code] = true;
        } else if (e.type == "keyup") {
            this._getKey[code] = false;
        } else if (e.type == "mousedown") {
            this._getMouse[code] = true;
        } else if (e.type == "mouseup") {
            this._getMouse[code] = false;
        }
    }
};

for (var i = 0; i < Input.NUM_KEYCODES; i++)
    Input._getKey[i] = false;
for (var i = 0; i < Input.NUM_MOUSEBUTTONS; i++)
    Input._getMouse[i] = false;

window.addEventListener("keydown", Input);
window.addEventListener("keyup", Input);
window.addEventListener("mousedown", Input);
window.addEventListener("mouseup", Input);
window.addEventListener("mousemove", Input);

