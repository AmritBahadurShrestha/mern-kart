import { Request, Response } from "express";
import Category from "../models/category.model";
import CustomError from "../middlewares/error-handler.middleware";
import { asyncHandler } from "../utils/async-handler.utils";

// Create
export const create = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;

  const category = await Category.create({ name, description });

  res.status(201).json({
    message: "Category Created Successfully",
    status: "success",
    success: true,
    data: category,
  });
});

// Get All
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Category.find({});

  res.status(201).json({
    message: "All Categories Fetched Successfully",
    status: "success",
    success: true,
    data: categories,
  });
});

// Get By ID
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  const category = await Category.findById(id);

  if (!category) {
    throw new CustomError("Category Not Found", 404);
  }

  res.status(201).json({
    message: `Category ${id} Fetched Successfully`,
    status: "success",
    success: true,
    data: category,
  });
});

// Update Category
export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  const { name, description } = req.body;

  const category = await Category.findByIdAndUpdate(
    id,
    { name, description },
    { new: true, reValidate: true }
  );

  if (!category) {
    throw new CustomError("Category Not Found", 404);
  }

  res.status(200).json({
    message: `Category ${id} Updated Successfully`,
    status: "success",
    success: true,
    data: category,
  });
});

// Delete Category
export const deleteById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new CustomError("Category Not Found", 404);
  }

  res.status(200).json({
    message: `Category ${id} Deleted Successfully`,
    status: "success",
    success: true,
    data: category,
  });
});
