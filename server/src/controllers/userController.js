import User from "../models/User.js";

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private (Admin only)
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtros
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
      .select("-password -passwordResetToken -passwordResetExpires")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filters);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers: total,
          hasNextPage: page < totalPages,
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

// @desc    Obtener usuario por ID
// @route   GET /api/users/:id
// @access  Private (Admin only)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -passwordResetToken -passwordResetExpires"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Actualizar usuario
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

    // No permitir que un usuario se desactive a sí mismo
    if (
      req.user._id.toString() === req.params.id &&
      updateData.isActive === false
    ) {
      return res.status(400).json({
        success: false,
        message: "No puedes desactivar tu propia cuenta",
      });
    }

    // No permitir que un usuario cambie su propio rol
    if (
      req.user._id.toString() === req.params.id &&
      updateData.role &&
      updateData.role !== user.role
    ) {
      return res.status(400).json({
        success: false,
        message: "No puedes cambiar tu propio rol",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password -passwordResetToken -passwordResetExpires");

    res.status(200).json({
      success: true,
      message: "Usuario actualizado exitosamente",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Eliminar usuario
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

    // No permitir que un usuario se elimine a sí mismo
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

// @desc    Obtener estadísticas de usuarios
// @route   GET /api/users/stats
// @access  Private (Admin only)
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });

    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
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
        inactiveUsers,
        usersByRole,
        recentUsers,
      },
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas de usuarios:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Activar/Desactivar usuario
// @route   PATCH /api/users/:id/toggle-status
// @access  Private (Admin only)
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // No permitir que un usuario se desactive a sí mismo
    if (req.user._id.toString() === req.params.id && user.isActive) {
      return res.status(400).json({
        success: false,
        message: "No puedes desactivar tu propia cuenta",
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Usuario ${
        user.isActive ? "activado" : "desactivado"
      } exitosamente`,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isActive: user.isActive,
        },
      },
    });
  } catch (error) {
    console.error("Error cambiando estado del usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// @desc    Obtener historial de login de usuario
// @route   GET /api/users/:id/login-history
// @access  Private (Admin only)
export const getUserLoginHistory = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("name email loginHistory")
      .populate("loginHistory");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        loginHistory: user.loginHistory,
      },
    });
  } catch (error) {
    console.error("Error obteniendo historial de login:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};
