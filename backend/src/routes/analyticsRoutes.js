import { Router } from 'express'
import { categorySummary, expiryStats } from '../controllers/analyticsController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()
router.get('/category-summary', requireAuth, categorySummary)
router.get('/expiry-stats', requireAuth, expiryStats)
export default router
