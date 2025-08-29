"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const db_config_1 = require("./config/db.config");
const error_handler_middleware_1 = __importStar(require("./middlewares/error-handler.middleware"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
// Importing Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const brand_routes_1 = __importDefault(require("./routes/brand.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const wish_list_routes_1 = __importDefault(require("./routes/wish_list.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const helmet_1 = __importDefault(require("helmet"));
const PORT = process.env.PORT;
const DB_URI = (_a = process.env.DB_URI) !== null && _a !== void 0 ? _a : "";
const app = (0, express_1.default)();
// Connect DB
(0, db_config_1.connectDatabase)(DB_URI);
// Using Middlewares
app.use((0, cors_1.default)({
    origin: process.env.FRONT_END_URL || 'http://localhost:5173',
    credentials: true
}));
app.use((0, helmet_1.default)());
app.use(express_1.default.json({ limit: "5mb" }));
app.use(express_1.default.urlencoded({ limit: "5mb", extended: true }));
// Using Cookie Parser
app.use((0, cookie_parser_1.default)());
// Serving uploads as static file
app.use("/api/uploads", express_1.default.static("uploads/"));
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is Up & Running",
    });
});
// Using Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/user", user_routes_1.default);
app.use("/api/brand", brand_routes_1.default);
app.use("/api/category", category_routes_1.default);
app.use("/api/product", product_routes_1.default);
app.use("/api/wish_list", wish_list_routes_1.default);
app.use("/api/cart", cart_routes_1.default);
app.use("/api/order", order_routes_1.default);
app.all("/{*all}", (req, res, next) => {
    const message = `Can not ${req.method} on ${req.originalUrl}`;
    const err = new error_handler_middleware_1.default(message, 404);
    next(err);
});
app.listen(PORT, () => {
    console.log(`Server is Running at http://localhost:${PORT}`);
});
// Using Error Handler
app.use(error_handler_middleware_1.errorHandler);
