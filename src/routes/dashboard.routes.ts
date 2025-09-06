import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { allAdmins } from "../types/global.types";
import { getDashboard } from "../controllers/dashboard.controller";

const router = express.Router();

// GET /api/dashboard
router.get("/", authenticate(allAdmins), getDashboard);

export default router;
