// Our goal is to create a customizable clock that can function as an alarm or stopwatch.
// Optionally, we want different pictures to appear in the back of the clockface depending on time.
// Because of GH Pages limitations, we must do this without form submissions

// DOM selection
const heading = document.querySelector(".heading");
const clockFace = document.querySelector(".clock-face");
const clockRadio = document.querySelector(".clock-settings");
const radioButtons = document.querySelectorAll(".clock-settings input");
const reset = document.querySelector(".reset");
const setTimerBtn = document.querySelector(".timer");
const setStopwatchBtn = document.querySelector(".stopwatch");
const setClockBtn = document.querySelector(".clock");
// selectors for dropdown menus for timer and stopwatch
const hours = document.querySelector("#hours");
const minutes = document.querySelector("#minutes");
const seconds = document.querySelector("#seconds");

// array of class names to be randomized for clockface picture
const picsClass = ["pic1", "pic2", "pic3", "pic4", "pic5", "pic6"];
// time in seconds between clockface background changes
let picsTime = 10;
let picsInit = 0;

// variables to handle clock duties
let ticking = true;
let downTicking = false;
let upTicking = false;
let timerSet = false;
let timerStopped = false;
let timerStarted = false;
let stopwatchSet = false;
let stopwatchStarted = false;
// variables to store interval handlers
let handlers = [
  window.setInterval(upTick, 1000),
  window.setInterval(downTick, 1000),
  window.setInterval(tick, 1000)
];

let radioDefault = true;

let defaultDisplay = "00:00:00";

let countDown = new Object(); // we will add properties to this fella later, but it will only function along with the timer
let currentTime = new Date();

// is it good practice to have a function that initializes stuff?

function init() {
  reset.addEventListener("click", resetClock);
  setTimerBtn.addEventListener("click", goTimer);
  setStopwatchBtn.addEventListener("click", goStopwatch);
  setClockBtn.addEventListener("click", setClock);
  window.setInterval(tick, 1000);
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
  if (ticking) {
    countDown.hours = currentTime.getHours();
    countDown.minutes = currentTime.getMinutes();
    countDown.seconds = currentTime.getSeconds();

    formatHours();
    picsInit++;
    if (picsInit == picsTime) {
      clockPic();
    }
  }
}

function resetClock() {
  ticking = false;
  stopwatchSet = false;
  downTicking = false;
  upTicking = false;
  timerSet = false;
  timerStarted = false;

  clockFace.innerHTML = defaultDisplay;
  countDown.hours = 0;
  countDown.minutes = 0;
  countDown.seconds = 0;

  // clear intervals
  for (var i = 0; i < handlers.length; i++) {
    clearInterval(handlers[i]);
  }
  radioButtons.forEach(item => {
    item.checked = false;
  });
}

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
  if (!timerSet) {
    setTimer();
  } else if (!timerStarted) {
    startTimer();
  } else {
    stopTimer();
  }
}

function goStopwatch() {
  if (!stopwatchSet) {
    setStopwatch();
  } else {
    stopStopwatch();
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

    timerSet = true;
    setTimerBtn.innerHTML = "Start Timer";
  } else {
    alert("Please set a time greater than zero seconds");
  }
}

function startTimer() {
  window.setInterval(downTick, 1000);
  downTicking = true;
  timerStarted = true;
  setTimerBtn.innerHTML = "Stop Timer";
}

function stopTimer() {
  downTicking = false;
  timerSet = false;
  timerStarted = false;
  setTimerBtn.innerHTML = "Set Timer";
}
function downTick() {
  if (downTicking) {
    countDown.seconds--;
    if (countDown.seconds < 0) {
      countDown.seconds = 59;
      countDown.minutes--;
      if (countDown.minutes < 0) {
        countDown.minutes = 59;
        countDown.hours--;
      }
    }
    formatHours();

    if (time === "00:00:00") {
      render("TIME", clockFace);
      timerStopped = true;
      stopTimer();
    }
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
}

function setStopwatch() {
  resetClock();
  formatHours();
  window.setInterval(upTick, 1000);
  upTicking = true;
  stopwatchSet = true;

  setStopwatchBtn.innerHTML = "Stop watch";
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
  render(display, clockFace);
  // we can't call formatHours() here because we want the time to remain on display.
  upTicking = false;
  stopwatchSet = false;
  setStopwatchBtn.innerHTML = "Start watch";
  resetClock();
}

function upTick() {
  if (upTicking) {
    countDown.seconds++;
    if (countDown.seconds > 59) {
      countDown.seconds = 0;
      countDown.minutes++;
      if (countDown.minutes > 59) {
        countDown.minutes = 0;
        countDown.hours++;
      }
    }
    formatHours();
  }
}
function setClock() {}

init();
