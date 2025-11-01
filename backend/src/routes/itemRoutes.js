import { Router } from 'express'
import { addItem, getItems, updateItem, deleteItem } from '../controllers/itemController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()
router.post('/add', requireAuth, addItem)
router.get('/get', requireAuth, getItems)
router.put('/update/:id', requireAuth, updateItem)
router.delete('/delete/:id', requireAuth, deleteItem)
export default router
