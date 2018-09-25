// Our goal is to create a customizable clock that can function as an alarm or stopwatch.
// Optionally, we want different pictures to appear in the back of the clockface depending on time.
// Because of GH Pages limitations, we must do this without form submissions

// DOM selection
const heading = document.querySelector(".heading");
const clockFace = document.querySelector(".clock-face");

// array of class names to be randomized for clockface picture
const picsClass = ["pic1", "pic2", "pic3", "pic4", "pic5", "pic6"];
// time in seconds between clockface background changes
let picsTime = 10;
let picsInit = 0;

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
    return increment;
  } else {
    increment.toString();
    return increment;
  }
}

// write a function that adds new picture to clock face
function clockPic() {
  var selector = 100;
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
  let currentTime = new Date();
  let setHours = doubleDigits(currentTime.getHours());
  let setMinutes = doubleDigits(currentTime.getMinutes());
  let setSeconds = doubleDigits(currentTime.getSeconds());

  let time = setHours + ":" + setMinutes + ":" + setSeconds;
  render("It is now " + time.toString(), clockFace);
  picsInit++;
  if (picsInit == picsTime) {
    clockPic();
  }
}

window.setInterval(tick, 1000);
