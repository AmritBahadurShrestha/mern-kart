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
const brand_model_1 = __importDefault(require("../models/brand.model"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const async_handler_utils_1 = require("../utils/async-handler.utils");
const cloudinary_service_utils_1 = require("../utils/cloudinary-service.utils");
// Register Brands
const folder_name = "/brands";
// Create
exports.create = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    console.log(req.file);
    const logo = req.file;
    // Creating Brand Instance
    const brand = new brand_model_1.default({ name, description });
    const { path, public_id } = yield (0, cloudinary_service_utils_1.uploadFile)(logo.path, folder_name);
    brand.logo = {
        path,
        public_id,
    };
    // Saving Brand On Database
    yield brand.save();
    res.status(201).json({
        message: "Brand Created Successfully",
        status: "success",
        success: true,
        data: brand,
    });
}));
// Get All
exports.getAll = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const brands = yield brand_model_1.default.find({});
    res.status(201).json({
        message: "All Brands Fetched Successfully",
        status: "success",
        success: true,
        data: brands,
    });
}));
// Get By ID
exports.getById = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const brand = yield brand_model_1.default.findById(id);
    if (!brand) {
        throw new error_handler_middleware_1.default("Brand Not Found", 404);
    }
    res.status(201).json({
        message: `Brand ${id} Fetched Successfully`,
        status: "success",
        success: true,
        data: brand,
    });
}));
// Update Brand
exports.update = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    const { name, description } = req.body;
    const logo = req.file;
    const brand = yield brand_model_1.default.findById(id);
    if (!brand) {
        throw new error_handler_middleware_1.default("Brand Not Found", 404);
    }
    if (name)
        brand.name = name;
    if (description)
        brand.description = description;
    if (logo) {
        const { path, public_id } = yield (0, cloudinary_service_utils_1.uploadFile)(logo.path, folder_name);
        // Delete Old Image
        if (brand.logo) {
            yield (0, cloudinary_service_utils_1.deleteFiles)([(_a = brand.logo) === null || _a === void 0 ? void 0 : _a.public_id]);
        }
        // Update New Image
        brand.logo = {
            path,
            public_id,
        };
    }
    yield brand.save();
    res.status(200).json({
        message: `Brand ${id} Updated Successfully`,
        status: "success",
        success: true,
        data: brand,
    });
}));
// Delete Brand
exports.deleteById = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const brand = yield brand_model_1.default.findById(id);
    if (!brand) {
        throw new error_handler_middleware_1.default("Brand Not Found", 404);
    }
    if (brand.logo) {
        yield (0, cloudinary_service_utils_1.deleteFiles)([brand.logo.public_id]);
    }
    yield brand.deleteOne();
    res.status(200).json({
        message: `Brand ${id} Deleted Successfully`,
        status: "success",
        success: true,
        data: brand,
    });
}));
