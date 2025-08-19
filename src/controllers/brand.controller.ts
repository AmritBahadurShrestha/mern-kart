import { Request, Response } from "express";
import Brand from "../models/brand.model";
import CustomError from "../middlewares/error-handler.middleware";
import { asyncHandler } from "../utils/async-handler.utils";
import { deleteFiles, uploadFile } from "../utils/cloudinary-service.utils";

// Register Brands
const folder_name = "/brands";

// Create
export const create = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;

  console.log(req.file);

  const logo = req.file as Express.Multer.File;

  // Creating Brand Instance
  const brand = new Brand({ name, description });

  const { path, public_id } = await uploadFile(logo.path, folder_name);

  brand.logo = {
    path,
    public_id,
  };

  // Saving Brand On Database
  await brand.save();

  res.status(201).json({
    message: "Brand Created Successfully",
    status: "success",
    success: true,
    data: brand,
  });
});

// Get All
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const brands = await Brand.find({});

  res.status(201).json({
    message: "All Brands Fetched Successfully",
    status: "success",
    success: true,
    data: brands,
  });
});

// Get By ID
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  const brand = await Brand.findById(id);

  if (!brand) {
    throw new CustomError("Brand Not Found", 404);
  }

  res.status(201).json({
    message: `Brand ${id} Fetched Successfully`,
    status: "success",
    success: true,
    data: brand,
  });
});

// Update Brand
export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  const { name, description } = req.body;

  const logo = req.file as Express.Multer.File;

  const brand = await Brand.findById(id);

  if (!brand) {
    throw new CustomError("Brand Not Found", 404);
  }

  if (name) brand.name = name;
  if (description) brand.description = description;
  if (logo) {
    const { path, public_id } = await uploadFile(logo.path, folder_name);

    // Delete Old Image
    if (brand.logo) {
      await deleteFiles([brand.logo?.public_id]);
    }
    // Update New Image
    brand.logo = {
      path,
      public_id,
    };
  }

  await brand.save();

  res.status(200).json({
    message: `Brand ${id} Updated Successfully`,
    status: "success",
    success: true,
    data: brand,
  });
});

// Delete Brand
export const deleteById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  const brand = await Brand.findById(id);

  if (!brand) {
    throw new CustomError("Brand Not Found", 404);
  }

  if (brand.logo) {
    await deleteFiles([brand.logo.public_id]);
  }

  await brand.deleteOne();

  res.status(200).json({
    message: `Brand ${id} Deleted Successfully`,
    status: "success",
    success: true,
    data: brand,
  });
});
