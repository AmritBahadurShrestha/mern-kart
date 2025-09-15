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
exports.getFeaturedProducts = exports.getByCategory = exports.getByBrand = exports.deleteById = exports.update = exports.getById = exports.getAll = exports.create = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const async_handler_utils_1 = require("../utils/async-handler.utils");
const brand_model_1 = __importDefault(require("../models/brand.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_service_utils_1 = require("../utils/cloudinary-service.utils");
const pagination_utils_1 = require("../utils/pagination.utils");
// Register Brands
const folder_name = "/products";
// Create
exports.create = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, brand, category, isFeatured, stock, price, description, size } = req.body;
    const { cover_image, images } = req.files;
    console.log(cover_image, images);
    if (!cover_image) {
        throw new error_handler_middleware_1.default("Cover Image is Required", 400);
    }
    const createdBy = req.user._id;
    if (!brand) {
        throw new error_handler_middleware_1.default("Brand is Required", 400);
    }
    if (!category) {
        throw new error_handler_middleware_1.default("Category is Required", 400);
    }
    const product = new product_model_1.default({
        name,
        isFeatured,
        stock,
        price,
        description,
        size,
    });
    const productBrand = yield brand_model_1.default.findById(brand);
    if (!productBrand) {
        throw new error_handler_middleware_1.default("Brand Not Found", 404);
    }
    const productCategory = yield category_model_1.default.findById(category);
    if (!productCategory) {
        throw new error_handler_middleware_1.default("Category Not Found", 404);
    }
    product.brand = productBrand._id;
    product.category = productCategory._id;
    product.createdBy = new mongoose_1.default.Types.ObjectId(createdBy.toString());
    // Uploading Cover Image
    if (cover_image) {
        const { path, public_id } = yield (0, cloudinary_service_utils_1.uploadFile)(cover_image[0].path, folder_name);
        product.cover_image = {
            path,
            public_id,
        };
    }
    // Uploading Images
    if (Array.isArray(images) && images.length > 0) {
        const imagePaths = yield Promise.all(images.map((image) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, cloudinary_service_utils_1.uploadFile)(image.path, folder_name); })));
        product.set("images", imagePaths);
    }
    yield product.save();
    res.status(201).json({
        message: "Product Created Successfully",
        status: "success",
        success: true,
        data: product,
    });
}));
// Get All
exports.getAll = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { current_page, per_page, query, category, brand, min_price, max_price, } = req.query;
    let filter = {};
    const page = Number(current_page) || 1;
    const limit = Number(per_page) || 50;
    const skip = (page - 1) * limit;
    if (query) {
        filter.$or = [
            {
                name: {
                    $regex: query,
                    $options: "i",
                },
            },
            {
                description: {
                    $regex: query,
                    $options: "i",
                },
            },
        ];
    }
    // Category Filter
    if (category) {
        filter.category = category;
    }
    // Brand Filter
    if (brand) {
        filter.brand = brand;
    }
    // Price Range Filter
    if (min_price || max_price) {
        if (min_price) {
            filter.price = {
                $gte: min_price,
            };
        }
        if (max_price) {
            filter.price = {
                $lte: max_price,
            };
        }
    }
    const products = yield product_model_1.default.find(filter)
        .populate("brand")
        .populate("category")
        .populate("createdBy")
        .limit(limit)
        .skip(skip);
    const total = yield product_model_1.default.countDocuments(filter);
    res.status(201).json({
        message: "All Products Fetched Successfully",
        status: "success",
        success: true,
        data: products,
        pagination: (0, pagination_utils_1.getPagination)(total, page, limit),
    });
}));
// Get By ID
exports.getById = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const product = yield product_model_1.default.findById(id)
        .populate("brand")
        .populate("category")
        .populate("createdBy");
    if (!product) {
        throw new error_handler_middleware_1.default("Product Not Found", 404);
    }
    res.status(201).json({
        message: `Product ${id} Fetched Successfully`,
        status: "success",
        success: true,
        data: product,
    });
}));
// Update Product
exports.update = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { name, brand, category, isFeatured, stock, price, description, size, deletedImage, } = req.body;
    const { cover_image, images } = req.files;
    let deletedImages = [];
    if (deletedImage) {
        deletedImages = JSON.parse(deletedImage);
    }
    const product = yield product_model_1.default.findById(id);
    if (!product) {
        throw new error_handler_middleware_1.default("Product Not Found", 400);
    }
    if (name)
        product.name = name;
    if (isFeatured)
        product.isFeatured = isFeatured;
    if (price)
        product.price = price;
    if (description)
        product.description = description;
    if (size)
        product.size = size;
    if (stock)
        product.stock = stock;
    if (brand) {
        const brandToUpdate = yield brand_model_1.default.findById(brand);
        if (!brandToUpdate) {
            throw new error_handler_middleware_1.default("Brand Not Found", 400);
        }
        product.brand = brandToUpdate._id;
    }
    if (category) {
        const categoryToUpdate = yield category_model_1.default.findById(category);
        if (!categoryToUpdate) {
            throw new error_handler_middleware_1.default("Category Not Found", 400);
        }
        product.category = categoryToUpdate._id;
    }
    if (cover_image) {
        const { path, public_id } = yield (0, cloudinary_service_utils_1.uploadFile)(cover_image[0].path, folder_name);
        if (product.cover_image && product.cover_image.public_id) {
            yield (0, cloudinary_service_utils_1.deleteFiles)([product.cover_image.public_id]);
        }
        product.cover_image = {
            path,
            public_id,
        };
    }
    // ID Old Images are Deleted
    if (Array.isArray(deletedImages) && deletedImages.length > 0) {
        yield (0, cloudinary_service_utils_1.deleteFiles)(deletedImages);
        const filteredImages = product.images.length > 0
            ? product.images.filter((image) => !deletedImages.includes(image.public_id))
            : [];
        product.set("images", filteredImages);
    }
    // If New Images Uploaded
    if (images && images.length > 0) {
        const newImages = yield Promise.all(images.map((image) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, cloudinary_service_utils_1.uploadFile)(image.path, folder_name); })));
        product.set("images", [...product.images, ...newImages]);
    }
    yield product.save();
    res.status(201).json({
        message: `Product ${id} Updated Successfully`,
        status: "success",
        success: true,
        data: product,
    });
}));
// Delete Product
exports.deleteById = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = req.params.id;
    const product = yield product_model_1.default.findById(id);
    if (!product) {
        throw new error_handler_middleware_1.default("Product Not Found", 404);
    }
    if (product.images && product.images.length > 0) {
        yield (0, cloudinary_service_utils_1.deleteFiles)((_a = product.images) === null || _a === void 0 ? void 0 : _a.map((img) => img.public_id));
    }
    if (product.cover_image) {
        yield (0, cloudinary_service_utils_1.deleteFiles)([(_b = product.cover_image) === null || _b === void 0 ? void 0 : _b.public_id]);
    }
    yield product.deleteOne();
    res.status(201).json({
        message: `Product ${id} Deleted Successfully`,
        status: "success",
        success: true,
        data: product,
    });
}));
// Get By Brand
exports.getByBrand = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const brandId = req.params.brandId;
    const products = yield product_model_1.default.find({ brand: brandId })
        .populate("brand")
        .populate("category")
        .populate("createdBy");
    res.status(200).json({
        message: `Products for brand ${brandId}`,
        status: "success",
        success: true,
        data: products,
    });
}));
// Get By Category
exports.getByCategory = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.categoryId;
    const products = yield product_model_1.default.find({ category: categoryId })
        .populate("brand")
        .populate("category")
        .populate("createdBy");
    res.status(200).json({
        message: `Products for category ${categoryId}`,
        status: "success",
        success: true,
        data: products,
    });
}));
// Get Featured Product
exports.getFeaturedProducts = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_model_1.default.find({ isFeatured: true })
        .populate("brand")
        .populate("category")
        .populate("createdBy");
    res.status(200).json({
        message: "Products Fetched Successfully",
        status: "success",
        success: true,
        data: products,
    });
}));
