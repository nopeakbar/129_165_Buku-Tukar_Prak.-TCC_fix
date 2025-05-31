// routes/protectedRoute.js (ES Module version)
import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
const router = express.Router()

router.get('/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'Ini konten rahasia!',
    user: req.user  // Data dari token JWT
  })
})

export default router
