"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const brandSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Brand Name is Required"],
        unique: [true, "Brand Name is Already Exists"],
        trim: true,
    },
    logo: {
        path: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    },
    description: {
        type: String,
    },
}, {
    timestamps: true,
});
const Brand = (0, mongoose_1.model)("brand", brandSchema);
exports.default = Brand;
