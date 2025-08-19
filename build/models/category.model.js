"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Category Name is Required"],
        unique: [true, "Category Name is Already Exists"],
        trim: true,
    },
    description: {
        type: String,
    },
}, {
    timestamps: true,
});
const Category = (0, mongoose_1.model)("category", categorySchema);
exports.default = Category;
