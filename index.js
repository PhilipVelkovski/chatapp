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
const socket_io_1 = __importDefault(require("socket.io"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const PORT = process.env.PORT || 3000;
        const app = (0, express_1.default)();
        const server = http_1.default.createServer(app);
        //@ts-ignore
        const io = (0, socket_io_1.default)(server);
        const publicDirectory = path_1.default.join(__dirname, "./public");
        //Parse incoming requests to JSON
        app.use(express_1.default.json());
        app.use(express_1.default.static(publicDirectory));
        io.on("connection", (socket) => {
            socket.emit("couterON");
            console.log("New web socket connection...");
        });
        server.listen(PORT, () => __awaiter(this, void 0, void 0, function* () {
            console.log(`Server Started on port ${PORT}...`);
        }));
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
