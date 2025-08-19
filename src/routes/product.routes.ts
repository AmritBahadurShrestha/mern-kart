import express from "express";
import {
  create,
  getAll,
  getById,
  update,
  deleteById,
  getByCategory,
  getByBrand,
  getFeaturedProducts,
} from "../controllers/product.controller";
import { allAdmins } from "../types/global.types";
import { authenticate } from "../middlewares/auth.middleware";
import { uploader } from "./../middlewares/uploader.middleware";

const router = express.Router();
const upload = uploader();

router.post(
  "/",
  authenticate(allAdmins),
  upload.fields([
    {
      name: "cover_image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  create
);
router.put(
  "/:id",
  authenticate(allAdmins),
  upload.fields([
    {
      name: "cover_image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  update
);

router.get("/", getAll);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getById);
router.delete("/:id", authenticate(allAdmins), deleteById);

router.get("/category/:categoryId", getByCategory);
router.get("/brand/:brandId", getByBrand);

export default router;
