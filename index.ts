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
  //Parse incoming requests to JSON
  app.use(express.json());
  app.use(express.static(publicDirectory));

  io.on("connection", (socket: Socket) => {
    socket.emit("couterON");
    console.log("New web socket connection...");
  });
  server.listen(PORT, async () => {
    console.log(`Server Started on port ${PORT}...`);
  });
}
main();
// class ExpressServer {
//   protected app: express.Application;
//   protected PORT = process.env.PORT || 3000;

//   constructor() {
//     this.app = express();
//     this.setUpExpress();
//   }

//   protected async setUpExpress(): Promise<void> {
//     const publicDirectory = path.join(__dirname, "./public");
//     //Parse incoming requests to JSON
//     this.app.use(express.json());
//     this.app.use(express.static(publicDirectory));
//     //Use user route handler
//   }

//   public async startUpServer(): Promise<void> {
//     this.app.listen(this.PORT, async () => {
//       console.log("Server Started...");
//     });
//   }
// }
