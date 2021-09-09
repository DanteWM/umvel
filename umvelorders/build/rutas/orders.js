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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var rabbit_1 = __importDefault(require("../clases/rabbit"));
var order_1 = __importDefault(require("../controladoras/order"));
var authentication_1 = require("../middlewares/authentication");
var ordersRoutes = (0, express_1.Router)();
var orderService = new order_1.default;
var rabbit = new rabbit_1.default;
var queues = {
    order_list: 'order_list',
    order_create: 'order_create',
    order_update: 'order_update',
    item_list: 'item_list',
    item_create: 'item_create',
    item_update: 'item_update'
};
ordersRoutes.get('/', authentication_1.verifyToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, orderService.allOrders(function (respuesta) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, res.status(respuesta.codigo).json(respuesta)];
                    });
                }); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
ordersRoutes.post('/create', authentication_1.verifyToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, items, user, customer_name;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, items = _a.items, user = _a.user, customer_name = _a.customer_name;
                if (items.length < 1) {
                    return [2 /*return*/, res.status(400).json({ ok: false, mensaje: 'Debes elegir por lo menos un item para crear una orden', respuesta: null, codigo: 400 })];
                }
                if (!customer_name) {
                    return [2 /*return*/, res.status(400).json({ ok: false, mensaje: 'No enviaste el nombre del cliente', respuesta: null, codigo: 400 })];
                }
                return [4 /*yield*/, orderService.createOrder(items, user, customer_name, function (respuesta) {
                        return res.status(respuesta.codigo).json(respuesta);
                    })];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
ordersRoutes.put('/update', authentication_1.verifyToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var order;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                order = req.body.order;
                return [4 /*yield*/, orderService.updateOrder(order, function (respuesta) {
                        return res.status(respuesta.codigo).json(respuesta);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
ordersRoutes.put('/status', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, idOrder, status;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, idOrder = _a.idOrder, status = _a.status;
                return [4 /*yield*/, orderService.updateStatusOrder(idOrder, status, function (respuesta) {
                        return res.status(respuesta.codigo).json(respuesta);
                    })];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
ordersRoutes.get('/items', authentication_1.verifyToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, orderService.allItems(function (respuesta) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, res.status(respuesta.codigo).json(respuesta)];
                    });
                }); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
ordersRoutes.post('/item/create', authentication_1.verifyToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var item, channel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                item = req.body.item;
                return [4 /*yield*/, rabbit.channel(queues.item_create)];
            case 1:
                channel = _a.sent();
                return [4 /*yield*/, orderService.createItem(item, function (respuesta) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, rabbit.send(channel, queues.item_create, respuesta)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, res.status(respuesta.codigo).json(respuesta)];
                            }
                        });
                    }); })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.default = ordersRoutes;
