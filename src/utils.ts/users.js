"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersInRoom = exports.getUser = exports.removeUser = exports.addUser = void 0;
const users = [];
const addUser = (user) => {
    // Clean data
    let username = user.username.trim().toLowerCase();
    let room = user.room.trim().toLowerCase();
    let roomId = user.roomId;
    //Vaidate
    if (!username || !room) {
        return {
            error: "Username and room are required!",
        };
    }
    //Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });
    //Validate username
    if (existingUser) {
        return {
            error: "Username is in use!",
        };
    }
    //Store user
    const newUser = { roomId, username, room };
    users.push(newUser);
    return user;
};
exports.addUser = addUser;
const removeUser = (roomId) => {
    const index = users.findIndex((user) => user.roomId === roomId);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
    return undefined;
};
exports.removeUser = removeUser;
const getUser = (roomId) => {
    return users.find((user) => user.roomId === roomId);
};
exports.getUser = getUser;
const getUsersInRoom = (room) => {
    // room = room.trim().toLowerCase();
    return users.filter((user) => user.room === room);
};
exports.getUsersInRoom = getUsersInRoom;
