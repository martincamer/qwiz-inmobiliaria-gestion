import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./src/config/database.js";
import userRoutes from "./src/routes/userRoutes.js";
import propiedadesRoutes from "./src/routes/propiedadesRoutes.js";
import propietariosRoutes from "./src/routes/propietariosRoutes.js";
import inquilinosRoutes from "./src/routes/inquilinosRoutes.js";

import { errorHandler } from "./src/middleware/errorHandler.js";
import { notFound } from "./src/middleware/notFound.js";

// Configurar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de seguridad
app.use(helmet());

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

// Middleware de logging para desarrollo
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`\n🔍 ${req.method} ${req.path}`);
    console.log("📝 Headers:", JSON.stringify(req.headers, null, 2));
    if (req.body && Object.keys(req.body).length > 0) {
      console.log("📦 Body:", JSON.stringify(req.body, null, 2));
    }
    if (req.query && Object.keys(req.query).length > 0) {
      console.log("🔗 Query:", JSON.stringify(req.query, null, 2));
    }
    console.log("⏰ Timestamp:", new Date().toISOString());
    console.log("─".repeat(50));
    next();
  });
}

// Rutas
app.use("/api/auth", userRoutes);
app.use("/api/propiedades", propiedadesRoutes);
app.use("/api/propietarios", propietariosRoutes);
app.use("/api/inquilinos", inquilinosRoutes);

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
