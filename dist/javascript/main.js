// Our goal is to create a customizable clock that can function as an alarm or stopwatch.
// Optionally, we want different pictures to appear in the back of the clockface depending on time.
// Because of GH Pages limitations, we must do this without form submissions

var heading = document.querySelector(".heading");

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

// Write a function that updates current date object every second
function tick() {
  let currentTime = new Date();
  render("It is now " + currentTime.toString(), heading);
}

window.setInterval(tick, 1000);
