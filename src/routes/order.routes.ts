import express from "express";
import {
  cancel,
  create,
  getAllByAdmin,
  getAllByUser,
  update,
} from "../controllers/order.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { allAdmins, onlyUser } from "../types/global.types";

const router = express.Router();

router.post("/", authenticate(onlyUser), create);
router.get("/all", authenticate(allAdmins), getAllByAdmin);
router.get("/", authenticate(onlyUser), getAllByUser);
router.put("/", authenticate(allAdmins), update);
router.delete("/cancel", authenticate(onlyUser), cancel);

export default router;
