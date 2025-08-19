"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const global_types_1 = require("../types/global.types");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get("/", (0, auth_middleware_1.authenticate)(global_types_1.allAdmins), user_controller_1.getAll);
router.get("/:id", user_controller_1.getById);
router.delete("/:id", (0, auth_middleware_1.authenticate)(global_types_1.allAdmins), user_controller_1.deleteById);
exports.default = router;
