"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_types_1 = require("../types/enum.types");
const userSchema = new mongoose_1.default.Schema({
    first_name: {
        type: String,
        required: [true, "First_Name is Required"],
        trim: true,
    },
    last_name: {
        type: String,
        required: [true, "Last_Name is Required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: [true, "User Already Exists with Provided Email"],
        trim: true,
    },
    wish_list: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: [true, "Product is Required"],
            ref: "product",
        },
    ],
    password: {
        type: String,
        required: [true, "Password is Required"],
        min: 5,
        select: false,
    },
    role: {
        type: String,
        enum: Object.values(enum_types_1.Role),
        default: enum_types_1.Role.USER,
    },
    phone_number: {
        type: String,
        max: 15,
    },
}, {
    timestamps: true,
});
const User = mongoose_1.default.model("user", userSchema);
exports.default = User;
