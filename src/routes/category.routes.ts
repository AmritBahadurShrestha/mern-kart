import express from "express";
import {
  create,
  getAll,
  getById,
  update,
  deleteById,
} from "../controllers/category.controller";
import { allAdmins } from "../types/global.types";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authenticate(allAdmins), create);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", authenticate(allAdmins), update);
router.delete("/:id", authenticate(allAdmins), deleteById);

export default router;
