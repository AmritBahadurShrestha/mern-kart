import mongoose, { Schema } from "mongoose";
import { Order_Status, Payment_Method } from "../types/enum.types";

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User is Required"],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
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
      enum: Object.values(Order_Status),
      default: Order_Status.PENDING,
    },
    payment_method: {
      type: String,
      enum: Object.values(Payment_Method),
      default: Payment_Method.COD,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);

export default Order;
