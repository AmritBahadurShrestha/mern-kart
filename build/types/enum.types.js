"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment_Method = exports.Order_Status = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
})(Role || (exports.Role = Role = {}));
var Order_Status;
(function (Order_Status) {
    Order_Status["PENDING"] = "PENDING";
    Order_Status["PROCESSING"] = "PROCESSING";
    Order_Status["SHIPPED"] = "SHIPPED";
    Order_Status["COMPLETED"] = "COMPLETED";
    Order_Status["CANCELLED"] = "CANCELLED";
})(Order_Status || (exports.Order_Status = Order_Status = {}));
var Payment_Method;
(function (Payment_Method) {
    Payment_Method["COD"] = "COD";
    Payment_Method["CARD"] = "CARD";
})(Payment_Method || (exports.Payment_Method = Payment_Method = {}));
