import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generar JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// @desc    Registrar usuario
// @route   POST /api/users/register
// @access  Public
export const register = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      email,
      telefono,
      empresa,
      tipoEmpresa,
      tipoInmobiliaria,
      cantidadAgentes,
      numeroLicencia,
      slug,
      contraseña,
    } = req.body;

    // Validaciones básicas
    if (!nombre || !apellido || !email || !contraseña || !empresa) {
      return res.status(400).json({
        success: false,
        message:
          "Los campos nombre, apellido, email, contraseña y empresa son requeridos",
      });
    }

    if (contraseña.length < 6) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    // Validar formato de email
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Por favor ingresa un email válido",
      });
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "El usuario ya existe con este email",
      });
    }

    // Verificar si el slug ya existe (si se proporciona)
    if (slug) {
      const slugExists = await User.findOne({ "company.slug": slug });
      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: "El slug de la inmobiliaria ya está en uso",
        });
      }
    }

    // Crear usuario
    const userData = {
      nombre: `${nombre} ${apellido}`,
      email,
      contraseña: contraseña,
      rol: "usuario",
      perfil: { telefono: telefono || "" },
      empresa: {
        nombre: empresa,
        tipo: tipoEmpresa,
        tipoInmobiliaria: tipoInmobiliaria || "residencial",
        cantidadAgentes: cantidadAgentes || 1,
        numeroLicencia: numeroLicencia || "",
        slug: slug || "",
      },
    };

    // Agregar datos de AFIP si están presentes
    if (
      req.body.cuit ||
      req.body.razonSocial ||
      req.body.categoriaFiscal ||
      req.body.fechaInicio
    ) {
      userData.datosAfip = {};
      if (req.body.cuit) userData.datosAfip.cuit = req.body.cuit;
      if (req.body.razonSocial)
        userData.datosAfip.razonSocial = req.body.razonSocial;
      if (req.body.categoriaFiscal)
        userData.datosAfip.categoriaFiscal = req.body.categoriaFiscal;
      if (req.body.fechaInicio)
        userData.datosAfip.fechaInicio = new Date(req.body.fechaInicio);
    }

    const user = await User.create(userData);
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: { user: user.getPublicProfile(), token },
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Iniciar sesión
// @route   POST /api/users/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    // Validaciones básicas
    if (!email || !contraseña) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos",
      });
    }

    // Validar formato de email
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Por favor ingresa un email válido",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas o cuenta desactivada",
      });
    }

    const isPasswordValid = await user.matchPassword(contraseña);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: { user: user.getPublicProfile(), token },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Obtener perfil del usuario actual
// @route   GET /api/users/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: { user: user.getPublicProfile() },
    });
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Actualizar perfil del usuario
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { nombre, email, perfil } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Verificar si el email ya existe
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "El email ya está en uso",
        });
      }
    }

    if (nombre) user.name = nombre;
    if (email) user.email = email;
    if (perfil) user.profile = { ...user.profile, ...perfil };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Perfil actualizado exitosamente",
      data: { user: user.getPublicProfile() },
    });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Cambiar contraseña
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { contraseñaActual, nuevaContraseña } = req.body;

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const isCurrentPasswordValid = await user.matchPassword(contraseñaActual);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Contraseña actual incorrecta",
      });
    }

    user.password = nuevaContraseña;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Contraseña actualizada exitosamente",
    });
  } catch (error) {
    console.error("Error cambiando contraseña:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Obtener todos los usuarios (Admin)
// @route   GET /api/users
// @access  Private (Admin only)
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filters = {};
    if (req.query.role) filters.role = req.query.role;
    if (req.query.isActive !== undefined)
      filters.isActive = req.query.isActive === "true";
    if (req.query.search) {
      filters.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const users = await User.find(filters)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filters);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Obtener usuario por ID (Admin)
// @route   GET /api/users/:id
// @access  Private (Admin only)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Actualizar usuario (Admin)
// @route   PUT /api/users/:id
// @access  Private (Admin only)
export const updateUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Validaciones de seguridad
    if (req.user._id.toString() === req.params.id) {
      if (updateData.isActive === false) {
        return res.status(400).json({
          success: false,
          message: "No puedes desactivar tu propia cuenta",
        });
      }
      if (updateData.role && updateData.role !== user.role) {
        return res.status(400).json({
          success: false,
          message: "No puedes cambiar tu propio rol",
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Usuario actualizado exitosamente",
      data: { user: updatedUser },
    });
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Eliminar usuario (Admin)
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "No puedes eliminar tu propia cuenta",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Obtener estadísticas de usuarios (Admin)
// @route   GET /api/users/stats
// @access  Private (Admin only)
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const usersByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    const recentUsers = await User.find()
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        usersByRole,
        recentUsers,
      },
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Verificar token
// @route   GET /api/users/verify
// @access  Private
export const verifyToken = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Token válido",
      data: { user: req.user },
    });
  } catch (error) {
    console.error("Error verificando token:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};
