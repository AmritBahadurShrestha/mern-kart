import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import CustomError from "../middlewares/error-handler.middleware";
import { asyncHandler } from "../utils/async-handler.utils";

// Get All Users
export const getAll = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find({});

    res.status(200).json({
      message: "All Users Fetched Successfully",
      status: "success",
      success: true,
      data: users,
    });
  }
);

// Get By ID
export const getById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await User.findOne({ _id: id });

    if (!user) {
      throw new CustomError("User Not Found", 404);
    }

    res.status(200).json({
      message: `User ${id} Fetched Successfully`,
      status: "success",
      success: true,
      data: user,
    });
  }
);

// Delete User
export const deleteById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw new CustomError("User Not Found", 404);
    }

    res.status(200).json({
      message: `User ${id} Deleted Successfully`,
      status: "success",
      success: true,
      data: user,
    });
  }
);
