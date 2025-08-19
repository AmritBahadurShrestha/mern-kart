import express from "express";
import {
  clearCart,
  create,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../controllers/cart.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { onlyUser } from "../types/global.types";

const router = express.Router();

router.post("/", authenticate(onlyUser), create);
router.get("/", authenticate(onlyUser), getCart);
router.delete("/", authenticate(onlyUser), clearCart);
router.put("/", authenticate(onlyUser), updateCartItem);
router.delete("/item/:productId", authenticate(onlyUser), removeCartItem);

export default router;
