import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import connectDB from "./src/config/database.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import tenantRoutes from "./src/routes/tenantRoutes.js";
import ownerRoutes from "./src/routes/ownerRoutes.js";
import propertyRoutes from "./src/routes/propertyRoutes.js";
import saleRoutes from "./src/routes/saleRoutes.js";

import { errorHandler } from "./src/middleware/errorHandler.js";
import { notFound } from "./src/middleware/notFound.js";

// Configurar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // límite de 100 requests por ventana
  message: {
    error: "Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware de seguridad
app.use(helmet());
app.use(limiter);

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware para parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/inquilinos", tenantRoutes);
app.use("/api/propietarios", ownerRoutes);
app.use("/api/propiedades", propertyRoutes);
app.use("/api/ventas", saleRoutes);

// Ruta de prueba
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CRM Contable API está funcionando correctamente",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Middleware de manejo de errores
app.use(notFound);
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`);
  console.log(`📡 API disponible en: http://localhost:${PORT}/api`);
});
