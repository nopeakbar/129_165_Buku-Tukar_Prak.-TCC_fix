// src/routes/exchangeRoutes.js
import express from 'express'
import {authMiddleware} from '../middleware/authMiddleware.js'
import {
  requestExchange,
  getReceivedExchanges,
  getMyExchangeRequests,
  updateExchangeStatus
} from '../controllers/exchangeController.js'

const router = express.Router()

router.post('/',        authMiddleware, requestExchange)
router.get('/received', authMiddleware, getReceivedExchanges)
router.get('/sent',     authMiddleware, getMyExchangeRequests)
router.put('/:id',      authMiddleware, updateExchangeStatus)

export default router
