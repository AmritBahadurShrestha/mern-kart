import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import CustomError from "../middlewares/error-handler.middleware";
import User from "../models/user.model";
import Product from "../models/product.model";

// Get WishList
export const getWishList = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate("wish_list.product");

  if (!user) {
    throw new CustomError("User Not Found", 404);
  }

  res.status(200).json({
    message: "Wish List Fetched Successfully",
    status: "success",
    success: true,
    data: user.wish_list ?? [],
  });
});

// Add To WishList
export const addToWishList = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;

    const productId = req.body.id;

    if (!productId) {
      throw new CustomError("Product ID is Required", 400);
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new CustomError("Product Not Found", 404);
    }

    const user = await User.findById(userId);

    // Check if Product Already Exists
    const isProductAlreadyExists = user?.wish_list.find(
      (id) => product._id.toString() === id.toString()
    );

    // if Already Exists -> Remove it From List
    if (isProductAlreadyExists) {
      const list = user?.wish_list.filter(
        (id) => id.toString() !== product._id.toString()
      );
      user?.set("wish_list", list);
      await user?.save();

      res.status(200).json({
        message: "Product Removed from WishList",
        status: "success",
        success: true,
      });
    }
    else {
      // if Not Exists -> Add it To List
    user?.wish_list.push(productId);

    await user?.save();

    res.status(200).json({
      message: "Product Added to WishList",
      status: "success",
      success: true,
    });
    }
  }
);

// Clear WishList
export const clearWishList = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    user.set("wish_list", []);

    await user.save();

    res.status(200).json({
      message: "Wishlist Deleted Successfully",
      success: true,
      status: "success",
      data: user.wish_list,
    });
  }
);
