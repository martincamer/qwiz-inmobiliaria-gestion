import express from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  verifyToken,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Rutas públicas
router.post("/register", register);
router.post("/login", login);

// Rutas protegidas (requieren autenticación)
router.use(protect); // Todas las rutas siguientes requieren autenticación

// Rutas del usuario actual
router.get("/me", getMe);
router.put("/profile", updateProfile);
router.put("/change-password", changePassword);
router.get("/verify", verifyToken);

// Rutas de administración (solo admin)
router.get("/stats", authorize("admin"), getUserStats);
router.get("/", authorize("admin"), getUsers);
router.get("/:id", authorize("admin"), getUserById);
router.put("/:id", authorize("admin"), updateUser);
router.delete("/:id", authorize("admin"), deleteUser);

export default router;
