"use strict";

var gImg;
var unicodeBlocks = {
  'cyrillic': [0x0400, 0x04FF],
  'han': [0x4E00, 0x62FF],
  'kana': [0x3040, 0x30FF],
  'greek': [0x0370, 0x03FF],
  'hebrew': [0x0590, 0x05FF],
  'bengali': [0x0980, 0x09FF],
  'tamil': [0x0B80, 0x0BFF],
  'thai': [0x0E00, 0x0E7F],
  'tibetan': [0x0F00, 0x0FFF],
  'runic': [ 0x16A0,0x16FF],
  'geometric': [0x25A0, 0x25FF],
  'boxDrawing': [0x2500, 0x257F],
  'braille': [0x2800, 0x28FF],
  'katakana': [0x30A0, 0x30FF],
  'hiragana': [0x3040, 0x309F]
  
};

function randHan() {
  return randChar(0x4E00, 0x62FF);
}

function randKana() {
  return randChar(0x3040, 0x30FF);
}

function setup() {
  var c = createCanvas(windowWidth, windowHeight);
  c.drop(gotDrop)
  loop();
}

function gotDrop(file) {
  // If it's an image file
  if (file.type === 'image') {
    // Create an image DOM element but don't show it
    gImg = createImg(file.data).hide();
    // Draw the image onto the canvas
    image(gImg, 0, 0, width, height);
    noLoop();
    messWithImage();
  } else {
    console.log('Not an image file!');
  }
}

function messWithImage() {
  loadPixels();
  var d = pixelDensity();

  //how often offset size is changed
  var chunkSize = 100 + round(random(70000));
  var glitchOff = 1;
  var glitchOffG = 1;
  var alphaForChunk = 0;

  var halfImage = 4 * (width * d) * (height / 2 * d);
  var numPix = 4 * (width * d) * (height * d);
  var pixToMess = halfImage - (4 * round(random(7000)));
  //modify top half of image
  for (var i = 0; i < pixToMess; i += 4) {
    if (i % chunkSize == 0) {
      //change the glitchOffset
      glitchOff = round(random(300));
      glitchOffG = 0;
      round(random(300));
    }
    pixels[i] = pixels[i + 2 + 4 * glitchOff];
    pixels[i + 1] = pixels[pixToMess - i + 1 + 4 * glitchOffG];
    pixels[i + 2] = pixels[pixToMess - i + 3];
    pixels[i + 3] = 255;
  }
  updatePixels();
}

function mousePressed() {
  draw();
  messWithImage();
}

function randChar(start, end) {
  var defaultStart = 0x4E00;
  var defaultEnd = 0x62FF;
  return String.fromCharCode(start + Math.random() * (end - start + 1));
}

function randFrom(blockName) {
  var block = unicodeBlocks[blockName];
  var start = block[0];
  var end = block[1];
  return randChar(start, end);
}

function randomString(blockName) {
  var x = [];
  for (var i = 0; i < 1 + round(random(20)); i++) {
    x.push(randFrom(blockName));
  }
  return x.join('');
}

function firstDraw() {
  background(color(50));
  fill(255);
  textSize(40);
  text("drag image", width / 2, height / 3);
}

function draw() {
  background(color(50));
  fill(255);
  textSize(40);
  if (gImg) {
    image(gImg, 0, 0, width, height);
  }
  text(randomString('braille'), width / 4, random(height / 2));
}