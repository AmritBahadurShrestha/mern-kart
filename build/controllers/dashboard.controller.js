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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const brand_model_1 = __importDefault(require("../models/brand.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const async_handler_utils_1 = require("../utils/async-handler.utils");
exports.getDashboard = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_model_1.default.countDocuments();
    const products = yield product_model_1.default.countDocuments();
    const users = yield user_model_1.default.countDocuments();
    const brands = yield brand_model_1.default.countDocuments();
    const orders = yield order_model_1.default.countDocuments();
    res.status(200).json({
        message: "Dashboard data retrieved successfully",
        status: "success",
        success: true,
        data: { categories, products, users, brands, orders }
    });
}));
