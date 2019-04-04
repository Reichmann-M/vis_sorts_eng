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

var swaps, loops;
var cycles = 1;

var pivot;

var TOTAL_SWAPS;
var TOTAL_ARRAY_ACCESSES;

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
  if (autoplay == true) {
    callBackStart();
  }
}

// -----------------------------------------

function settingsForHtmlElements() {
  slider = document.getElementById("slider");
  frameRate(slider.value);
  let frames = document.getElementById("frame_label");
  frames.innerHTML = "Frames per second: " + slider.value;

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
  if (count > 5000 || count < 0) {
    alert("Size of array only from 1 to 5000");
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
  frameRate(round(c));
  let frames = document.getElementById("frame_label");
  frames.innerHTML = "Frames per second: " + round(c);
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
  pivot = values.length;
  drawItems();
  swaps = 0;
  loops = 0;
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
  console.log("TOTAL COMPARISONS: " + TOTAL_ARRAY_ACCESSES / 2);
  console.log("TOTAL ARRAY ACCESSES: " + TOTAL_ARRAY_ACCESSES);
  console.log("--------------------");

  lswaps.innerHTML = "Total swaps: " + TOTAL_SWAPS;
  lcomps.innerHTML = "Total comparisons: " + TOTAL_ARRAY_ACCESSES / 2;
  larray.innerHTML = "Total array accesses: " + TOTAL_ARRAY_ACCESSES;

  bool_start = false;
  noLoop();
}

// -----------------------------------------

function drawItems() {
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
    background(100);
    if (!finished) {
      SelectionSort();
    } else {
      sorting_finished();
    }
    drawItems();
  }
}

function SelectionSort() {
  let max_val = values[0];
  let max_pos = 0;
  for (let i = 1; i < pivot; i++) {
    if (values[i] > max_val) {
      max_val = values[i];
      max_pos = i;
      TOTAL_ARRAY_ACCESSES += 2;
    }
  }
  swap(values, max_pos, pivot - 1);
  if (sounds) {
    osc.freq(map(values[pivot - 1], 0, height, 100, 1200));
    osc.start();
    osc.stop(0.04);
  }
  TOTAL_SWAPS++;
  if (pivot == 1) {
    finished = true;
  } else {
    pivot--;
  }
}

swap = function(arr, a, b) {
  let temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
};
