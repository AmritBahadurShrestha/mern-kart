import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { onlyUser } from "../types/global.types";
import {
  addToWishList,
  clearWishList,
  getWishList,
} from "../controllers/wishlist.controller";

const router = express.Router();

router.get("/", authenticate(onlyUser), getWishList);
router.post("/", authenticate(onlyUser), addToWishList);
router.delete("/", authenticate(onlyUser), clearWishList);

export default router;
