import express from 'express'
import { addExchangeHistory, getAllExchangeHistory, getExchangeHistoryById } from '../controllers/ExchangeHistoryController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
const router = express.Router()

router.post('/', authMiddleware, addExchangeHistory)
router.get('/', authMiddleware,getAllExchangeHistory)
router.get('/:id', authMiddleware,getExchangeHistoryById)

export default router
