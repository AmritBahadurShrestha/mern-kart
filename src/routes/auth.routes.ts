import express from "express";
import { register, login } from "../controllers/auth.controller";
import { AllUsersAdmins } from "../types/global.types";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", login);
router.get("/me", authenticate(AllUsersAdmins), login);

export default router;
