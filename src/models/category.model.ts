import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category Name is Required"],
      unique: [true, "Category Name is Already Exists"],
      trim: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Category = model("category", categorySchema);

export default Category;
