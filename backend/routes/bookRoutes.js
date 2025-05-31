import express from 'express'
import {authMiddleware} from '../middleware/authMiddleware.js'
import {
  addBook,
  getAllBooks,
  getMyBooks,
  updateBook,
  deleteBook,
  getBookDetail
} from '../controllers/bookController.js'

const router = express.Router()

router.post('/',           authMiddleware, addBook)
router.get('/',            getAllBooks)
router.get('/me',          authMiddleware, getMyBooks)
router.get('/:id',         getBookDetail)
router.put('/:id',         authMiddleware, updateBook)
router.delete('/:id',      authMiddleware, deleteBook)
export default router
