/*
stereoscope.js

Adam Schuster, 2015, askatom.net

A tool to display vintage stereoviews on modern platforms

The original stereoviews are loaded as JPS files and drawn on offscreen canvases.
Canvas data is then Barrel Distorted to compensate for a VR viewer
(specifially DODOcase / google cardboard and iPhone 6)
Left and Right canvases are then drawn on a main stereovew canvas
*/

// Initilize size variables
var wW = window.innerWidth;
var wH = window.innerHeight;
var cW = Math.round(wW * 0.5);
var cH = Math.round(0.88 * wH);
var canvasAspectRatio = cH / cW;
var imageAspectRatio = Number();
var cW2 = Number();
var cH2 = Number();
var offsetX = Number();

// Initialize canvases
var cL = document.createElement('canvas');
var cR = document.createElement('canvas');
var sV = document.getElementById('stereoview');

// Initialize canvas contexts
var cxL = cL.getContext('2d');
var cxR = cR.getContext('2d');
var cxV = sV.getContext('2d');

// Initialize R & L card origin points
var leftCardOriginX = 0;
var leftCardOriginY = 0;
var rightCardOriginX = cW;
var rightCardOriginY = 0;

// Get text objects from DOM
var backgroundText = document.getElementById('pageInfo');
var textLeft = document.getElementById('textLeft');
var textRight = document.getElementById('textRight');
var capStageBox = document.getElementById('captionBox');

// Declare additional variables
var curimg = 0;
var card = new Image();
var click;
var caption = "";
var iW;
var iH;
var leftData;
var rightData;

// Calculate view screen dimensions

function getWindowSize() {
    "use strict";
    wW = window.innerWidth;
    wH = window.innerHeight;
}

// Initialize canvas elements
cL.setAttribute('width', cW);
cL.setAttribute('height', cH);

cR.setAttribute('width', cW);
cR.setAttribute('height', cH);

// Set main stereoview canvas size
function setSVSize() {
    "use strict";
    sV.setAttribute('width', wW);
    sV.setAttribute('height', cH);
}
setSVSize();

// Set canvas sizes

function setCanvasSizes() {
    "use strict";

    cW = Math.round(wW * 0.5);
    cH = Math.round(0.88 * wH);

    sV.setAttribute('width', wW);
    sV.setAttribute('height', cH);
}

function onDocumentMouseDown(event) {
    "use strict";
    event.preventDefault();

    setCanvasSizes();

    showCap();
    blankCanvas();
    shutterSound();
    loadImage();

    curimg = (curimg < galleryarray.length - 1) ? curimg + 1 : 0;
}

card.onload = function() {
    "use strict";
    drawCanvas();
};

function shutterSound() {
    "use strict";
    click = document.getElementById("click");
    click.pause();
    click.currentTime = 0;
    click.play();
}

// Draw stereo content to canvases


function drawCanvas() {
    "use strict";

    getImageSize();

    if (card.height === 0) {

        cxV.clearRect(0, 0, wW, wH);
        sV.setAttribute('class', 'hiddenCanvas');

    } else {

        // newWidth = Math.round(cH * iW / iH);
        // diff = Math.abs(Math.round((cW - newWidth) / 4));
        //
        // cxL.clearRect(0, 0, newWidth, cH);
        // cxR.clearRect(0, 0, newWidth, cH);

        cxL.drawImage(card, 0, 0, iW, iH, 0, 0, cL.width, cL.height);
        cxR.drawImage(card, iW, 0, iW, iH, 0, 0, cR.width, cR.height);

        leftData = cxL.getImageData(0, 0, cL.width, cL.height);
        rightData = cxR.getImageData(0, 0, cR.width, cR.height);

        leftData = barrelDistortion(leftData);
        rightData = barrelDistortion(rightData);

        cxL.putImageData(leftData, 0, 0);
        cxR.putImageData(rightData, 0, 0);

        leftCardOriginX = offsetX;
        rightCardOriginX = cW + offsetX;

        cxV.drawImage(cL, leftCardOriginX, 0);
        cxV.drawImage(cR, rightCardOriginX, 0);

        sV.setAttribute('class', 'visibleCanvas');
    }

    /* debug
        console.log("diff " + diff);
        console.log("lx " + leftCardOriginX);
        console.log("rx " + rightCardOriginX);
        console.log("device pixel rato " + dpr);
        console.log("card height " + cH);
        console.log("card width " + cW);
        console.log("window width " + wW);
        console.log("image full width " + card.width);
        console.log("image half width " + iW);
        console.log("image height " + iH);
        console.log("image ratio " + ratioWH);
        console.log("new width " + newWidth);
    */
}

// Get size of image


function getImageSize() {
    "use strict";

    cxL.clearRect(0,0, cL.width, cL.height);
    cxR.clearRect(0,0, cR.width, cR.height);

    if (card.height === 0) {
        iW = 1;
        iH = 1;

    } else {

        iW = Math.round(card.width * 0.5);
        iH = card.height;
        imageAspectRatio = iH / iW;
        cH2 = Math.round(cW * imageAspectRatio);
        cW2 = Math.round(cH / imageAspectRatio);

        if (imageAspectRatio > canvasAspectRatio) {
            cL.setAttribute('height', cH);
            cL.setAttribute('width', cW2);
            cR.setAttribute('height', cH);
            cR.setAttribute('width', cW2);
            offsetX = Math.round((cW - cW2)/2);
            cxL = cL.getContext('2d');
            cxR = cR.getContext('2d');

        } else {
            cL.setAttribute('height', cH2);
            cL.setAttribute('width', cW);
            cR.setAttribute('height', cH2);
            cR.setAttribute('width', cW);
            offsetX = 0;
            cxL = cL.getContext('2d');
            cxR = cR.getContext('2d');
        }

        leftData = cxL.createImageData(iW, iH);
        rightData = cxR.createImageData(iW, iH);
    }

}

// Blank canvas


function blankCanvas() {
    "use strict";
    cxV.clearRect(0, 0, wW, wH);
    sV.setAttribute('class', 'hiddenCanvas');
    backgroundText.setAttribute('class', 'hiddenCanvas');
}

// reveal rendered stereo views


function loadImage() {
    "use strict";
    card.src = "cards/" + galleryarray[curimg];
}

// Show captions


function showCap() {
    "use strict";
    caption = textarray[curimg];
    textLeft.innerHTML = caption;
    textRight.innerHTML = caption;
}


document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('touchstart', onDocumentMouseDown, false);

// Handle window resizes

function onWindowResize() {
    "use strict";
    getWindowSize();
    setSVSize();
    setCanvasSizes();
    drawCanvas();
}

window.addEventListener('resize', onWindowResize, false);
