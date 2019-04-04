var values = [];
var count = 100;
var aplay, slider, lswaps, lcomps, larray;

let curPivot, curHi, curLo;

var finished = false;
var qsCalled = false;

var bool_start = false;
var autoplay = true;

var sounds = true;
var soundeffect;
var osc;
var playing = false;

var TOTAL_SWAPS;
var TOTAL_ARRAY_ACCESSES;

var frameRATE = 50;

function setup() {
  createCanvas(window.innerWidth, 700);
  colorMode(HSB, height);
  background(100);
  settingsForHtmlElements();
  osc = new p5.Oscillator();
  osc.setType("square");
  osc.freq(240);
  osc.amp(0.5, 0.05);
  generateNumbers();
  if (autoplay) {
    callBackStart();
  }
}

// -----------------------------------------

function settingsForHtmlElements() {
  slider = document.getElementById("slider");
  frameRate(slider.value);
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
  let sorting_label = document.getElementById("loading");
  sorting_label.innerHTML = "Sorting...";
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
  } else {
    autoplay = true;
  }
}

function sliderChange(c) {
  frameRate(round(c));
  let frames = document.getElementById("frame_label");
  frames.innerHTML = "Speed: " + round(c);
  frameRATE = round(c);
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
  drawItems();
  finished = false;
  qsCalled = false;
  TOTAL_SWAPS = 0;
  TOTAL_ARRAY_ACCESSES = 0;
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

  let sorting_label = document.getElementById("loading");
  sorting_label.innerHTML = "";
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
      if (!qsCalled) {
        QuickSort(values, 0, values.length - 1);
        qsCalled = true;
      }
    } else {
      sorting_finished();
    }
    drawItems();
  }
}

swap = function(arr, a, b) {
  let temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
};

QuickSort = function(arr, lo, hi) {
  setTimeout(() => {
    if (lo < hi) {
      let mid = partition(arr, lo, hi);
      QuickSort(arr, lo, mid - 1);
      QuickSort(arr, mid + 1, hi);
      TOTAL_ARRAY_ACCESSES += 2;
    }
    drawItems();
  }, map(frameRATE, 0, 60, 500, 250));
  for (var i = 0; i < values.length; i++) {
    if (values[i + 1] < values[i]) {
      break;
    } else if (i == values.length - 1) {
      finished = true;
    }
  }
};
partition = function(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j <= high - 1; j++) {
    if (arr[j] <= pivot) {
      i++;
      swap(arr, i, j);
      if (sounds) {
        osc.freq(map(values[i], 0, height, 100, 1200));
        osc.start();
        osc.stop(0.04);
      }
      TOTAL_SWAPS++;
    }
  }
  swap(arr, i + 1, high);
  TOTAL_SWAPS++;
  return i + 1;
};
