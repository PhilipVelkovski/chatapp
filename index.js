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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Express server.
 * Application entrypoint.
 */
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const bad_words_1 = __importDefault(require("bad-words"));
const socket_io_1 = __importDefault(require("socket.io"));
const messages_1 = require("./src/utils.ts/messages");
const users_1 = require("./src/utils.ts/users");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const PORT = process.env.PORT || 3000;
        const app = (0, express_1.default)();
        const server = http_1.default.createServer(app);
        //@ts-ignore
        const io = (0, socket_io_1.default)(server);
        const publicDirectory = path_1.default.join(__dirname, "./public");
        app.use(express_1.default.static(publicDirectory));
        io.on("connection", (socket) => {
            console.log("New web socket connection...");
            socket.on('join', ({ username, room }, callback) => {
                const newUser = (0, users_1.addUser)({ roomId: socket.id, username, room });
                if ('error' in newUser) {
                    return callback(newUser.error);
                }
                socket.join(room);
                socket.emit("message", (0, messages_1.generateMessage)('Admin', "Welcome!"));
                socket.broadcast.to(newUser.room).emit('message', (0, messages_1.generateMessage)("Admin", `${newUser.username} has joined!`));
                callback();
            });
            socket.on('sendMessage', (data, callback) => __awaiter(this, void 0, void 0, function* () {
                const user = yield (0, users_1.getUser)(socket.id);
                const filterMessage = new bad_words_1.default();
                if (filterMessage.isProfane(data)) {
                    return callback('Profanity is not alowed');
                }
                if (user) {
                    io.to(user === null || user === void 0 ? void 0 : user.room).emit('message', (0, messages_1.generateMessage)(user.username, data));
                    callback();
                }
                else {
                    callback();
                }
            }));
            socket.on("sendLocation", (cords, callback) => __awaiter(this, void 0, void 0, function* () {
                const user = yield (0, users_1.getUser)(socket.id);
                io.emit('locationMessage', (0, messages_1.generateLocationMesssage)(user === null || user === void 0 ? void 0 : user.username, `https://google.com/maps/?q=${cords.latitude},${cords.longitude}`));
                callback();
            }));
            socket.on('disconnect', () => __awaiter(this, void 0, void 0, function* () {
                const removedUser = yield (0, users_1.removeUser)(socket.id);
                if (removedUser !== undefined) {
                    //@ts-ignore
                    io.to(users_1.removeUser.room).emit('message', (0, messages_1.generateMessage)(users_1.removeUser.username, `${users_1.removeUser.username} has left the room!`));
                }
            }));
        });
        server.listen(PORT, () => __awaiter(this, void 0, void 0, function* () {
            console.log(`Server Started on port ${PORT}...`);
        }));
    });
}
main();
