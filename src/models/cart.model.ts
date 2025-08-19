import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
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
        required: [true],
        default: 0,
      },
    },
  ],
  total_amount: {
    type: Number,
    required: [true, "Total Amount is Required"],
    default: 0,
  },
});

const Cart = mongoose.model("cart", cartSchema);

export default Cart;
