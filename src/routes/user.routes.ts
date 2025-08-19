import express from "express";
import { getAll, getById, deleteById } from "../controllers/user.controller";
import { allAdmins } from "../types/global.types";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authenticate(allAdmins), getAll);
router.get("/:id", getById);
router.delete("/:id", authenticate(allAdmins), deleteById);

export default router;
