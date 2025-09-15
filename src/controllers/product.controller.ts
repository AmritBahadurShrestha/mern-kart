import { Request, Response } from "express";
import Product from "../models/product.model";
import CustomError from "../middlewares/error-handler.middleware";
import { asyncHandler } from "../utils/async-handler.utils";
import Brand from "../models/brand.model";
import Category from "../models/category.model";
import mongoose from "mongoose";
import { deleteFiles, uploadFile } from "../utils/cloudinary-service.utils";
import { getPagination } from "../utils/pagination.utils";

// Register Brands
const folder_name = "/products";

// Create
export const create = asyncHandler(async (req: Request, res: Response) => {
  const { name, brand, category, isFeatured, stock, price, description, size } =
    req.body;

  const { cover_image, images } = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  console.log(cover_image, images);

  if (!cover_image) {
    throw new CustomError("Cover Image is Required", 400);
  }

  const createdBy = req.user._id;

  if (!brand) {
    throw new CustomError("Brand is Required", 400);
  }

  if (!category) {
    throw new CustomError("Category is Required", 400);
  }

  const product = new Product({
    name,
    isFeatured,
    stock,
    price,
    description,
    size,
  });

  const productBrand = await Brand.findById(brand);

  if (!productBrand) {
    throw new CustomError("Brand Not Found", 404);
  }

  const productCategory = await Category.findById(category);

  if (!productCategory) {
    throw new CustomError("Category Not Found", 404);
  }

  product.brand = productBrand._id;
  product.category = productCategory._id;
  product.createdBy = new mongoose.Types.ObjectId(createdBy.toString());

  // Uploading Cover Image
  if (cover_image) {
    const { path, public_id } = await uploadFile(
      cover_image[0].path,
      folder_name
    );

    product.cover_image = {
      path,
      public_id,
    };
  }

  // Uploading Images
  if (Array.isArray(images) && images.length > 0) {
    const imagePaths = await Promise.all(
      images.map(async (image) => await uploadFile(image.path, folder_name))
    );

    product.set("images", imagePaths);
  }

  await product.save();

  res.status(201).json({
    message: "Product Created Successfully",
    status: "success",
    success: true,
    data: product,
  });
});

// Get All
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const {
    current_page,
    per_page,
    query,
    category,
    brand,
    min_price,
    max_price,
  } = req.query;

  let filter: Record<string, any> = {};

  const page = Number(current_page) || 1;
  const limit = Number(per_page) || 50;
  const skip = (page - 1) * limit;

  if (query) {
    filter.$or = [
      {
        name: {
          $regex: query,
          $options: "i",
        },
      },
      {
        description: {
          $regex: query,
          $options: "i",
        },
      },
    ];
  }

  // Category Filter
  if (category) {
    filter.category = category;
  }

  // Brand Filter
  if (brand) {
    filter.brand = brand;
  }

  // Price Range Filter
  if (min_price || max_price) {
    if (min_price) {
      filter.price = {
        $gte: min_price,
      };
    }

    if (max_price) {
      filter.price = {
        $lte: max_price,
      };
    }
  }

  const products = await Product.find(filter)
    .populate("brand")
    .populate("category")
    .populate("createdBy")
    .limit(limit)
    .skip(skip);

  const total = await Product.countDocuments(filter);

  res.status(201).json({
    message: "All Products Fetched Successfully",
    status: "success",
    success: true,
    data: products,
    pagination: getPagination(total, page, limit),
  });
});

// Get By ID
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  const product = await Product.findById(id)
    .populate("brand")
    .populate("category")
    .populate("createdBy");

  if (!product) {
    throw new CustomError("Product Not Found", 404);
  }

  res.status(201).json({
    message: `Product ${id} Fetched Successfully`,
    status: "success",
    success: true,
    data: product,
  });
});

// Update Product
export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  const {
    name,
    brand,
    category,
    isFeatured,
    stock,
    price,
    description,
    size,
    deletedImage,
  } = req.body;

  const { cover_image, images } = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  let deletedImages: string[] = [];
  if (deletedImage) {
    deletedImages = JSON.parse(deletedImage);
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new CustomError("Product Not Found", 400);
  }

  if (name) product.name = name;
  if (isFeatured) product.isFeatured = isFeatured;
  if (price) product.price = price;
  if (description) product.description = description;
  if (size) product.size = size;
  if (stock) product.stock = stock;

  if (brand) {
    const brandToUpdate = await Brand.findById(brand);
    if (!brandToUpdate) {
      throw new CustomError("Brand Not Found", 400);
    }
    product.brand = brandToUpdate._id;
  }

  if (category) {
    const categoryToUpdate = await Category.findById(category);
    if (!categoryToUpdate) {
      throw new CustomError("Category Not Found", 400);
    }
    product.category = categoryToUpdate._id;
  }

  if (cover_image) {
    const { path, public_id } = await uploadFile(
      cover_image[0].path,
      folder_name
    );

    if (product.cover_image && product.cover_image.public_id) {
      await deleteFiles([product.cover_image.public_id]);
    }
    product.cover_image = {
      path,
      public_id,
    };
  }

  // ID Old Images are Deleted
  if (Array.isArray(deletedImages) && deletedImages.length > 0) {
    await deleteFiles(deletedImages);
    const filteredImages =
      product.images.length > 0
        ? product.images.filter(
            (image) => !deletedImages.includes(image.public_id as string)
          )
        : [];

    product.set("images", filteredImages);
  }

  // If New Images Uploaded
  if (images && images.length > 0) {
    const newImages = await Promise.all(
      images.map(async (image) => await uploadFile(image.path, folder_name))
    );
    product.set("images", [...product.images, ...newImages]);
  }

  await product.save();

  res.status(201).json({
    message: `Product ${id} Updated Successfully`,
    status: "success",
    success: true,
    data: product,
  });
});

// Delete Product
export const deleteById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  const product = await Product.findById(id);

  if (!product) {
    throw new CustomError("Product Not Found", 404);
  }

  if (product.images && product.images.length > 0) {
    await deleteFiles(product.images?.map((img: any) => img.public_id));
  }

  if (product.cover_image) {
    await deleteFiles([product.cover_image?.public_id]);
  }

  await product.deleteOne();

  res.status(201).json({
    message: `Product ${id} Deleted Successfully`,
    status: "success",
    success: true,
    data: product,
  });
});

// Get By Brand
export const getByBrand = asyncHandler(async (req: Request, res: Response) => {
  const brandId = req.params.brandId;

  const products = await Product.find({ brand: brandId })
    .populate("brand")
    .populate("category")
    .populate("createdBy");

  res.status(200).json({
    message: `Products for brand ${brandId}`,
    status: "success",
    success: true,
    data: products,
  });
});

// Get By Category
export const getByCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const categoryId = req.params.categoryId;

    const products = await Product.find({ category: categoryId })
      .populate("brand")
      .populate("category")
      .populate("createdBy");

    res.status(200).json({
      message: `Products for category ${categoryId}`,
      status: "success",
      success: true,
      data: products,
    });
  }
);

// Get Featured Product
export const getFeaturedProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await Product.find({ isFeatured: true })
      .populate("brand")
      .populate("category")
      .populate("createdBy");

    res.status(200).json({
      message: "Products Fetched Successfully",
      status: "success",
      success: true,
      data: products,
    });
  }
);
