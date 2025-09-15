import express from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  verifyToken,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Rutas públicas
router.post("/register", register);
router.post("/login", login);

// Rutas protegidas
router.get("/me", protect, getMe);
router.get("/verify", protect, verifyToken);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;
