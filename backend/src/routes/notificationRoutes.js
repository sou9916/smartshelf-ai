import { Router } from 'express'
import { getAll, markRead, sendTest } from '../controllers/notificationController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()
router.get('/get-all', requireAuth, getAll)
router.post('/mark-read', requireAuth, markRead)
router.post('/send-test', requireAuth, sendTest) // optional
export default router
