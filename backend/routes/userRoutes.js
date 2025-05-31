// routes/userRoutes.js
import express from 'express';
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getProfile,
    updateProfile,
    changePassword,
    uploadAvatar // Pastikan ini diimpor dari userController.js
} from '../controllers/userController.js';
import { upload } from '../middleware/uploadMiddleware.js'; // Impor 'upload'
import { authMiddleware } from '../middleware/authMiddleware.js'; // Asumsikan Anda memiliki ini untuk rute yang dilindungi

const router = express.Router();

// Rute publik (sesuaikan perlindungan sesuai kebutuhan)
router.get('/', getUsers);
router.get('/:id', getUserById);

// Rute dengan unggahan file
// Untuk createUser, Multer akan mencari file di bidang 'avatar'.
router.post('/', authMiddleware, upload.single('avatar'), createUser); // Contoh: admin membuat pengguna dengan avatar

// Rute yang memerlukan otentikasi dan mungkin unggahan file
router.get('/profile/me', authMiddleware, getProfile); // Rute profil yang lebih baik
router.put('/profile', authMiddleware, upload.single('avatar'), updateProfile);
router.put('/profile/change-password', authMiddleware, changePassword);
router.post('/profile/upload-avatar', authMiddleware, upload.single('avatar'), uploadAvatar);

// Rute admin untuk mengelola pengguna (contoh)
router.put('/:id', authMiddleware, upload.single('avatar'), updateUser); // Contoh: admin memperbarui pengguna dengan avatar
router.delete('/:id', authMiddleware, deleteUser);

export default router;