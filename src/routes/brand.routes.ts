import express from "express";
import {
  create,
  getAll,
  getById,
  update,
  deleteById,
} from "../controllers/brand.controller";
import { authenticate } from "./../middlewares/auth.middleware";
import { allAdmins } from "../types/global.types";
import { uploader } from "../middlewares/uploader.middleware";

const router = express.Router();

const upload = uploader();

router.post("/", authenticate(allAdmins), upload.single("logo"), create);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", authenticate(allAdmins), upload.single("logo"), update);
router.delete("/:id", authenticate(allAdmins), deleteById);

export default router;
