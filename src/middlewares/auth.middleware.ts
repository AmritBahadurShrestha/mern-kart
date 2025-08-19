import { Request, Response, NextFunction } from "express";
import { Role } from "../types/enum.types";
import CustomError from "./error-handler.middleware";
import { verifyToken } from "../utils/jwt.utils";
import User from "../models/user.model";

export const authenticate = (roles?: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get Token From Cookies
      const access_token = req.cookies.access_token;

      if (!access_token) {
        throw new CustomError("Unauthorized. Access Denied.", 401);
      }

      // Verify Token
      const decodedData = verifyToken(access_token);

      console.log(decodedData);

      if (Date.now() > decodedData.exp * 1000) {

        // Clear Cookies
        res.clearCookie("access_token", {
          secure:process.env.NODE_ENV === 'development' ? false : true,
          httpOnly: true,
          sameSite: 'none'
        })
        throw new CustomError("Session Expired. Access Denied", 401);
      }

      const user = await User.findById(decodedData._id);

      if (!user) {
        throw new CustomError("Unauthorized. Access Denied", 401);
      }

      if (roles && !roles.includes(decodedData.role)) {
        throw new CustomError("Unauthorized. Access Denied", 403);
      }

      req.user = {
        _id: decodedData._id,
        email: decodedData.email,
        role: decodedData.role,
        first_name: decodedData.first_name,
        last_name: decodedData.last_name,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};
