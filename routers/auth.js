import express from "express";
import { register, login, verifyEmail, forgotPassword, checkResetPasswordToken, resetPassword } from "../controllers/auth.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user/:id/verify/:verificationCode", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/check-reset-token", checkResetPasswordToken);
router.post("/reset-password", resetPassword);

export default router;
