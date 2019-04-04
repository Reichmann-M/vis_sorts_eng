var values = [];
var count = 100;
var finished = false;
var aplay, slider, lswaps, lcomps, larray;
var bool_start = false;
var autoplay = true;

var sounds = true;
var soundeffect;
var osc;
var playing = false;

var TOTAL_SWAPS;
var TOTAL_ARRAY_ACCESSES;

var frameRATE = 10;

var _0 = [];
var _1 = [];
var _2 = [];
var _3 = [];
var _4 = [];
var _5 = [];
var _6 = [];
var _7 = [];
var _8 = [];
var _9 = [];

var max_digits;
var last_position;

var radix_counter = 0;

var help_array = [];

function setup() {
  createCanvas(window.innerWidth, 700);
  colorMode(HSB, height);
  background(100);
  osc = new p5.Oscillator();
  osc.setType("square");
  osc.freq(240);
  osc.amp(0.5, 0.05);

  settingsForHtmlElements();

  generateNumbers();
  if (autoplay) {
    callBackStart();
  }
}

// -----------------------------------------

function settingsForHtmlElements() {
  slider = document.getElementById("slider");
  frameRate(round(slider.value / 10));
  let frames = document.getElementById("frame_label");
  frames.innerHTML = "Speed: " + slider.value;

  aplay = document.getElementById("auplay");
  if (aplay.checked) {
    autoplay = true;
  } else {
    autoplay = false;
  }

  lswaps = document.getElementById("tswaps");
  lswaps.innerHTML = "Total swaps: -";
  lcomps = document.getElementById("tcomps");
  lcomps.innerHTML = "Total comparisons: -";
  larray = document.getElementById("tarray");
  larray.innerHTML = "Total array accesses: -";

  let tinput = document.getElementById("input");
  count = tinput.value;

  let cvolume = document.getElementById("checkSound");
  if (cvolume.checked) {
    sounds = true;
  } else {
    sounds = false;
  }
}

function callBackStart() {
  bool_start = true;
  loop();
  console.log("*Sorting started*");
}

function changeSoundEffects() {
  if (sounds) {
    sounds = false;
  } else {
    sounds = true;
  }
}

function editInput(c) {
  count = c;
  if (count > 50000 || count < 0) {
    alert("Size of array only from 1 to 50000");
    count = 25;
    let tinput = document.getElementById("input");
    tinput.value = round(count);
    background(100);
    generateNumbers();
  } else {
    generateNumbers();
  }
}

function changeAutoPlay() {
  if (autoplay) {
    autoplay = false;
    noLoop();
  } else {
    autoplay = true;
    loop();
  }
}

function sliderChange(c) {
  frameRATE = round(c / 10);
  frameRate(frameRATE);
  let frames = document.getElementById("frame_label");
  frames.innerHTML = "Speed: " + round(c);
}

function generateNumbers() {
  if (count > 300) {
    noStroke();
  } else {
    stroke(0);
    strokeWeight(map(count, 1, 399, 1, 3));
  }
  console.log("Numbers generated");
  values = [];
  background(100);
  for (var i = 0; i < count; i++) {
    values[i] = floor(random(1, height));
  }
  max_digits = getDigitsFromNumber(values[0]);
  for (var i = 1; i < values.length; i++) {
    TOTAL_ARRAY_ACCESSES++;
    let digs = getDigitsFromNumber(values[i]);
    if (digs > max_digits) {
      max_digits = digs;
    }
  }
  last_position = max_digits - 1;
  _0 = [];
  _1 = [];
  _2 = [];
  _3 = [];
  _4 = [];
  _5 = [];
  _6 = [];
  _7 = [];
  _8 = [];
  _9 = [];
  drawItems();
  radix_counter = 0;
  help_array = [];
  TOTAL_SWAPS = 0;
  TOTAL_ARRAY_ACCESSES = 0;
  finished = false;
  if (autoplay) {
    callBackStart();
  } else {
    noLoop();
  }
  settingsForHtmlElements();
}

function sorting_finished() {
  console.log("*Sorting finished!*");
  console.log("TOTAL SWAPS: " + TOTAL_SWAPS);
  console.log("TOTAL COMPARISONS: " + 0);
  console.log("TOTAL ARRAY ACCESSES: " + TOTAL_ARRAY_ACCESSES);
  console.log("--------------------");

  lswaps.innerHTML = "Total swaps: " + TOTAL_SWAPS;
  lcomps.innerHTML = "Total comparisons: " + 0;
  larray.innerHTML = "Total array accesses: " + TOTAL_ARRAY_ACCESSES;
  bool_start = false;
  noLoop();
}

// -----------------------------------------

function drawItems() {
  background(100);
  for (var i = 0; i < values.length; i++) {
    let col = color(values[i], height, height);
    let location = map(i, 0, values.length, 0, width);
    colorMode(RGB);
    fill(col);
    colorMode(HSB, height);
    rect(location, height - values[i], width / count, height);
  }
}

function draw() {
  if (bool_start) {
    if (!finished) {
      RadixSort();
    } else {
      sorting_finished();
    }
    drawItems();
  }
}

function RadixSort() {
  for (var i = 0; i < values.length; i++) {
    let len = getDigitsFromNumber(values[i]);
    TOTAL_ARRAY_ACCESSES++;
    if (len == max_digits) {
      let zif = getZifferFromNumber(values[i], last_position);
      TOTAL_ARRAY_ACCESSES++;
      bucketSorting(values[i], zif);
    } else {
      if (radix_counter == 0) {
        let zif = getZifferFromNumber(values[i], len - 1);
        TOTAL_ARRAY_ACCESSES++;
        bucketSorting(values[i], zif);
      } else {
        bucketSorting(values[i], 0);
      }
      if (sounds) {
        osc.freq(map(values[i], 0, height, 100, 1200));
        osc.start();
        osc.stop(0.04);
      }
    }
  }

  if (radix_counter == max_digits - 1) {
    radixEndSort();
    finished = true;
  } else {
    radix_counter++;
    last_position--;
    values = [];
    putMinorArraysInMajorArray();
  }
}

