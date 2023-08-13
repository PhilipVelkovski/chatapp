"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const removeUser = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const index = users.findIndex((user) => user.roomId === roomId);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
    return undefined;
});
exports.removeUser = removeUser;
const getUser = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    return users.find((user) => user.roomId === roomId);
});
exports.getUser = getUser;
const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter((user) => user.room === room);
};
exports.getUsersInRoom = getUsersInRoom;
