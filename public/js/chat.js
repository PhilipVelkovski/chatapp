// io();
const socket = io();
socket.on('couterON', () => {
    console.log("cout has been updated");
})