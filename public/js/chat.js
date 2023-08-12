const socket = io();

// listen event - socket.on()
// emit event - socket.emit()

socket.on("countUpdated", (count) => {
  console.log("Cout has been updated!  " + count);
});

socket.on("message", (message) => [console.log(message)]);

socket.on("gotenMessage", (message) => [console.log(message)]);

document.querySelector("#increment").addEventListener("click", (e) => {
  socket.emit("increment");
});
document.querySelector("#form").addEventListener("click", (e) => {
  e.preventDefault();
  const message = document.querySelector("#name").value;
  socket.emit("sendMessage", message);
});

document.querySelector("get-location").addEventListener("click", (e) => {
  if (!navigator.geolocation) {
    return alert("Your browser does not support geolocation");
  }
  navigator.geolocation.getCurrentPosition((currentPosition) => {
    console.log(currentPosition);
  });
});
