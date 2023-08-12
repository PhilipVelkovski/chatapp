/**
 * Express server.
 * Application entrypoint.
 */
import path from "path";
import http from "http";
import express from "express";
import socketio, { Socket } from "socket.io";
async function main() {

  const PORT = process.env.PORT || 3000;
  const app = express();
  const server = http.createServer(app);

  //@ts-ignore
  const io = socketio(server);
  const publicDirectory = path.join(__dirname, "./public");

  
  app.use(express.static(publicDirectory));
  let count = 0;

  io.on("connection", (socket: Socket) => {

    socket.emit("message", "Welcome!");
    socket.emit("countUpdated", count);

    socket.on('increment',()=>{
      count++;
      io.emit('countUpdated', count)
    })

    socket.on('sendMessage',(data)=>{
      io.emit('gotenMessage',data)

    })
    console.log("New web socket connection...");
  
  });
  server.listen(PORT, async () => {
    console.log(`Server Started on port ${PORT}...`);
  });
}
main();