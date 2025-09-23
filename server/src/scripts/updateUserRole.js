import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const updateUserRole = async () => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB");

    // Obtener email del usuario desde argumentos de línea de comandos
    const email = process.argv[2];
    const newRole = process.argv[3] || "admin";

    if (!email) {
      console.log("Uso: npm run update:role <email> [role]");
      console.log("Ejemplo: npm run update:role usuario@ejemplo.com admin");
      console.log(
        "Roles disponibles: admin, user, accountant, agente, propietario"
      );
      process.exit(1);
    }

    // Buscar el usuario por email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log(`Usuario con email ${email} no encontrado`);
      process.exit(1);
    }

    // Actualizar el rol
    const oldRole = user.role;
    user.role = newRole;
    await user.save();

    console.log("Usuario actualizado exitosamente:");
    console.log("Email:", user.email);
    console.log("Nombre:", user.name);
    console.log("Rol anterior:", oldRole);
    console.log("Rol nuevo:", user.role);
    console.log("");
    console.log(
      "El usuario ahora puede acceder a las funciones de propietarios"
    );
  } catch (error) {
    console.error("Error actualizando usuario:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Desconectado de MongoDB");
    process.exit(0);
  }
};

// Ejecutar el script
updateUserRole();
