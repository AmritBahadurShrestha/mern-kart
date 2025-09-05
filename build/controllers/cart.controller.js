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
exports.removeCartItem = exports.updateCartItem = exports.clearCart = exports.getCart = exports.create = void 0;
const async_handler_utils_1 = require("../utils/async-handler.utils");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
//* Create
exports.create = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, quantity } = req.body;
    const { _id: userId } = req.user;
    let cart;
    if (!productId) {
        throw new error_handler_middleware_1.default("ProductId is Required", 400);
    }
    cart = yield cart_model_1.default.findOne({ user: userId });
    if (!cart) {
        cart = yield cart_model_1.default.create({ user: userId, total_amount: 0 });
    }
    const product = yield product_model_1.default.findById(productId);
    if (!product) {
        throw new error_handler_middleware_1.default("Product Not Found", 400);
    }
    const isAlreadyExists = cart.items.find((item) => item.product.toString() === productId.toString());
    if (isAlreadyExists) {
        isAlreadyExists.quantity += Number(quantity);
        cart.total_amount =
            cart.total_amount -
                isAlreadyExists.total_price +
                isAlreadyExists.quantity * product.price;
        isAlreadyExists.total_price = isAlreadyExists.quantity * product.price;
    }
    else {
        const total_price = Number(quantity) * product.price;
        const total_amount = cart.total_amount + total_price;
        cart.total_amount = total_amount;
        cart.items.push({ total_price, product: product._id, quantity });
    }
    yield cart.save();
    res.status(201).json({
        message: "Product Successfully Added To Cart",
        status: "success",
        success: true,
        data: cart,
    });
}));
//* Get By User
exports.getCart = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user._id;
    const cart = yield cart_model_1.default.findOne({ user }).populate('items.product');
    if (!cart) {
        throw new error_handler_middleware_1.default("Cart Not Created Yet", 400);
    }
    res.status(200).json({
        message: "Cart Successfully Retrieved",
        status: "success",
        success: true,
        data: cart
    });
}));
//* Clear Cart
exports.clearCart = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const cart = yield cart_model_1.default.findOne({ user: userId });
    if (!cart) {
        throw new error_handler_middleware_1.default("Cart Not Found", 404);
    }
    cart.items.splice(0, cart.items.length);
    cart.total_amount = 0;
    yield cart.save();
    res.status(200).json({
        message: "Cart successfully cleared",
        status: "success",
        success: true,
        data: cart,
    });
}));
//* Update Cart
exports.updateCartItem = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    if (!productId || quantity == null) {
        throw new error_handler_middleware_1.default("ProductId and quantity are required", 400);
    }
    const cart = yield cart_model_1.default.findOne({ user: userId });
    if (!cart) {
        throw new error_handler_middleware_1.default("Cart Not Found", 404);
    }
    const item = cart.items.find((item) => item.product.toString() === productId.toString());
    if (!item) {
        throw new error_handler_middleware_1.default("Product Not Found in Cart", 404);
    }
    const product = yield product_model_1.default.findById(productId);
    if (!product) {
        throw new error_handler_middleware_1.default("Product Not Found", 404);
    }
    cart.total_amount = cart.total_amount - item.total_price;
    item.quantity = quantity;
    item.total_price = quantity * product.price;
    cart.total_amount += item.total_price;
    yield cart.save();
    res.status(200).json({
        message: "Cart Item Updated Successfully",
        status: "success",
        success: true,
        data: cart,
    });
}));
//* Remove Item From Cart
exports.removeCartItem = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { productId } = req.params;
    if (!productId) {
        throw new error_handler_middleware_1.default("ProductId is required", 400);
    }
    const cart = yield cart_model_1.default.findOne({ user: userId });
    if (!cart) {
        throw new error_handler_middleware_1.default("Cart not found", 404);
    }
    // Find the item to remove
    const itemToRemove = cart.items.find((item) => item.product.toString() === productId.toString());
    if (!itemToRemove) {
        throw new error_handler_middleware_1.default("Product not found in cart", 404);
    }
    // Subtract the item's total price from total_amount
    cart.total_amount -= itemToRemove.total_price;
    // Filter out the item
    let items = cart.items.filter((item) => item.product.toString() !== productId.toString());
    cart.set("items", items);
    yield cart.save();
    res.status(200).json({
        message: "Product removed from cart",
        status: "success",
        success: true,
        data: cart,
    });
}));
