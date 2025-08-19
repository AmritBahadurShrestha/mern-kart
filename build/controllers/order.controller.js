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
exports.cancel = exports.update = exports.getAllByUser = exports.getAllByAdmin = exports.create = void 0;
const async_handler_utils_1 = require("../utils/async-handler.utils");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const product_model_1 = __importDefault(require("../models/product.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const enum_types_1 = require("../types/enum.types");
const cart_model_1 = __importDefault(require("../models/cart.model"));
const nodemailer_utils_1 = require("../utils/nodemailer.utils");
const email_utils_1 = require("../utils/email.utils");
// Create
exports.create = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { items, shipping_address } = req.body;
    const user = req.user._id;
    if (!items) {
        throw new error_handler_middleware_1.default("Items is Required", 400);
    }
    if (!shipping_address) {
        throw new error_handler_middleware_1.default("Shipping Address is Required", 400);
    }
    const address = JSON.parse(shipping_address);
    const orderItems = JSON.parse(items);
    // Preparing order items with price
    const order = yield Promise.all(orderItems.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield product_model_1.default.findById(item.product);
        if (!product) {
            return null;
        }
        // reducing products stock
        product.stock = Number(item.quantity);
        yield product.save();
        return {
            product: product._id,
            quantity: Number(item.quantity),
            total_price: Number(item.quantity) * product.price,
        };
    })));
    // filter null emements
    const filteredOrderItems = order.filter((order) => order !== null);
    // calculating total amount
    const total_amount = filteredOrderItems.reduce((acc, val) => {
        return (acc += Number(val.total_price));
    }, 0);
    // Placing Order
    const newOrder = yield order_model_1.default.create({
        user,
        items: filteredOrderItems,
        total_amount,
        shipping_address: address,
    });
    const orderPlaced = yield order_model_1.default.findById(newOrder._id)
        .populate("items.product")
        .populate("user");
    // Deleting Cart After Order is Placed
    yield cart_model_1.default.findOneAndDelete({ user });
    yield (0, nodemailer_utils_1.sendEmail)({
        html: (0, email_utils_1.generate_order_confirmation_email)(orderPlaced),
        subject: "Order Status",
        to: "amritshrestha0022@gmail.com",
    });
    res.status(201).json({
        message: "Order Placed Successfully",
        status: "success",
        success: true,
        data: newOrder,
    });
}));
// Get All Orders (Only Admin)
exports.getAllByAdmin = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.default.find({}).sort({ createdAt: -1 });
    res.status(200).json({
        message: "All orders fetched successfully",
        status: "success",
        success: true,
        data: orders,
    });
}));
// Get User Order (Only User)
exports.getAllByUser = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user._id;
    const orders = yield order_model_1.default.find({ user }).sort({ createdAt: -1 });
    res.status(200).json({
        message: "All orders fetched successfully",
        status: "success",
        success: true,
        data: orders,
    });
}));
// Update Order Status (Admin)
exports.update = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.body;
    const { id } = req.params;
    const order = yield order_model_1.default.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json({
        message: "All orders fetched successfully",
        status: "success",
        success: true,
        data: order,
    });
}));
// Cancel Order (Only User)
exports.cancel = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield order_model_1.default.findByIdAndUpdate(id, { status: enum_types_1.Order_Status.CANCELLED }, { new: true });
    res.status(200).json({
        message: "All orders Cancelled",
        status: "success",
        success: true,
        data: order,
    });
}));
