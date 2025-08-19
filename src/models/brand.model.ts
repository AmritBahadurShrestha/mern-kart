import { Schema, model } from "mongoose";

const brandSchema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

const Brand = model("brand", brandSchema);

export default Brand;
