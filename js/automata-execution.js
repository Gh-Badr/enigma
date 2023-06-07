//Global declarations
var currentStateCircle;
var currentTransition;

function styleState(stateID, color, width) {
  currentStateCircle = document.getElementById("state_" + stateID);
  currentStateCircle.firstElementChild.setAttribute("stroke", color);
  currentStateCircle.firstElementChild.setAttribute("stroke-width", width);
}

function fireLoopTransition(stateID) {
  currentTransition = document.getElementById("loopArc_" + stateID);
  styleTransition("blue", 1.5);
}

function fireDirectTransition(start, end) {
  currentTransition = document.getElementById(start + end);
  styleTransition("blue", 1.5);
}

function styleTransition(color, width) {
  if (currentTransition == null) return;
  currentTransition.setAttribute("stroke", color);
  currentTransition.setAttribute("stroke-width", width);
}
