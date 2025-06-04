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
    uploadAvatar 
} from '../controllers/userController.js';
import { upload } from '../middleware/uploadMiddleware.js'; 
import { authMiddleware } from '../middleware/authMiddleware.js'; 

const router = express.Router();
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', authMiddleware, upload.single('avatar'), createUser); 
router.get('/profile/me', authMiddleware, getProfile); 
router.put('/profile', authMiddleware, upload.single('avatar'), updateProfile);
router.put('/profile/change-password', authMiddleware, changePassword);
router.post('/profile/upload-avatar', authMiddleware, upload.single('avatar'), uploadAvatar);

// Rute admin untuk mengelola pengguna (contoh ajasih klo ada)
router.put('/:id', authMiddleware, upload.single('avatar'), updateUser); // Contoh: admin memperbarui pengguna dengan avatar
router.delete('/:id', authMiddleware, deleteUser);

export default router;