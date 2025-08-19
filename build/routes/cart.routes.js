"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const global_types_1 = require("../types/global.types");
const router = express_1.default.Router();
router.post("/", (0, auth_middleware_1.authenticate)(global_types_1.onlyUser), cart_controller_1.create);
router.get("/", (0, auth_middleware_1.authenticate)(global_types_1.onlyUser), cart_controller_1.getCart);
router.delete("/", (0, auth_middleware_1.authenticate)(global_types_1.onlyUser), cart_controller_1.clearCart);
router.put("/", (0, auth_middleware_1.authenticate)(global_types_1.onlyUser), cart_controller_1.updateCartItem);
router.delete("/item/:productId", (0, auth_middleware_1.authenticate)(global_types_1.onlyUser), cart_controller_1.removeCartItem);
exports.default = router;
