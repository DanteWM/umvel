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
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var item_1 = require("../entity/item");
var order_1 = require("../entity/order");
var orderItem_1 = require("../entity/orderItem");
var OrderService = /** @class */ (function () {
    function OrderService() {
    }
    OrderService.prototype.createOrder = function (items, user, customer_name, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findItems(items).then(function (itemsDB) { return __awaiter(_this, void 0, void 0, function () {
                            var subtotal, total, vat, order, _a, orderDB, orderItems;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, this.getTotalPrice(itemsDB)];
                                    case 1:
                                        subtotal = _b.sent();
                                        total = subtotal * 1.16;
                                        vat = total - subtotal;
                                        order = new order_1.Order();
                                        order.customer_name = customer_name;
                                        order.total_items = itemsDB.length;
                                        _a = order;
                                        return [4 /*yield*/, this.getTotalPrice(itemsDB)];
                                    case 2:
                                        _a.subtotal = _b.sent();
                                        order.vat = vat;
                                        order.total = total;
                                        order.status = 'COMMANDED';
                                        order.token = new Date(Date.now()).toISOString();
                                        return [4 /*yield*/, this.prepareOrder(order)];
                                    case 3:
                                        orderDB = _b.sent();
                                        return [4 /*yield*/, this.createOrderItems(itemsDB, orderDB)];
                                    case 4:
                                        orderItems = _b.sent();
                                        orderDB.order_items = orderItems;
                                        orderDB.save().then(function (orderUp) {
                                            return callback({ ok: true, mensaje: orderUp, orderItems: orderItems, respuesta: itemsDB, codigo: 200 });
                                        }).catch(function (err) {
                                            return callback({ ok: false, mensaje: "Error al actualizar orden " + orderDB.id, respuesta: err, codigo: 500 });
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        }); }).catch(function (err) {
                            return callback({ ok: false, mensaje: 'Ocurrio un error', respuesta: err, codigo: 400 });
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.updateOrder = function (order, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var orderDB, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, typeorm_1.getRepository)(order_1.Order).findOne(order.id)];
                    case 1:
                        orderDB = _a.sent();
                        if (!(orderDB !== undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, typeorm_1.getRepository)(order_1.Order).merge(orderDB, order)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, callback({ ok: true, mensaje: 'Actualizado con exito', respuesta: result, codigo: 200 })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.allOrders = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, typeorm_1.getRepository)(order_1.Order).find().then(function (orders) {
                            if (orders.length < 1) {
                                return callback({ ok: false, mensaje: 'No hay ordenes en la base de datos', respuesta: null, codigo: 404 });
                            }
                            return callback({ ok: true, mensaje: 'Ordenes recuperadas correctamente', respuesta: orders, codigo: 200 });
                        }).catch(function (err) {
                            return callback({ ok: false, mensaje: 'Error en base de datos', respuesta: err, codigo: 500 });
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.allItems = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, typeorm_1.getRepository)(item_1.Item).find().then(function (items) {
                            if (items.length < 1) {
                                return callback({ ok: false, mensaje: 'No hay items en la base de datos', respuesta: null, codigo: 404 });
                            }
                            return callback({ ok: true, mensaje: 'Ordenes recuperadas correctamente', respuesta: items, codigo: 200 });
                        }).catch(function (err) {
                            return callback({ ok: false, mensaje: 'Error en base de datos', respuesta: err, codigo: 500 });
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.createItem = function (item, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        item.price = Number(item.price);
                        return [4 /*yield*/, (0, typeorm_1.getRepository)(item_1.Item).create(item)
                                .save().then(function (itemDB) {
                                return callback({ ok: true, mensaje: 'Item creado con exito', respuesta: itemDB, codigo: 200 });
                            }).catch(function (err) {
                                return callback({ ok: false, mensaje: 'Error en base de datos', respuesta: err, codigo: 500 });
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.createItemNC = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, typeorm_1.getRepository)(item_1.Item).create(item)
                            .save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.findItems = function (items) {
        return __awaiter(this, void 0, void 0, function () {
            var itemsDB;
            var _this = this;
            return __generator(this, function (_a) {
                itemsDB = [];
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _i, items_1, item, itemDB;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _i = 0, items_1 = items;
                                    _a.label = 1;
                                case 1:
                                    if (!(_i < items_1.length)) return [3 /*break*/, 4];
                                    item = items_1[_i];
                                    return [4 /*yield*/, (0, typeorm_1.getRepository)(item_1.Item).findOne(item)];
                                case 2:
                                    itemDB = _a.sent();
                                    if (itemDB) {
                                        itemsDB.push(itemDB);
                                    }
                                    else {
                                        reject("No existen items con el id " + item);
                                    }
                                    _a.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4:
                                    resolve(itemsDB);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    OrderService.prototype.prepareOrder = function (order) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        (0, typeorm_1.getRepository)(order_1.Order).create(order)
                            .save().then(function (orderDB) {
                            resolve(orderDB);
                        }).catch(function (err) {
                            reject(err);
                        });
                    })];
            });
        });
    };
    OrderService.prototype.createOrderItems = function (items, order) {
        return __awaiter(this, void 0, void 0, function () {
            var orderItems;
            var _this = this;
            return __generator(this, function (_a) {
                orderItems = [];
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _i, items_2, item, orderItem;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _i = 0, items_2 = items;
                                    _a.label = 1;
                                case 1:
                                    if (!(_i < items_2.length)) return [3 /*break*/, 4];
                                    item = items_2[_i];
                                    orderItem = new orderItem_1.OrderItem;
                                    orderItem.item = item;
                                    orderItem.order = order;
                                    return [4 /*yield*/, this.createOrderItem(orderItem).then(function (orderItemDB) {
                                            orderItems.push(orderItemDB);
                                        }).catch(function (err) {
                                            reject(err);
                                        })];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4:
                                    resolve(orderItems);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    OrderService.prototype.createOrderItem = function (orderItem) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        (0, typeorm_1.getRepository)(orderItem_1.OrderItem).create(orderItem).save()
                            .then(function (orderItemDB) {
                            resolve(orderItemDB);
                        }).catch(function (err) {
                            reject(err);
                        });
                    })];
            });
        });
    };
    OrderService.prototype.getTotalPrice = function (items) {
        return new Promise(function (resolve) {
            var total = 0;
            for (var _i = 0, items_3 = items; _i < items_3.length; _i++) {
                var item = items_3[_i];
                total += item.price;
            }
            resolve(total);
        });
    };
    OrderService.prototype.updateStatusOrder = function (idOrder, status, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, typeorm_1.getRepository)(order_1.Order).findOne(idOrder).then(function (order) {
                    if (order) {
                        switch (order.status) {
                            case 'OPEN':
                                if (status !== 'COMMANDED') {
                                    if (status !== 'CANCELLED') {
                                        return callback({ ok: false, mensaje: 'Error al actualizar status, se esperaba COMMANDED o CANCELLED', respuesta: null, codigo: 400 });
                                    }
                                }
                                break;
                            case 'COMMANDED':
                                if (status !== 'SERVED') {
                                    return callback({ ok: false, mensaje: 'Error al actualizar status se esperaba SERVED', respuesta: null, codigo: 400 });
                                }
                                break;
                            case 'SERVED':
                                if (status !== 'PAID') {
                                    return callback({ ok: false, mensaje: 'Error al actualizar status se esperaba PAID', respuesta: null, codigo: 400 });
                                }
                                break;
                            case 'PAID':
                                if (status !== 'CLOSED') {
                                    return callback({ ok: false, mensaje: 'Error al actualizar status se esperaba CLOSED', respuesta: null, codigo: 400 });
                                }
                                break;
                            case 'CANCELLED':
                                return callback({ ok: false, mensaje: 'Esta orden esta cancelada, no puedes hacer mas cambios', respuesta: null, codigo: 400 });
                                break;
                            case 'CLOSED':
                                return callback({ ok: false, mensaje: 'Esta orden ya esta cerrada y no se le pueden hacer cambios', respuesta: null, codigo: 400 });
                                break;
                        }
                        order.status = status;
                        order.save().then(function (orderUp) {
                            return callback({ ok: true, mensaje: 'Status de orden actualizada', respuesta: orderUp, codigo: 200 });
                        }).catch(function (err) {
                            return callback({ ok: false, mensaje: 'Error en base de datos', respuesta: err, codigo: 500 });
                        });
                    }
                    else {
                        return callback({ ok: false, mensaje: 'No existen ordenes con este id', respuesta: null, codigo: 400 });
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    OrderService.prototype.seedItems = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, _loop_1, this_1, _i, items_4, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = [
                            {
                                name: 'Pastel de chocolate',
                                price: 35.50
                            },
                            {
                                name: 'Cafe americado',
                                price: 22.00
                            },
                            {
                                name: 'Huevos estrellados',
                                price: 63.30
                            },
                            {
                                name: 'Fruta picada',
                                price: 45
                            },
                            {
                                name: 'Enchiladas suizas',
                                price: 110
                            },
                            {
                                name: 'Crepas',
                                price: 40
                            }
                        ];
                        _loop_1 = function (item) {
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, this_1.createItemNC(item).then(function (itemDB) {
                                            console.info("Item creado con exito " + item.name);
                                        })];
                                    case 1:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, items_4 = items;
                        _a.label = 1;
                    case 1:
                        if (!(_i < items_4.length)) return [3 /*break*/, 4];
                        item = items_4[_i];
                        return [5 /*yield**/, _loop_1(item)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return OrderService;
}());
exports.default = OrderService;
