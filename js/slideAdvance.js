// Math and Variable Setup
var curimg = 0;
var card = new Image();
var click = null;
var caption = "";

var cL = document.createElement('canvas');
var cR = document.createElement('canvas');

var textLeft = document.getElementById('textLeft');
var textRight = document.getElementById('textRight');
var cBox = document.getElementById('captionBox');

var wW = window.innerWidth;
var wH = window.innerHeight;

var cW = wW * 0.5;
var cH = wH;

cL.width = cW;
cL.height = cH;
cR.width = cW;
cR.height = cH;

cxL = cL.getContext('2d');
cxR = cR.getContext('2d');

var stereoView = document.getElementById('stereoview');
stereoView.width = wW;
stereoView.height = wH;
cxV = stereoView.getContext('2d');

function onDocumentMouseDown(event) {
    event.preventDefault();

    if (cBox.getAttribute('class') === 'clear') {
        stereoView.setAttribute('class', 'blank');
        shutterSound();
        cBox.setAttribute('class', 'solid');
        caption = textarray[curimg];
        textLeft.innerHTML = caption;
        textRight.innerHTML = caption;
    } else {
        nextSlide();
    }
    if (curimg == 0) {
	    document.getElementById('pageInfo').opacity="1";
	    document.getElementById('pageInfo').visibility="visible";
    } else {
	    document.getElementById('pageInfo').opacity="0";
	    document.getElementById('pageInfo').visibility="hidden";
    }
}

card.onload = function() {
    setCardPixels();
    cxV.putImageData(leftData, 0, 0);
    cxV.putImageData(rightData, cW, 0);
    textLeft.innerHTML = "";
    textRight.innerHTML = "";
    cBox.setAttribute('class', 'clear');
    stereoView.setAttribute('class', 'visible');
};


nextSlide = function() {
    card.src = "cards/" + galleryarray[curimg];
    curimg = (curimg < galleryarray.length - 1) ? curimg + 1 : 0;
};

shutterSound = function() {

    click = document.getElementById("click");
    click.pause();
    click.currentTime = 0;
    click.play();
};

// Get the right and left parts of the .jps Image
// Draw pixel data to offscreen cxL and cxR canvases
// Run Barrel Distortion on image data
// Put newly distorted image data into Stereoview canvas

var leftData = cxL.createImageData(cW, cH);
var rightData = cxR.createImageData(cW, cH);

setCardPixels = function() {

    iW = card.width / 2;
    iH = card.height;

    cxL.drawImage(card, 0, 0, iW, iH, 0, 0, cW, cH);
    cxR.drawImage(card, iW, 0, iW, iH, 0, 0, cW, cH);

    leftData = cxL.getImageData(0, 0, cW, cH);
    rightData = cxR.getImageData(0, 0, cW, cH);

    leftData = barrelDistortion(leftData);
    rightData = barrelDistortion(rightData);

};

document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('touchstart', onDocumentMouseDown, false);

// Handle window resizes
function onWindowResize() {
    wW = window.innerWidth;
    wH = window.innerHeight;
    cW = wW * 0.5;
    cH = wH;

    cxV.clearRect(0, 0, wW, wH);

    stereoView.width = wW;
    stereoView.height = wH;
    cL.width = cW;
    cL.height = cH;
    cR.width = cW;
    cR.height = cH;

    setCardPixels();

}

window.addEventListener('resize', onWindowResize, false);
