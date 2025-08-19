"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const enum_types_1 = require("../types/enum.types");
const orderSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User is Required"],
    },
    items: [
        {
            product: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "product",
                required: [true, "Product is Required"],
            },
            quantity: {
                type: Number,
                required: [true, "Quantity is Required"],
            },
            total_price: {
                type: Number,
                required: [true, "Total Price is Required"],
            },
        },
    ],
    total_amount: {
        type: Number,
        required: [true, "Total Amount is Required"],
    },
    shipping_address: {
        country: {
            type: String,
            trim: true,
            default: "Nepal",
        },
        state: {
            type: String,
            trim: true,
            required: [true, "Shipping Address State is Required"],
        },
        district: {
            type: String,
            trim: true,
            required: [true, "Shipping District State is Required"],
        },
        street: {
            type: String,
            trim: true,
            required: [true, "Shipping Street State is Required"],
        },
    },
    status: {
        type: String,
        enum: Object.values(enum_types_1.Order_Status),
        default: enum_types_1.Order_Status.PENDING,
    },
    payment_method: {
        type: String,
        enum: Object.values(enum_types_1.Payment_Method),
        default: enum_types_1.Payment_Method.COD,
    },
}, { timestamps: true });
const Order = mongoose_1.default.model("order", orderSchema);
exports.default = Order;
