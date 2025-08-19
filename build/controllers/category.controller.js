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
exports.deleteById = exports.update = exports.getById = exports.getAll = exports.create = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const async_handler_utils_1 = require("../utils/async-handler.utils");
// Create
exports.create = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    const category = yield category_model_1.default.create({ name, description });
    res.status(201).json({
        message: "Category Created Successfully",
        status: "success",
        success: true,
        data: category,
    });
}));
// Get All
exports.getAll = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_model_1.default.find({});
    res.status(201).json({
        message: "All Categories Fetched Successfully",
        status: "success",
        success: true,
        data: categories,
    });
}));
// Get By ID
exports.getById = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const category = yield category_model_1.default.findById(id);
    if (!category) {
        throw new error_handler_middleware_1.default("Category Not Found", 404);
    }
    res.status(201).json({
        message: `Category ${id} Fetched Successfully`,
        status: "success",
        success: true,
        data: category,
    });
}));
// Update Category
exports.update = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { name, description } = req.body;
    const category = yield category_model_1.default.findByIdAndUpdate(id, { name, description }, { new: true, reValidate: true });
    if (!category) {
        throw new error_handler_middleware_1.default("Category Not Found", 404);
    }
    res.status(200).json({
        message: `Category ${id} Updated Successfully`,
        status: "success",
        success: true,
        data: category,
    });
}));
// Delete Category
exports.deleteById = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const category = yield category_model_1.default.findByIdAndDelete(id);
    if (!category) {
        throw new error_handler_middleware_1.default("Category Not Found", 404);
    }
    res.status(200).json({
        message: `Category ${id} Deleted Successfully`,
        status: "success",
        success: true,
        data: category,
    });
}));
