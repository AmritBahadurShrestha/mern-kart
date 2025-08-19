import mongoose from "mongoose";
import { Role } from "../types/enum.types";

const userSchema = new mongoose.Schema(
  {
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
        type: mongoose.Schema.Types.ObjectId,
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
      enum: Object.values(Role),
      default: Role.USER,
    },
    phone_number: {
      type: String,
      max: 15,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);

export default User;
