/* 
 * Copyright 2015 Eugenio Parodi <ceccopierangiolieugenio at googlemail>.
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

var Loader = Loader || {
    pending: 0,
    files: {},
    images: {},
    startCallback: null,
    postLoadCallback: []
};

Loader.addPostLoadCallback = function (cb) {
    Loader.postLoadCallback.push(cb);
};

Loader.postLoad = function (cb) {
    for (var i = 0; i < Loader.postLoadCallback.length; i++)
        Loader.postLoadCallback[i]();
    cb();
};

Loader.include = function (filename)
{
    document.write('<script type="text/javascript" src="' + filename + '"></script>');
};

Loader.loadFile = function (filename, id)
{
    this.pending++;
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", filename);
    rawFile.responseType = "text";
    rawFile.onreadystatechange = function ()
    {
        if (rawFile.readyState === 4)
        {
            if (rawFile.status === 200 || rawFile.status === 0)
            {
                var allText = rawFile.responseText;
                Loader.files[id] = allText;
                Loader.pending--;
                if (null !== Loader.startCallback && Loader.isAllLoaded())
                    Loader.postLoad(Loader.startCallback);
            }
        }
    };
    rawFile.send(null);
};

Loader.loadTextures = function (filename, fileId)
{
    this.pending++;
    var image = new Image();
    image.fileId = fileId;
    image.onload = function () {
        Loader.images[this.fileId] = this;
        Loader.pending--;
        if (null !== Loader.startCallback && Loader.isAllLoaded())
            Loader.startCallback();
    };
    image.src = filename;
};


Loader.isAllLoaded = function ()
{
    return this.pending === 0;
};

Loader.waitPendingAndStart = function (cb)
{
    if (Loader.isAllLoaded())
        Loader.postLoad(cb);
    else
        Loader.startCallback = cb;
};

