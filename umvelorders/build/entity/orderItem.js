"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItem = void 0;
var typeorm_1 = require("typeorm");
var item_1 = require("./item");
var order_1 = require("./order");
var OrderItem = /** @class */ (function (_super) {
    __extends(OrderItem, _super);
    function OrderItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], OrderItem.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return order_1.Order; }, function (order_id) { return order_id.id; }),
        (0, typeorm_1.JoinColumn)(),
        __metadata("design:type", order_1.Order)
    ], OrderItem.prototype, "order", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return item_1.Item; }),
        (0, typeorm_1.JoinColumn)(),
        __metadata("design:type", item_1.Item)
    ], OrderItem.prototype, "item", void 0);
    OrderItem = __decorate([
        (0, typeorm_1.Entity)()
    ], OrderItem);
    return OrderItem;
}(typeorm_1.BaseEntity));
exports.OrderItem = OrderItem;
