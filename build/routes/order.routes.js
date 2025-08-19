"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const global_types_1 = require("../types/global.types");
const router = express_1.default.Router();
router.post("/", (0, auth_middleware_1.authenticate)(global_types_1.onlyUser), order_controller_1.create);
router.get("/all", (0, auth_middleware_1.authenticate)(global_types_1.allAdmins), order_controller_1.getAllByAdmin);
router.get("/", (0, auth_middleware_1.authenticate)(global_types_1.onlyUser), order_controller_1.getAllByUser);
router.put("/", (0, auth_middleware_1.authenticate)(global_types_1.allAdmins), order_controller_1.update);
router.delete("/cancel", (0, auth_middleware_1.authenticate)(global_types_1.onlyUser), order_controller_1.cancel);
exports.default = router;
