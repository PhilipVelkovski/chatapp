const socket = io();

// listen event - socket.on()
// emit event - socket.emit()

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = document.querySelector("#message");
const $messageFormButton = document.querySelector("#send-message");
const $getLocationButton = document.querySelector("#get-location");
const $messages = document.querySelector("#messages");

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoScroll = () => {
  //New message
  const $newMessage = $messages.lastElementChild;

  // Height of new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $messages.offsetHeight;

  //Height of mes container
  const containerHeight = $messages.scrollHeight;

  // How far has been scroled
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
  console.log(newMessageMargin);
};

socket.on("locationMessage", (message) => {
  console.log(message);
  // Mustache library
  const html = Mustache.render(locationTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  // Inject html
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("roomData", ({ room, users }) => {
  console.log("room " + room);
  console.log("users " + users);
  // Mustache library
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  // Inject html
  document.querySelector("#sidebar").innerHTML = html;
  autoScroll();
});

socket.on("message", (message) => {
  console.log(message);
  // Mustache library
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  // Inject html
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("gotenMessage", (message) => [console.log(message)]);

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // disable send button
  console.log("message " + $messageFormInput.value);
  $messageFormButton.setAttribute("disabled", "disabled");
  const message = $messageFormInput.value;

  socket.emit("sendMessage", message, (error) => {
    // Enable button after message was acknowleged
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if (error) {
      return console.log(error);
    }
  });
});

$getLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Your browser does not support geolocation");
  }
  //Disable button before emiting event
  $getLocationButton.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((currentPosition) => {
    socket.emit(
      "sendLocation",
      {
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      },
      () => {
        $getLocationButton.removeAttribute("disabled");

        console.log("Location shared");
      }
    );
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
