import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import CustomError from "../middlewares/error-handler.middleware";
import { hashPassword, compareHash } from "../utils/bcrypt.utils";
import { asyncHandler } from "../utils/async-handler.utils";
import { generateToken } from "../utils/jwt.utils";
import { IJWTPayload } from "../types/global.types";

// Register
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { first_name, last_name, email, password, phone_number } = req.body;

    if (!password) {
      throw new CustomError("Password is Required", 400);
    }

    const user: any = await User.create({
      first_name,
      last_name,
      email,
      password,
      phone_number,
    });

    const hashedPassword = await hashPassword(password);

    user.password = hashedPassword;

    await user.save();

    const { password: pass, ...newUser } = user._doc;

    res.status(201).json({
      message: "Registration Successful",
      status: "success",
      success: true,
      data: newUser,
    });
  }
);

// Login
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email) {
      throw new CustomError("Email is Required", 400);
    }

    if (!password) {
      throw new CustomError("Password is Required", 400);
    }

    // Check if user exists
    const user: any = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new CustomError("Invalid Credentials", 400);
    }

    const isPassMatch = await compareHash(password, user.password ?? "");

    if (!isPassMatch) {
      throw new CustomError("Invalid Credentials", 400);
    }

    //! Generate Auth Token

    const payload: IJWTPayload = {
      _id: user._id,
      role: user.role,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    //! Generate JWT Token
    const access_token = generateToken(payload);

    const { password: pass, ...loggedInUser } = user._doc;

    res
      .cookie("access_token", access_token, {
        secure: process.env.NODE_ENV === "development" ? false : true,
        httpOnly: true,
        maxAge: Number(process.env.COOKIE_EXPIRY) * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Login Successful",
        status: "success",
        success: true,
        data: {
          data: loggedInUser,
          access_token,
        },
      });
  }
);

// Change Password
export const changePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { new_password, old_password, email } = req.body;

    if (!new_password) {
      throw new CustomError("New Password is Required", 400);
    }

    if (!old_password) {
      throw new CustomError("Old Password is Required", 400);
    }

    if (!email) {
      throw new CustomError("Email is Required", 400);
    }

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new CustomError("Something Went Wrong", 400);
    }

    const isPassMatched = compareHash(old_password, user.password);

    if (!isPassMatched) {
      throw new CustomError("Password Does Not Match.", 400);
    }

    user.password = await hashPassword(new_password);

    await user.save();

    res.status(200).json({
      message: "Password Updated Successfully",
      status: "success",
      success: true,
      data: user,
    });
  }
);

// LogOut
export const logout = asyncHandler(async (req: Request, res: Response) => {

  res.clearCookie("access_token", {
          secure: process.env.NODE_ENV === 'development' ? false : true,
          httpOnly: true,
          sameSite: 'none'
        })
        .status(200).json({
          message: "Logout Successfully",
          status: "success",
          success: true,
          data: null
    });
})

// Check
export const profile = asyncHandler(async(req: Request, res: Response) => {

  const userId = req.user._id

  const user = await User.findById(userId);

  if(!user) {
    throw new CustomError('Profile Found', 400)
  }

  res.status(200).json({
      message: "Profile Fetched",
      status: "success",
      success: true,
      data: user
    });
})
