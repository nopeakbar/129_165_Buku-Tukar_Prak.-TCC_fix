// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize'; // Add this import
import User from '../models/User.js';
import { uploadToGCS } from '../middleware/uploadMiddleware.js'; // Add this import

/**
 * POST /auth/register
 * Register new user with optional avatar
 */
export const register = async (req, res) => {
  try {
    const { username, email, password, whatsappNumber, addressUser } = req.body;

    // Validation
    if (!username || !email || !password) {
      const field = !username ? 'username' : !email ? 'email' : 'password';
      return res.status(400).json({
        status: 'Error',
        message: `${field} cannot be empty`,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'Error',
        message: 'User with this email or username already exists',
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      whatsappNumber: whatsappNumber || null,
      addressUser: addressUser || null,
      avatarUrl: avatarUrl,
    });

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Save refresh token to database
    user.refresh_token = refreshToken;
    await user.save();

    return res.status(201).json({
      status: 'Success',
      message: 'Registration successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          whatsappNumber: user.whatsappNumber,
          addressUser: user.addressUser,
          avatarUrl: user.avatarUrl,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      status: 'Error',
      message: error.message || 'Internal server error',
    });
  }
};

/**
 * POST /auth/login
 * Login user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'Error',
        message: 'Email and password are required',
      });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: 'Error',
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'Error',
        message: 'Invalid email or password',
      });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Save refresh token
    user.refresh_token = refreshToken;
    await user.save();

    return res.status(200).json({
      status: 'Success',
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          whatsappNumber: user.whatsappNumber,
          addressUser: user.addressUser,
          avatarUrl: user.avatarUrl,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      status: 'Error',
      message: error.message || 'Internal server error',
    });
  }
};

/**
 * POST /auth/refresh-token
 * Refresh access token
 */
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        status: 'Error',
        message: 'Refresh token is required',
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Find user
    const user = await User.findByPk(decoded.userId);
    if (!user || user.refresh_token !== refreshToken) {
      return res.status(401).json({
        status: 'Error',
        message: 'Invalid refresh token',
      });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    return res.status(200).json({
      status: 'Success',
      message: 'Token refreshed',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(401).json({
      status: 'Error',
      message: 'Invalid refresh token',
    });
  }
};

/**
 * POST /auth/logout
 * Logout user
 */
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        status: 'Error',
        message: 'Refresh token is required',
      });
    }

    // Find user and clear refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (user) {
      user.refresh_token = null;
      await user.save();
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
    });
  }
};