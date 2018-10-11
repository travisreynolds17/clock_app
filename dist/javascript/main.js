// Our goal is to create a customizable clock that can function as an alarm or stopwatch.
// Optionally, we want different pictures to appear in the back of the clockface depending on time.
// Because of GH Pages limitations, we must do this without form submissions

// DOM selection
const heading = document.querySelector(".heading");
const clockFace = document.querySelector(".clock-face");

// button selectors
// toggles
const reset = document.querySelector("#reset");
const timerBtn = document.querySelector("#timer");
const clockBtn = document.querySelector("#clock");
const stopwatchBtn = document.querySelector("#stopwatch");
//set/start buttons

let goButton = new Object();
goButton = document.querySelector(".go");
state = "clock"; //default

// selectors for dropdown menus for timer and stopwatch
const hours = document.querySelector("#hours");
const minutes = document.querySelector("#minutes");
const seconds = document.querySelector("#seconds");
const timerSettings = document.querySelector(".timer-settings");

// array of class names to be randomized for clockface picture
const picsClass = ["pic1", "pic2", "pic3", "pic4", "pic5", "pic6"];
// time in seconds between clockface background changes
let picsTime = 10;
let picsInit = 0;

// variables to store interval handlers
let interval;

let defaultDisplay = "00:00:00";

let countDown = new Object(); // we will add properties to this fella later, but it will only function along with the timer
let currentTime = new Date();

// is it good practice to have a function that initializes stuff?

function init() {
  reset.addEventListener("click", resetClock);

  clockBtn.addEventListener("click", toggle);
  timerBtn.addEventListener("click", toggle);
  stopwatchBtn.addEventListener("click", toggle);
  goButton.addEventListener("click", goBtn);

  // start clock ticking
  interval = window.setInterval(tick, 1000);

  populateSelects();
}

// We will write a function that places an HTML element template at a specified position (node) in the HTML markup
function render(template, node) {
  // check to make sure the node exists
  if (!node) {
    return;
  } else {
    // replace content of node with template
    node.innerHTML = template;
  }
}

//create a function that ensures each hour, minute, and second variable is two digits even if less than 10, then convert to string
function doubleDigits(increment) {
  if (increment < 10) {
    increment = "0" + increment.toString();
  } else {
    increment.toString();
  }
  return increment;
}

// write a function that adds new picture to clock face
function clockPic() {
  var selector = 100; // we just need this to be outside of the range of picsClass.length
  while (selector > picsClass.length - 1) {
    selector = Math.floor(Math.random() * 10);
  }
  for (var i = 0; i < picsClass.length; i++) {
    clockFace.classList.remove(picsClass[i]);
  }
  clockFace.classList.add(picsClass[selector]);
  // reset timer between changes
  picsInit = 0;
}

// Write a function that updates current date object every second and calls picture changing function
function tick() {
  console.log("a");
  currentTime = new Date();
  countDown.hours = currentTime.getHours();
  countDown.minutes = currentTime.getMinutes();
  countDown.seconds = currentTime.getSeconds();

  formatHours();
  picsInit++;
  if (picsInit == picsTime) {
    clockPic();
  }
}

function resetClock() {
  state = "clock";
  goButton.innerHTML = "Set Clock";

  clockFace.innerHTML = defaultDisplay;
  countDown.hours = 0;
  countDown.minutes = 0;
  countDown.seconds = 0;

  // clear intervals

  window.clearInterval(interval);
}

// function inserts <select> options used to set timer
function populateSelects() {
  let i = 23;
  function getShell() {
    let shell = "<option value = '" + i + "'>" + i + "</option>";
    shell.toString();
    return shell;
  }
  while (i >= 0) {
    let shell = getShell();
    hours.insertAdjacentHTML("afterBegin", shell);
    i--;
  }

  i = 59;

  while (i >= 0) {
    let shell = getShell();
    minutes.insertAdjacentHTML("afterBegin", shell);
    seconds.insertAdjacentHTML("afterBegin", shell);
    i--;
  }
}

function goTimer() {
  if (state == "timer") {
    setTimer();
  } else if (state == "timer set") {
    startTimer();
  } else {
    stopTimer();
  }
}

function setTimer() {
  resetClock();
  countDown.hours = hours.value;
  countDown.minutes = minutes.value;
  countDown.seconds = seconds.value;

  var test = countDown.hours + countDown.minutes + countDown.seconds;

  if (test > 0) {
    formatHours();

    state = "timer set";
    goButton.innerHTML = "Start Timer";
  } else {
    alert("Please set a time greater than zero seconds");
  }
}

function startTimer() {
  interval = window.setInterval(downTick, 1000);
  state = "timer started";
  goButton.innerHTML = "Stop Timer";
}

function stopTimer() {
  state = "timer";
  goButton.innerHTML = "Set Timer";
  resetClock();
}
function downTick() {
  console.log("b");
  countDown.seconds--;
  if (countDown.seconds < 0) {
    countDown.seconds = 59;
    countDown.minutes--;
    if (countDown.minutes < 0) {
      countDown.minutes = 59;
      countDown.hours--;
    }
  }
  time = formatHours();

  if (time === "00:00:00") {
    render("TIME", clockFace);
    timerStopped = true;
    stopTimer();
  }
}

function formatHours() {
  var display =
    doubleDigits(countDown.hours).toString() +
    ":" +
    doubleDigits(countDown.minutes).toString() +
    ":" +
    doubleDigits(countDown.seconds).toString();
  render(display, clockFace);
  return display;
}

function setStopwatch() {
  resetClock();
  formatHours();
  interval = window.setInterval(upTick, 1000);
  state = "stopwatch set";
  goButton.innerHTML = "Stop";
}
function stopStopwatch() {
  var hours = countDown.hours;
  var minutes = countDown.minutes;
  var seconds = countDown.seconds;

  var display =
    doubleDigits(hours).toString() +
    ":" +
    doubleDigits(minutes).toString() +
    ":" +
    doubleDigits(seconds).toString();

  // we can't call formatHours() here because we want the time to remain on display.
  state = "stopwatch";
  goButton.innerHTML = "Start watch";
  resetClock();
  render(display, clockFace);
}

function upTick() {
  console.log("c");
  countDown.seconds++;
  if (countDown.seconds > 59) {
    countDown.seconds = 0;
    countDown.minutes++;
    if (countDown.minutes > 59) {
      countDown.minutes = 0;
      countDown.hours++;
    }
  }

  var display = formatHours();
  console.log(display);
}
// returns clock to time display
function setClock() {
  resetClock();
  interval = window.setInterval(tick, 1000);
  goButton.innerHTML = "Set Clock";
}

// function toggles which functionality is in use
function toggle() {
  var clicked = this.id.toLowerCase();

  if (clicked != "timer") {
    timerSettings.classList.remove("show");
  } else {
    timerSettings.classList.add("show");
    goButton.innerHTML = "Set Timer";
  }
  if (clicked == "clock") goButton.innerHTML = "Set Clock";

  if (clicked == "stopwatch") goButton.innerHTML = "Set Stopwatch";

  state = clicked;
}

function setBtnHTML(state) {}

function goBtn() {
  switch (state) {
    case "clock":
      setClock();
      break;

    case "timer":
      setTimer();
      break;

    case "timer set":
      startTimer();
      break;

    case "timer started":
      stopTimer();
      break;

    case "stopwatch":
      setStopwatch();
      break;

    case "stopwatch set":
      stopStopwatch();
      break;

    default:
      console.log("something went wrong");
      break;
  }
}

init();
