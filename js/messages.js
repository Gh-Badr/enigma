let messageContainer = document.querySelector(".message-container");

function displayMessage(type, message = null) {
  if (type == "error") {
    messageContainer.innerHTML = message;
    messageContainer.classList.remove("warning-message", "valid-message");
    messageContainer.classList.add("error-message");
  } else if (type == "warning") {
    messageContainer.innerHTML = message;
    messageContainer.classList.remove("error-message", "valid-message");
    messageContainer.classList.add("warning-message");
  } else {
    messageContainer.innerHTML = "The code is valid !";
    messageContainer.classList.remove("warning-message", "error-message");
    messageContainer.classList.add("valid-message");
  }
}