function radixEndSort() {
  values = [];
  for (var i = 0; i < _1.length; i++) {
    values.push(_1[i]);
  }
  for (var i = 0; i < _2.length; i++) {
    values.push(_2[i]);
  }
  for (var i = 0; i < _3.length; i++) {
    values.push(_3[i]);
  }
  for (var i = 0; i < _4.length; i++) {
    values.push(_4[i]);
  }
  for (var i = 0; i < _5.length; i++) {
    values.push(_5[i]);
  }
  for (var i = 0; i < _6.length; i++) {
    values.push(_6[i]);
  }
  for (var i = 0; i < _7.length; i++) {
    values.push(_7[i]);
  }
  for (var i = 0; i < _8.length; i++) {
    values.push(_8[i]);
  }
  for (var i = 0; i < _9.length; i++) {
    values.push(_9[i]);
  }
  _1 = [];
  _2 = [];
  _3 = [];
  _4 = [];
  _5 = [];
  _6 = [];
  _7 = [];
  _8 = [];
  _9 = [];
  help_array = [];
  help_array = _0;
  _0 = [];
  max_digits = getDigitsFromNumber(help_array[0]);
  TOTAL_ARRAY_ACCESSES++;
  for (var i = 1; i < help_array.length; i++) {
    let digs = getDigitsFromNumber(help_array[i]);
    TOTAL_ARRAY_ACCESSES++;
    if (digs > max_digits) {
      max_digits = digs;
    }
  }
  last_position = max_digits - 1;
  for (var i = 0; i < help_array.length; i++) {
    let len = getDigitsFromNumber(help_array[i]);
    TOTAL_ARRAY_ACCESSES++;
    if (len > 1) {
      let zif = getZifferFromNumber(help_array[i], 0);
      bucketSorting(help_array[i], zif);
      TOTAL_ARRAY_ACCESSES++;
    } else {
      bucketSorting(help_array[i], 0);
    }
    if (sounds) {
      osc.freq(map(values[i], 0, height, 100, 1200));
      osc.start();
      osc.stop(0.04);
    }
  }
  help_array = [];
  for (var i = 0; i < _0.length; i++) {
    help_array.push(_0[i]);
  }
  for (var i = 0; i < _1.length; i++) {
    help_array.push(_1[i]);
  }
  for (var i = 0; i < _2.length; i++) {
    help_array.push(_2[i]);
  }
  for (var i = 0; i < _3.length; i++) {
    help_array.push(_3[i]);
  }
  for (var i = 0; i < _4.length; i++) {
    help_array.push(_4[i]);
  }
  for (var i = 0; i < _5.length; i++) {
    help_array.push(_5[i]);
  }
  for (var i = 0; i < _6.length; i++) {
    help_array.push(_6[i]);
  }
  for (var i = 0; i < _7.length; i++) {
    help_array.push(_7[i]);
  }
  for (var i = 0; i < _8.length; i++) {
    help_array.push(_8[i]);
  }
  for (var i = 0; i < _9.length; i++) {
    help_array.push(_9[i]);
  }
  for (var i = help_array.length - 1; i > 0; i--) {
    values.unshift(help_array[i]);
  }
  TOTAL_SWAPS = TOTAL_SWAPS + help_array.length;
}

function bucketSorting(num, ziffer) {
  switch (round(ziffer)) {
    case 0:
      _0.push(num);
      break;
    case 1:
      _1.push(num);
      break;
    case 2:
      _2.push(num);
      break;
    case 3:
      _3.push(num);
      break;
    case 4:
      _4.push(num);
      break;
    case 5:
      _5.push(num);
      break;
    case 6:
      _6.push(num);
      break;
    case 7:
      _7.push(num);
      break;
    case 8:
      _8.push(num);
      break;
    case 9:
      _9.push(num);
      break;
  }
}

function putMinorArraysInMajorArray() {
  for (var i = 0; i < _0.length; i++) {
    values.push(_0[i]);
  }
  for (var i = 0; i < _1.length; i++) {
    values.push(_1[i]);
  }
  for (var i = 0; i < _2.length; i++) {
    values.push(_2[i]);
  }
  for (var i = 0; i < _3.length; i++) {
    values.push(_3[i]);
  }
  for (var i = 0; i < _4.length; i++) {
    values.push(_4[i]);
  }
  for (var i = 0; i < _5.length; i++) {
    values.push(_5[i]);
  }
  for (var i = 0; i < _6.length; i++) {
    values.push(_6[i]);
  }
  for (var i = 0; i < _7.length; i++) {
    values.push(_7[i]);
  }
  for (var i = 0; i < _8.length; i++) {
    values.push(_8[i]);
  }
  for (var i = 0; i < _9.length; i++) {
    values.push(_9[i]);
  }
  _0 = [];
  _1 = [];
  _2 = [];
  _3 = [];
  _4 = [];
  _5 = [];
  _6 = [];
  _7 = [];
  _8 = [];
  _9 = [];
  TOTAL_SWAPS = TOTAL_SWAPS + values.length;
}

function getZifferFromNumber(num, pos) {
  return num.toString()[pos];
}

function getDigitsFromNumber(num) {
  return num.toString().length;
}
