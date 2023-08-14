/**
 * Express server.
 * Application entrypoint.
 */
import path from "path";
import http from "http";
import express from "express";
import filter from "bad-words"
import socketio, { Socket } from "socket.io";
import {generateMessage,generateLocationMesssage} from "./src/utils.ts/messages"

import {addUser,getUser,getUsersInRoom,removeUser, IUser} from "./src/utils.ts/users"


async function main() {

  const PORT = process.env.PORT || 3000;
  const app = express();
  const server = http.createServer(app);

  //@ts-ignore
  const io = socketio(server);
  const publicDirectory = path.join(__dirname, "./public");

  
  app.use(express.static(publicDirectory));

  io.on("connection", (socket: Socket) => {

    console.log("New web socket connection...");

  
    socket.on('join',({username,room}, callback)=>{
     const newUser =  addUser({roomId: socket.id, username,room});
     if('error' in newUser){ 
       return callback(newUser.error);
     }
     
      socket.join(room)
      socket.emit("message",generateMessage('Admin',"Welcome!"));

      socket.broadcast.to(newUser.room).emit('message',generateMessage("Admin",`${newUser.username} has joined!`))
      io.to(newUser.room).emit('roomData',{
        room: newUser.room,
        users: getUsersInRoom(newUser.room)
      })
      callback();
    })

    socket.on('sendMessage', async (data,callback)=>{
      const user = await getUser(socket.id);

      const filterMessage = new filter();

      if(filterMessage.isProfane(data)){
        return callback('Profanity is not alowed');
      }
      if(user){
        io.to(user?.room).emit('message', generateMessage(user.username as string,data))
        callback();
      } else { 
        callback();
      }

    })

    socket.on("sendLocation",async (cords,callback)=>{
      const user = await getUser(socket.id);
      io.emit('locationMessage',
      generateLocationMesssage(user?.username as string,`https://google.com/maps/?q=${cords.latitude},${cords.longitude}`)
      )
      callback();
    })

    socket.on('disconnect', ()=>{
      const removedUser =  removeUser(socket.id);
      if(removedUser as IUser){
        //@ts-ignore
        io.to(removeUser.room).emit('message', generateMessage( removeUser.username,`${removeUser.username} has left the room!`))
        //@ts-ignore
        io.to(removeUser.roon).emit('roomData',{
          
          //@ts-ignore
          room: removeUser.room,
          //@ts-ignore
          users: getUsersInRoom(removeUser.room)
        })
      }

    })
  });
  server.listen(PORT, async () => {
    console.log(`Server Started on port ${PORT}...`);
  });
}
main();