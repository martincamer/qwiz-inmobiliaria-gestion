import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const seedAdmin = async () => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');

    // Verificar si ya existe un usuario admin
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('Ya existe un usuario admin:', existingAdmin.email);
      process.exit(0);
    }

    // Crear usuario admin por defecto
    const adminData = {
      name: 'Administrador',
      email: 'admin@qwizinmobiliaria.com',
      password: 'admin123456', // Cambiar en producción
      role: 'admin',
      userType: 'owner',
      isActive: true,
      profile: {
        phone: '+54 9 11 1234-5678',
      },
      company: {
        name: 'QWIZ Inmobiliaria',
        type: 'inmobiliaria',
        realEstateType: 'residential',
        agentCount: 1,
        licenseNumber: 'ADMIN001',
        slug: 'qwiz-inmobiliaria-admin',
      },
    };

    const admin = await User.create(adminData);
    console.log('Usuario admin creado exitosamente:');
    console.log('Email:', admin.email);
    console.log('Contraseña: admin123456');
    console.log('Rol:', admin.role);
    console.log('');
    console.log('IMPORTANTE: Cambia la contraseña después del primer login');

  } catch (error) {
    console.error('Error creando usuario admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
    process.exit(0);
  }
};

// Ejecutar el script
seedAdmin();