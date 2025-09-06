import Category from "../models/category.model";
import Product from "../models/product.model";
import User from "../models/user.model";
import Brand from "../models/brand.model";
import Order from "../models/order.model";
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/async-handler.utils";

export const getDashboard = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const categories = await Category.countDocuments();
        const products = await Product.countDocuments();
        const users = await User.countDocuments();
        const brands = await Brand.countDocuments();
        const orders = await Order.countDocuments();

        res.status(200).json({
          message: "Dashboard data retrieved successfully",
          status: "success",
          success: true,
          data: { categories, products, users, brands, orders }
        });
    }
)
