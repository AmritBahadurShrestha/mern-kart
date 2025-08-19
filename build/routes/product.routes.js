"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const global_types_1 = require("../types/global.types");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const uploader_middleware_1 = require("./../middlewares/uploader.middleware");
const router = express_1.default.Router();
const upload = (0, uploader_middleware_1.uploader)();
router.post("/", (0, auth_middleware_1.authenticate)(global_types_1.allAdmins), upload.fields([
    {
        name: "cover_image",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 5,
    },
]), product_controller_1.create);
router.put("/:id", (0, auth_middleware_1.authenticate)(global_types_1.allAdmins), upload.fields([
    {
        name: "cover_image",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 5,
    },
]), product_controller_1.update);
router.get("/", product_controller_1.getAll);
router.get("/featured", product_controller_1.getFeaturedProducts);
router.get("/:id", product_controller_1.getById);
router.delete("/:id", (0, auth_middleware_1.authenticate)(global_types_1.allAdmins), product_controller_1.deleteById);
router.get("/category/:categoryId", product_controller_1.getByCategory);
router.get("/brand/:brandId", product_controller_1.getByBrand);
exports.default = router;
