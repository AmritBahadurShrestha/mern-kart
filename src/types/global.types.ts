import mongoose from "mongoose";
import { Role } from "./enum.types";

export interface IJWTPayload {
  _id: mongoose.Schema.Types.ObjectId;
  email: string;
  role: Role;
  first_name: string;
  last_name: string;
}

export interface IJWTDecoderPayload extends IJWTPayload {
  exp: number;
  iat: number;
}

export const allAdmins = [Role.ADMIN, Role.SUPER_ADMIN];
export const onlyUser = [Role.USER];
export const AllUsersAdmins = [...allAdmins, ...onlyUser]
