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
exports.deleteById = exports.getById = exports.getAll = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const async_handler_utils_1 = require("../utils/async-handler.utils");
// Get All Users
exports.getAll = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find({});
    res.status(200).json({
        message: "All Users Fetched Successfully",
        status: "success",
        success: true,
        data: users,
    });
}));
// Get By ID
exports.getById = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_model_1.default.findOne({ _id: id });
    if (!user) {
        throw new error_handler_middleware_1.default("User Not Found", 404);
    }
    res.status(200).json({
        message: `User ${id} Fetched Successfully`,
        status: "success",
        success: true,
        data: user,
    });
}));
// Delete User
exports.deleteById = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_model_1.default.findByIdAndDelete(id);
    if (!user) {
        throw new error_handler_middleware_1.default("User Not Found", 404);
    }
    res.status(200).json({
        message: `User ${id} Deleted Successfully`,
        status: "success",
        success: true,
        data: user,
    });
}));
