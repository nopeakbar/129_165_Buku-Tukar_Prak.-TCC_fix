// routes/authRoutes.js
import express from 'express';
import { register, login, refreshToken, logout } from '../controllers/authController.js';
import { upload } from '../middleware/uploadMiddleware.js'; // Impor 'upload' dari uploadMiddleware

const router = express.Router();

// Untuk rute /register, Multer akan mencari file di bidang 'avatar' dari form-data.
// req.file akan diisi jika file dikirim dengan nama bidang 'avatar'.
router.post('/register', upload.single('avatar'), register); // Terapkan upload.single('avatar')
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;