import express from "express";
import { register, login, logout, profile } from "../controllers/auth.controller";
import { AllUsersAdmins } from "../types/global.types";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate(AllUsersAdmins), profile);

export default router;
