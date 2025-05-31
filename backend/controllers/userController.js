// src/controllers/userController.js
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { uploadToGCS, deleteFromGCS } from '../middleware/uploadMiddleware.js';

/**
 * GET /users
 * Ambil semua user (tanpa password & field sensitif)
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        'id',
        'username',
        'email',
        'whatsappNumber',
        'addressUser',
        'avatarUrl',
        'createdAt',
        'updatedAt',
      ],
    });
    return res.status(200).json({
      status: 'Success',
      message: 'Users retrieved',
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

/**
 * GET /users/:id
 * Ambil detail user by ID
 */
export const getUserById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await User.findByPk(id, {
      attributes: [
        'id',
        'username',
        'email',
        'whatsappNumber',
        'addressUser',
        'avatarUrl',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!user) {
      return res.status(404).json({
        status: 'Error',
        message: 'User tidak ditemukan',
      });
    }
    return res.status(200).json({
      status: 'Success',
      message: 'User retrieved',
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

/**
 * POST /users
 * Buat user baru (Admin)
 */
export const createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      whatsappNumber,
      addressUser,
    } = req.body;

    if (!username || !email || !password) {
      const field = !username ? 'username' : !email ? 'email' : 'password';
      return res.status(400).json({
        status: 'Error',
        message: `${field} cannot be empty`,
      });
    }

    let avatarUrl = null;
    
    // Handle avatar upload if file exists
    if (req.file) {
      try {
        avatarUrl = await uploadToGCS(req.file, 'avatars');
      } catch (uploadError) {
        return res.status(400).json({
          status: 'Error',
          message: 'Failed to upload avatar',
          error: uploadError.message,
        });
      }
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashed,
      whatsappNumber: whatsappNumber || null,
      addressUser: addressUser || null,
      avatarUrl: avatarUrl,
    });

    return res.status(201).json({
      status: 'Success',
      message: 'User created',
      data: { id: user.id, avatarUrl: user.avatarUrl },
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

/**
 * PUT /users/:id
 * Update user by ID (Admin)
 */
export const updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const {
      username,
      email,
      password,
      whatsappNumber,
      addressUser,
    } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: 'Error',
        message: 'User tidak ditemukan',
      });
    }

    if (!username || !email) {
      const field = !username ? 'username' : 'email';
      return res.status(400).json({
        status: 'Error',
        message: `${field} cannot be empty`,
      });
    }

    let avatarUrl = user.avatarUrl;
    
    // Handle avatar upload if new file exists
    if (req.file) {
      try {
        // Delete old avatar if exists
        if (user.avatarUrl) {
          await deleteFromGCS(user.avatarUrl);
        }
        
        // Upload new avatar
        avatarUrl = await uploadToGCS(req.file, 'avatars');
      } catch (uploadError) {
        return res.status(400).json({
          status: 'Error',
          message: 'Failed to upload avatar',
          error: uploadError.message,
        });
      }
    }

    user.username = username;
    user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    user.whatsappNumber = whatsappNumber || user.whatsappNumber;
    user.addressUser = addressUser || user.addressUser;
    user.avatarUrl = avatarUrl;

    await user.save();
    return res.status(200).json({
      status: 'Success',
      message: 'User updated',
      data: { avatarUrl: user.avatarUrl }
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

/**
 * DELETE /users/:id
 * Hapus user by ID (Admin)
 */
export const deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: 'Error',
        message: 'User tidak ditemukan',
      });
    }
    
    // Delete avatar from GCS if exists
    if (user.avatarUrl) {
      await deleteFromGCS(user.avatarUrl);
    }
    
    await user.destroy();
    return res.status(200).json({
      status: 'Success',
      message: 'User deleted',
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

/**
 * GET /users/profile
 * Ambil profile user saat ini
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId, {
      attributes: [
        'id',
        'username',
        'email',
        'whatsappNumber',
        'addressUser',
        'avatarUrl',
      ],
    });
    if (!user) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not found',
      });
    }
    return res.status(200).json({
      status: 'Success',
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

/**
 * PUT /users/profile
 * Update profile user saat ini
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      username,
      email,
      whatsappNumber,
      addressUser,
    } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not found',
      });
    }

    let avatarUrl = user.avatarUrl;
    
    // Handle avatar upload if new file exists
    if (req.file) {
      try {
        // Delete old avatar if exists
        if (user.avatarUrl) {
          await deleteFromGCS(user.avatarUrl);
        }
        
        // Upload new avatar
        avatarUrl = await uploadToGCS(req.file, 'avatars');
      } catch (uploadError) {
        return res.status(400).json({
          status: 'Error',
          message: 'Failed to upload avatar',
          error: uploadError.message,
        });
      }
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (whatsappNumber) user.whatsappNumber = whatsappNumber;
    if (addressUser) user.addressUser = addressUser;
    user.avatarUrl = avatarUrl;

    await user.save();
    return res.status(200).json({
      status: 'Success',
      message: 'Profile updated',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        whatsappNumber: user.whatsappNumber,
        addressUser: user.addressUser,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

/**
 * PUT /users/profile/change-password
 * Ganti password user saat ini
 */
export const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not found',
      });
    }

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      return res.status(400).json({
        status: 'Error',
        message: 'Old password is incorrect',
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.status(200).json({
      status: 'Success',
      message: 'Password updated',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

/**
 * POST /users/profile/upload-avatar
 * Upload avatar only endpoint
 */
export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.userId;
    
    if (!req.file) {
      return res.status(400).json({
        status: 'Error',
        message: 'No file uploaded',
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not found',
      });
    }

    try {
      // Delete old avatar if exists
      if (user.avatarUrl) {
        await deleteFromGCS(user.avatarUrl);
      }
      
      // Upload new avatar
      const avatarUrl = await uploadToGCS(req.file, 'avatars');
      
      // Update user avatar URL
      user.avatarUrl = avatarUrl;
      await user.save();
      
      return res.status(200).json({
        status: 'Success',
        message: 'Avatar uploaded successfully',
        data: { avatarUrl },
      });
    } catch (uploadError) {
      return res.status(400).json({
        status: 'Error',
        message: 'Failed to upload avatar',
        error: uploadError.message,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};