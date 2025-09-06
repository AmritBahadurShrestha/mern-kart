"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const global_types_1 = require("../types/global.types");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const router = express_1.default.Router();
// GET /api/dashboard
router.get("/", (0, auth_middleware_1.authenticate)(global_types_1.allAdmins), dashboard_controller_1.getDashboard);
exports.default = router;
