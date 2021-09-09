"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var server_1 = __importDefault(require("./clases/server"));
var server = server_1.default.instance;
server.app.enable('trusty proxy');
server.app.use(express_1.default.urlencoded({ extended: true }));
server.app.use(express_1.default.json());
server.app.use(cors_1.default({ origin: '*', credentials: true }));
var user_1 = __importDefault(require("./rutas/user"));
server.app.use('/users', user_1.default);
server.iniciar();
