"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Name is Required"],
        trim: true,
    },
    cover_image: {
        path: {
            type: String,
            required: [true, "Cover Image is Required"],
        },
        public_id: {
            type: String,
            required: [true, "Cover Image is Required"],
        },
    },
    images: [
        {
            path: {
                type: String,
            },
            public_id: {
                type: String,
            },
        },
    ],
    brand: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "brand",
        required: [true, "Brand is Required"],
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "category",
        required: [true, "Category is Required"],
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User is Required"],
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    stock: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, "Price is Required"],
        min: [0, "Price Must be Positive Number"],
    },
    description: {
        type: String,
    },
    size: {
        type: String,
    },
}, {
    timestamps: true,
});
const Product = mongoose_1.default.model("product", productSchema);
exports.default = Product;
