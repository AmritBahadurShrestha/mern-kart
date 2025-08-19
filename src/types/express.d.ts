import { Request } from "express";
import { IJWTPayload } from "./global.types";

declare global {
  namespace Express {
    interface Request {
      user: IJWTPayload;
    }
    interface Response {
      // Extend if you need custom properties/methods later
    }
  }
}
