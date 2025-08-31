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
exports.clearWishList = exports.addToWishList = exports.getWishList = void 0;
const async_handler_utils_1 = require("../utils/async-handler.utils");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const user_model_1 = __importDefault(require("../models/user.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
// Get WishList
exports.getWishList = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user._id;
    const user = yield user_model_1.default.findById(userId).populate("wish_list");
    if (!user) {
        throw new error_handler_middleware_1.default("User Not Found", 404);
    }
    res.status(200).json({
        message: "Wish List Fetched Successfully",
        status: "success",
        success: true,
        data: (_a = user.wish_list) !== null && _a !== void 0 ? _a : [],
    });
}));
// Add To WishList
exports.addToWishList = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const productId = req.body.id;
    if (!productId) {
        throw new error_handler_middleware_1.default("Product ID is Required", 400);
    }
    const product = yield product_model_1.default.findById(productId);
    if (!product) {
        throw new error_handler_middleware_1.default("Product Not Found", 404);
    }
    const user = yield user_model_1.default.findById(userId);
    // Check if Product Already Exists
    const isProductAlreadyExists = user === null || user === void 0 ? void 0 : user.wish_list.find((id) => product._id.toString() === id.toString());
    // if Already Exists -> Remove it From List
    if (isProductAlreadyExists) {
        const list = user === null || user === void 0 ? void 0 : user.wish_list.filter((id) => id.toString() !== product._id.toString());
        user === null || user === void 0 ? void 0 : user.set("wish_list", list);
        yield (user === null || user === void 0 ? void 0 : user.save());
        res.status(200).json({
            message: "Product Removed from WishList",
            status: "success",
            success: true,
        });
    }
    else {
        // if Not Exists -> Add it To List
        user === null || user === void 0 ? void 0 : user.wish_list.push(productId);
        yield (user === null || user === void 0 ? void 0 : user.save());
        res.status(200).json({
            message: "Product Added to WishList",
            status: "success",
            success: true,
        });
    }
}));
// Clear WishList
exports.clearWishList = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        throw new error_handler_middleware_1.default("User not found", 404);
    }
    user.set("wish_list", []);
    yield user.save();
    res.status(200).json({
        message: "Wishlist Deleted Successfully",
        success: true,
        status: "success",
        data: user.wish_list,
    });
}));
